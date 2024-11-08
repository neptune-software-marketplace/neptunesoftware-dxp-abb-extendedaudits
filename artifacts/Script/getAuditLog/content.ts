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

/* DEBUG * / 
loWhere = [ 
    { beginDate: "2023-12-05 15:38:24", endDate: "2023-12-05 15:38:25" },
]
/* */

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
const resolveOperator = function ( poOperatorsAndText ) {
	let loOperatorAndText = JSON.parse(JSON.stringify(poOperatorsAndText));
	while( loOperatorAndText.includes("AND") ) {
		let loAndIndex = loOperatorAndText.indexOf("AND");
		let loAndObject = {and: { left: loOperatorAndText[loAndIndex - 1], right: loOperatorAndText[loAndIndex + 1] }};
		loOperatorAndText.splice( loAndIndex - 1, 3, loAndObject );
	}
	while( loOperatorAndText.includes("OR") ) {
		let loOrIndex = loOperatorAndText.indexOf("OR");
		let loOrObject = {or: { left: loOperatorAndText[loOrIndex - 1], right: loOperatorAndText[loOrIndex + 1] }};
		loOperatorAndText.splice( loOrIndex - 1, 3, loOrObject );
	}
	return loOperatorAndText[0];
}
const resolveExpression = function ( pvInput ) {
	if (pvInput.indexOf("AND") >= 0) {
		let loRegex = /(.*?)(AND)|(.*)$/g;
		let loOperatorAndText = [];
		while( true ) {
            let loMatch = loRegex.exec( pvInput );
			if (["AND"].includes(loMatch[2])) {
				loOperatorAndText.push(loMatch[1].trim());
				loOperatorAndText.push(loMatch[2]);
			}
			else {
				loOperatorAndText.push(loMatch[0].trim());
                break;
			}
		}
		return resolveOperator( loOperatorAndText );
	}
	return pvInput;
}
const buildSearchStringsFromOperation = function( poSearchExpression, pvReverseLogic ) {
	if (typeof poSearchExpression === "string") { return [`%${poSearchExpression}%`]; }
	
    let lvReverseLogic = !!pvReverseLogic;
	let loAndOperation = !!poSearchExpression.and;
	let loLeftOperation = buildSearchStringsFromOperation( 
		(loAndOperation) ? poSearchExpression.and.left : poSearchExpression.or.left );
	let loRightOperation = buildSearchStringsFromOperation( 
		(loAndOperation) ? poSearchExpression.and.right : poSearchExpression.or.right );
	if (loAndOperation != lvReverseLogic) {
		let loReturnData = [];
		for (let loLeftValue of loLeftOperation) {
			for (let loRightValue of loRightOperation) {
				loReturnData.push(`${loLeftValue}${loRightValue}`.replace('%%', '%'));
			}
		}
		return loReturnData;
	}
	else {
		return loLeftOperation.concat( loRightOperation );
	}
}
const buildWildcardCondition = function( pvField, poSearchExpression ) {
	if ( poSearchExpression === "string" ) {
		return `"${pvField}" LIKE '%${poSearchExpression}%'`;
	}
	let loSearchStrings = buildSearchStringsFromOperation( poSearchExpression );
	let loWildcardCondition = [];
	for (let lvSearchString of loSearchStrings) {
		loWildcardCondition.push(`"${pvField}" LIKE '${lvSearchString}'`)
	}
    return loWildcardCondition.join(' OR ');
}

if (Array.isArray(loWhere) && loWhere.length) {
    for (let loWhereItem of loWhere) {
        let loFieldsAudit = [];
        let loFieldsUserActivity = [];
        if (loWhereItem?.objectType) { loFieldsAudit.push(`"objectType" = '${loWhereItem.objectType}'`); }
        if (loWhereItem?.objectKey) { 
            loFieldsAudit.push(`"objectKey" = '${loWhereItem.objectKey}'`); 
            if ( canTargetUserActivity([loWhereItem], false) ) {
                loFieldsUserActivity.push(`"userID" = '${loWhereItem.objectKey}'`);
            }
        }
        if (loWhereItem?.action) { loFieldsAudit.push(`"action" = '${loWhereItem.action}'`); }
        if (loWhereItem?.changedBy) { 
            loFieldsAudit.push(`"changedBy" = '${loWhereItem.changedBy}'`); 
            if ( canTargetUserActivity([loWhereItem], false) ) {
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
                let lvBeginDate = (new Date(loWhereItem.beginDate)).toISOString().slice(0,19).replace("T", " ");
                let lvEndDate = new Date(loWhereItem.endDate).toISOString().slice(11,19);
                if ((lvEndDate === "00:00:00") && (loWhereItem.endDate.match(/^\d{4}-\d{2}-\d{2}[T ]?\s*$/g))) {
                    lvEndDate = (new Date((new Date(loWhereItem.endDate)).getTime()+C_ONE_DAY)).toISOString().slice(0,19).replace("T", " ");
                } else {
                    lvEndDate = new Date(loWhereItem.endDate).toISOString().slice(0,19).replace("T", " ");
                }
                loFieldsAudit.push(`( ( "createdAt" between '${lvBeginDate}' AND '${lvEndDate}' ) OR ( "updatedAt" between '${lvBeginDate}' AND '${lvEndDate}' ) )`)            
                loFieldsUserActivity.push( `( "createdAt" between '${lvBeginDate}' AND '${lvEndDate}' )` )
            }
        }
        if (loWhereItem?.content) {
            let loSearchExpression = resolveExpression( loWhereItem.content );
            if (typeof loSearchExpression === "string" ) {
                loFieldsAudit.push(`"content" LIKE '%${loSearchExpression}%'`);
                if (canTargetUserActivity([loWhereItem], false)) {
                    loFieldsUserActivity.push(`( ${
                        [
                            `( "action" LIKE '%${loSearchExpression}%' )`,
                            `( "result" LIKE '%${loSearchExpression}%' )`,
                            `( "data" LIKE '%${loSearchExpression}%' )`
                        ].join(' OR ')
                    } )`);
                }
            }
            else {
                loFieldsAudit.push( buildWildcardCondition( 'content', loSearchExpression ) );
                if (canTargetUserActivity([loWhereItem], false)) {
                    let loSearchStrings = buildSearchStringsFromOperation(loSearchExpression, true);
                    let loFieldsUserTemp = [];
                    for (let lvSearchString of loSearchStrings) {
                        loFieldsUserTemp.push(`( ${
                            [
                                `( "action" LIKE '${lvSearchString}' )`,
                                `( "result" LIKE '${lvSearchString}' )`,
                                `( "data" LIKE '${lvSearchString}' )`
                            ].join(' OR ')
                        } )`);
                    }
                    loFieldsUserActivity.push(`( ${loFieldsUserTemp.join(' AND ')} )`);
                }
            }
        }
        if ( loFieldsAudit.length ) {
            loQueryAudit.push( `( ${loFieldsAudit.join(' AND ')} )`);
            if (canTargetUserActivity([loWhereItem], false)) {
                loQueryUserActivity.push( `( ${loFieldsUserActivity.join(' AND ')} )` );
            }
        }
    }
}
else {
    result.statusCode = 400;
    result.data = { error: C_ERROR_MESSAGE };
    return complete();
};

let lvAuditWhere = loQueryAudit.join(' OR ');
let lvSelect = `SELECT * FROM audit_log WHERE ${lvAuditWhere} ORDER BY "updatedAt" DESC`;

const loResult = await p9.manager.query( lvSelect );

if ( loQueryUserActivity.length ) {
    let lvUserActivityWhere = loQueryUserActivity.join(' OR ');
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
    let lvUserActivitySelect = lvUserActivityWhere.match(/^\(\s*\)$/)
                                ? `SELECT * FROM user_activity`
                                : `SELECT * FROM user_activity WHERE ${lvUserActivityWhere}`;
    const loUserActivityResult = await p9.manager.query( lvUserActivitySelect );
    if (Array.isArray(loUserActivityResult) && loQueryUserActivity.length) {
        for (let loUserActivity of loUserActivityResult) {
            insertElement({
                "id": `*${loUserActivity?.id}`,
                "createdAt": loUserActivity?.createdAt,
                "updatedAt": loUserActivity?.createdAt,
                "changedBy": (loIdUsernameRelation[loUserActivity?.userID]?.username) 
                                ? loIdUsernameRelation[loUserActivity.userID].username
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

result.statusCode = 200;
result.data = {
    result: {
        audit: loResult
    }
};

return complete();
