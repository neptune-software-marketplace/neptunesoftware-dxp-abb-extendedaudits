/*
    Parameters:
        where: [
            {
                objectType,
                objectKey, 
                action,
                beginDate: "yyyy-MM-dd", 
                endDate: "yyyy-MM-dd",
                changedBy
                content:
            }
        ]

    NOTE: the virtual action
*/

//
// build the query based on the input
let loQueryAudit = [];
let loQueryUserActivity = [];
let loWhere = req.body?.where;
const C_ERROR_MESSAGE = 'Please give at least 1 valid parameter';

/* DEBUG * / // <--- joining '*' and '/' will remove the comment in the DEBUG code below 
loWhere = [ 
    // { objectType: "User" },
    // { beginDate: "2023-10-16", endDate: "2023-10-17" },
    // { objectType: "User", beginDate: "2023-10-16", endDate: "2023-10-17" },
    // { beginDate: "2023-10-17" },
    // { changedBy: 'paulo.reis.rosa@neptune-software.com', beginDate: "2023-10-19", endDate: "2023-10-19" },
    // { objectKey:"112b3c12-d9b6-467d-bf6b-ae3f8aaec65f", changedBy: 'rommel@neptune-software.com', action: "Activity", beginDate: "2023-10-18", endDate: "2023-10-19", content: 'Logout' },
    { objectKey:"New" },
    // { action: "Save" },
]
/* */

console.log('Calculating query...')
const C_ONE_DAY = 24*60*60*1000; // amount of milliseconds in a day

const canTargetUserActivity = ( poWhereCond, pvStrictAction ) => {
    if (Array.isArray(poWhereCond)) {
        for (let loWhereItem of poWhereCond) {
            if ( [undefined, null, 'User'].includes(loWhereItem?.objectType) && (loWhereItem?.objectKey !== 'New') ) {
                return (pvStrictAction)
                        ? ['Activity'].includes(loWhereItem?.action)
                        : [undefined, null, 'Activity'].includes(loWhereItem?.action);
            }
        }
    }
    return false;
}
//
// Code for the user activity section
// Manages relations between ID and Username
const loIdUsernameRelation = {};
const loUsernameIdRelation = {};
const getIdOfUsername = async function (pvUsername) {
    if (loUsernameIdRelation[pvUsername]) {
        return loUsernameIdRelation[pvUsername];
    }
    let loResult = await p9.manager.findOne('users', {
        select: {
            id: true,
            name: true
        },
        where: {
            username: pvUsername
        }
    })
    loIdUsernameRelation[loResult?.id] = { username: pvUsername, name: loResult?.name };
    loUsernameIdRelation[pvUsername] = { id: loResult?.id, name: loResult?.name };
    return loUsernameIdRelation[pvUsername];
}
const getUsernameOfId = async function (pvId) {
    if (loIdUsernameRelation[pvId]) {
        return loIdUsernameRelation[pvId];
    }
    let loResult = await p9.manager.findOne('users', {
        select: {
            username: true,
            name: true
        },
        where: {
            id: pvId
        }
    })
    loUsernameIdRelation[loResult?.username] = { id: pvId, name: loResult?.name };
    loIdUsernameRelation[pvId] = { username: loResult?.username, name: loResult?.name };
    return loIdUsernameRelation[pvId];
}
const getLocationOfElement = function(poElement, poArray, pvStart, pvEnd) {
    let lvStart = pvStart || 0;
    let lvEnd = pvEnd || poArray.length;
    let lvPivot = Math.floor(lvStart + (lvEnd - lvStart) / 2);
    if (lvEnd-lvStart <= 1 || poArray[lvPivot] === poElement.updatedAt) return lvPivot;
    if (poArray[lvPivot].updatedAt < poElement.updatedAt) {
        return getLocationOfElement(poElement, poArray, lvStart, lvPivot);
    } else {
        return getLocationOfElement(poElement, poArray, lvPivot, lvEnd);
    }
}
const insertElement = function (poElement, poArray) {
    if (!poArray.length) {
        poArray.push(poElement);
    }
    else {
        let lvPivot = getLocationOfElement(poElement, poArray, 0, poArray.length);
        if (poArray[lvPivot].updatedAt < poElement.updatedAt) {
            poArray.splice(lvPivot,0,poElement);
        }
        else {
            poArray.splice(lvPivot+1, 0, poElement);
        }
    }
    return poArray;
}

if (Array.isArray(loWhere) && loWhere.length) {
    for (let loWhereItem of loWhere) {
        let loFieldsAudit = [];
        let loFieldsUserActivity = [];
        if (loWhereItem?.objectType) { loFieldsAudit.push(`"objectType" = '${loWhereItem.objectType}'`); }
        if (loWhereItem?.objectKey) { 
            loFieldsAudit.push(`"objectKey" = '${loWhereItem.objectKey}'`); 
            if ( canTargetUserActivity([loWhereItem], false /* NOT strict */) ) {
                loFieldsUserActivity.push(`"userID" = '${loWhereItem.objectKey}'`);
            }
        }
        if (loWhereItem?.action) { loFieldsAudit.push(`"action" = '${loWhereItem.action}'`); }
        if (loWhereItem?.changedBy) { 
            loFieldsAudit.push(`"changedBy" = '${loWhereItem.changedBy}'`); 
            if ( canTargetUserActivity([loWhereItem], false /* NOT strict */) ) {
                loFieldsUserActivity.push(`"userID" = 'ID:${loWhereItem.changedBy}:ID'`);
            }
        }
        if (loWhereItem?.beginDate || loWhereItem?.endDate) {
            if (!loWhereItem?.beginDate) {
                loFieldsAudit.push(`( "createdAt" <= '${loWhereItem.endDate}' OR "updatedAt" <= '${loWhereItem.endDate}' )`)
                loFieldsUserActivity.push(`( "createdAt" <= '${loWhereItem.endDate}' )`)
            }
            else if (!loWhereItem?.endDate) {
                loFieldsAudit.push(`( "createdAt" >= '${loWhereItem.beginDate}' OR "updatedAt" >= '${loWhereItem.beginDate}' )`)
                loFieldsUserActivity.push(`( "createdAt" >= '${loWhereItem.beginDate}' )`)
            }
            else {
                let lvBeginDate = (new Date(loWhereItem.beginDate)).toISOString().slice(0,10);
                let lvEndDate = (new Date((new Date(loWhereItem.endDate)).getTime()+C_ONE_DAY)).toISOString().slice(0,10);
                // BETWEEN dates excludes the end date events, because it uses the 00:00:00 of each day
                loFieldsAudit.push(`( ( "createdAt" between '${lvBeginDate}' AND '${lvEndDate}' ) OR ( "updatedAt" between '${lvBeginDate}' AND '${lvEndDate}' ) )`)            
                loFieldsUserActivity.push( `( "createdAt" between '${lvBeginDate}' AND '${lvEndDate}' )` )
            }
        }
        if (loWhereItem?.content) {
            loFieldsAudit.push(`"content" LIKE '%${loWhereItem.content}%'`);
            if (canTargetUserActivity([loWhereItem], false)) {
                loFieldsUserActivity.push(`( ${
                    [
                        `( "action" LIKE '%${loWhereItem.content}%' )`,
                        `( "result" LIKE '%${loWhereItem.content}%' )`,
                        `( "data" LIKE '%${loWhereItem.content}%' )`
                    ].join(' OR ')
                } )`);
            }
        }
        if ( loFieldsAudit.length ) {
            loQueryAudit.push( `( ${loFieldsAudit.join(' AND ')} )`);
            if (canTargetUserActivity([loWhereItem], false /* NOT strict */)) {
                loQueryUserActivity.push( `( ${loFieldsUserActivity.join(' AND ')} )` );
            }
        }
    }
}
else {
    // Must have at least one condition
    result.statusCode = 400;
    result.data = { error: C_ERROR_MESSAGE };
    // console.log(result);
    return complete();
};

let lvAuditWhere = loQueryAudit.join(' OR ');
// console.log('Generated query:', lvAuditWhere);
let lvSelect = `SELECT * FROM audit_log WHERE ${lvAuditWhere} ORDER BY "updatedAt" DESC`;
log.debug("Audit select:", lvSelect);

const loResult = await p9.manager.query( lvSelect );
// for (let loRow of loResult) {
//     try {
//         loRow.content = JSON.parse(loRow.content);
//     }
//     catch(e) { /* Nothing to do */}
// }
// console.log("step user activity");

if ( loQueryUserActivity.length ) {
    // log.debug("User activity requested");
    let lvUserActivityWhere = loQueryUserActivity.join(' OR ');
    // Collects the IDs of the usernames
    const loRegex = /ID:(.*?):ID/g;
    let loMatch = { index: 0};
    while (loMatch = loRegex.exec(lvUserActivityWhere)) {
        let lvUsername = loMatch[1];
        let lvId = (loUsernameIdRelation[lvUsername]?.id) 
                    ? loUsernameIdRelation[lvUsername].id
                    : (await getIdOfUsername(lvUsername))?.id;
        lvUserActivityWhere = `${lvUserActivityWhere.slice(0,loMatch.index)}${lvId}${lvUserActivityWhere.slice(loRegex.lastIndex)}`;
        loRegex.lastIndex += lvId.length - loMatch[0].length;
    }
    // Collects the activity
    let lvUserActivitySelect = lvUserActivityWhere.match(/^\(\s*\)$/)
                                ? `SELECT * FROM user_activity`
                                : `SELECT * FROM user_activity WHERE ${lvUserActivityWhere}`;
    log.debug("User activity select:", lvUserActivitySelect);
    const loUserActivityResult = await p9.manager.query( lvUserActivitySelect );
    // console.log(loUserActivityResult);
    if (Array.isArray(loUserActivityResult) && loQueryUserActivity.length) {
        // Creates the virtual audit entries
        for (let loUserActivity of loUserActivityResult) {
            insertElement({
                "id": `*${loUserActivity?.id}`,
                "createdAt": loUserActivity?.createdAt,
                "updatedAt": loUserActivity?.createdAt,
                "changedBy": (loIdUsernameRelation[loUserActivity?.userID]?.username) 
                                ? loIdUsernameRelation[loUserActivity?.userID.username]
                                : (await getUsernameOfId(loUserActivity?.userID)).username,
                "objectType": "User",
                "objectKey": loUserActivity?.userID,
                "action": "Activity",
                "content": JSON.stringify({"detail": loUserActivity}),
                "objectName": loIdUsernameRelation[loUserActivity?.userID]?.name
            }, loResult);
        }        
    }
}
else {
    // log.debug("User activity NOT requested");
}

log.debug(loResult);

result.statusCode = 200;
result.data = {
    result: {
        audit: loResult
    }
};

// console.log(result.data.result.audit);
// console.log("step end");

return complete();