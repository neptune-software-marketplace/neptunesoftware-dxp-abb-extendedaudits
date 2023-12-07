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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c, _d, _e;
//
// build the query based on the input
var loQueryAudit = [];
var loQueryUserActivity = [];
var loWhere = (_a = req.body) === null || _a === void 0 ? void 0 : _a.where;
var C_ERROR_MESSAGE = 'Please give at least 1 valid parameter';
/* DEBUG * / // <--- joining '*' and '/' will remove the comment in the DEBUG code below
loWhere = [
    // { objectType: "User" },
    // { beginDate: "2023-12-01 00:00:00" },
    // { beginDate: "2023-12-01 00:00:00", endDate: "2023-12-06" },
    { beginDate: "2023-12-05 15:38:24", endDate: "2023-12-05 15:38:25" },
    // { objectType: "User", beginDate: "2023-10-16", endDate: "2023-10-17" },
    // { beginDate: "2023-10-17" },
    // { changedBy: 'paulo.reis.rosa@neptune-software.com', beginDate: "2023-10-19", endDate: "2023-10-19" },
    // { objectKey:"112b3c12-d9b6-467d-bf6b-ae3f8aaec65f", changedBy: 'rommel@neptune-software.com', action: "Activity", beginDate: "2023-10-18", endDate: "2023-10-19", content: 'Logout' },
    // { objectKey:"New" },
    // { action: "Save" },
    // { objectType: "User", action: "Activity", beginDate: "2023-11-10", content: "Logon AND Success" },
    // { objectType: "User", action: "Activity", objectKey: "C0F2C063-BD8A-EE11-8925-000D3ADC328D" },
    // { objectType: "User", action: "Activity", beginDate: "2023-11-10", content: "Logon" },
]
/* */
// console.log('Calculating query...')
var C_ONE_DAY = 24 * 60 * 60 * 1000; // amount of milliseconds in a day
var canTargetUserActivity = function (poWhereCond, pvStrictAction) {
    if (Array.isArray(poWhereCond)) {
        for (var _i = 0, poWhereCond_1 = poWhereCond; _i < poWhereCond_1.length; _i++) {
            var loWhereItem = poWhereCond_1[_i];
            if ([undefined, null, 'User'].includes(loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.objectType) && ((loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.objectKey) !== 'New')) {
                return (pvStrictAction)
                    ? ['Activity'].includes(loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.action)
                    : [undefined, null, 'Activity'].includes(loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.action);
            }
        }
    }
    return false;
};
//
// Code for the user activity section
// Manages relations between ID and Username
var loIdUsernameRelation = {};
var loUsernameIdRelation = {};
var getIdOfUsername = function (pvUsername) {
    return __awaiter(this, void 0, void 0, function () {
        var loResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (loUsernameIdRelation[pvUsername]) {
                        return [2 /*return*/, loUsernameIdRelation[pvUsername]];
                    }
                    return [4 /*yield*/, p9.manager.findOne('planet9.users', {
                            select: {
                                id: true,
                                name: true
                            },
                            where: {
                                username: pvUsername
                            }
                        })];
                case 1:
                    loResult = _a.sent();
                    loIdUsernameRelation[loResult === null || loResult === void 0 ? void 0 : loResult.id] = { username: pvUsername, name: loResult === null || loResult === void 0 ? void 0 : loResult.name };
                    loUsernameIdRelation[pvUsername] = { id: loResult === null || loResult === void 0 ? void 0 : loResult.id, name: loResult === null || loResult === void 0 ? void 0 : loResult.name };
                    return [2 /*return*/, loUsernameIdRelation[pvUsername]];
            }
        });
    });
};
var getUsernameOfId = function (pvId) {
    return __awaiter(this, void 0, void 0, function () {
        var loResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (loIdUsernameRelation[pvId]) {
                        return [2 /*return*/, loIdUsernameRelation[pvId]];
                    }
                    return [4 /*yield*/, p9.manager.findOne('planet9.users', {
                            select: {
                                username: true,
                                name: true
                            },
                            where: {
                                id: pvId
                            }
                        })];
                case 1:
                    loResult = _a.sent();
                    loUsernameIdRelation[loResult === null || loResult === void 0 ? void 0 : loResult.username] = { id: pvId, name: loResult === null || loResult === void 0 ? void 0 : loResult.name };
                    loIdUsernameRelation[pvId] = { username: loResult === null || loResult === void 0 ? void 0 : loResult.username, name: loResult === null || loResult === void 0 ? void 0 : loResult.name };
                    return [2 /*return*/, loIdUsernameRelation[pvId]];
            }
        });
    });
};
var getLocationOfElement = function (poElement, poArray, pvStart, pvEnd) {
    var lvStart = pvStart || 0;
    var lvEnd = pvEnd || poArray.length;
    var lvPivot = Math.floor(lvStart + (lvEnd - lvStart) / 2);
    if (lvEnd - lvStart <= 1 || poArray[lvPivot] === poElement.updatedAt)
        return lvPivot;
    if (poArray[lvPivot].updatedAt < poElement.updatedAt) {
        return getLocationOfElement(poElement, poArray, lvStart, lvPivot);
    }
    else {
        return getLocationOfElement(poElement, poArray, lvPivot, lvEnd);
    }
};
var insertElement = function (poElement, poArray) {
    if (!poArray.length) {
        poArray.push(poElement);
    }
    else {
        var lvPivot = getLocationOfElement(poElement, poArray, 0, poArray.length);
        if (poArray[lvPivot].updatedAt < poElement.updatedAt) {
            poArray.splice(lvPivot, 0, poElement);
        }
        else {
            poArray.splice(lvPivot + 1, 0, poElement);
        }
    }
    return poArray;
};
var resolveOperator = function (poOperatorsAndText) {
    var loOperatorAndText = JSON.parse(JSON.stringify(poOperatorsAndText));
    while (loOperatorAndText.includes("AND")) {
        var loAndIndex = loOperatorAndText.indexOf("AND");
        var loAndObject = { and: { left: loOperatorAndText[loAndIndex - 1], right: loOperatorAndText[loAndIndex + 1] } };
        loOperatorAndText.splice(loAndIndex - 1, 3, loAndObject);
    }
    while (loOperatorAndText.includes("OR")) {
        var loOrIndex = loOperatorAndText.indexOf("OR");
        var loOrObject = { or: { left: loOperatorAndText[loOrIndex - 1], right: loOperatorAndText[loOrIndex + 1] } };
        loOperatorAndText.splice(loOrIndex - 1, 3, loOrObject);
    }
    return loOperatorAndText[0];
};
var resolveExpression = function (pvInput) {
    if (pvInput.indexOf("AND") >= 0) { // } || pvInput.indexOf("OR") >= 0) {
        // let loRegex = /(.*?)(AND|OR)|(.*)$/g;
        var loRegex = /(.*?)(AND)|(.*)$/g;
        var loOperatorAndText = [];
        while (true) {
            var loMatch = loRegex.exec(pvInput);
            // if (["AND", "OR"].includes(loMatch[2])) {
            if (["AND"].includes(loMatch[2])) {
                loOperatorAndText.push(loMatch[1].trim());
                loOperatorAndText.push(loMatch[2]);
            }
            else {
                loOperatorAndText.push(loMatch[0].trim());
                break;
            }
        }
        return resolveOperator(loOperatorAndText);
    }
    return pvInput;
};
var buildSearchStringsFromOperation = function (poSearchExpression, pvReverseLogic) {
    if (typeof poSearchExpression === "string") {
        return ["%".concat(poSearchExpression, "%")];
    }
    var lvReverseLogic = !!pvReverseLogic;
    var loAndOperation = !!poSearchExpression.and;
    var loLeftOperation = buildSearchStringsFromOperation((loAndOperation) ? poSearchExpression.and.left : poSearchExpression.or.left);
    var loRightOperation = buildSearchStringsFromOperation((loAndOperation) ? poSearchExpression.and.right : poSearchExpression.or.right);
    if (loAndOperation != lvReverseLogic) {
        // "Multiplies" the values
        var loReturnData = [];
        for (var _i = 0, loLeftOperation_1 = loLeftOperation; _i < loLeftOperation_1.length; _i++) {
            var loLeftValue = loLeftOperation_1[_i];
            for (var _a = 0, loRightOperation_1 = loRightOperation; _a < loRightOperation_1.length; _a++) {
                var loRightValue = loRightOperation_1[_a];
                loReturnData.push("".concat(loLeftValue).concat(loRightValue).replace('%%', '%'));
            }
        }
        return loReturnData;
    }
    else {
        // "Adds" the values
        return loLeftOperation.concat(loRightOperation);
    }
};
var buildWildcardCondition = function (pvField, poSearchExpression) {
    if (poSearchExpression === "string") {
        return "\"".concat(pvField, "\" LIKE '%").concat(poSearchExpression, "%'");
    }
    //
    // Returns an array with the strings to search for
    var loSearchStrings = buildSearchStringsFromOperation(poSearchExpression);
    var loWildcardCondition = [];
    for (var _i = 0, loSearchStrings_2 = loSearchStrings; _i < loSearchStrings_2.length; _i++) {
        var lvSearchString = loSearchStrings_2[_i];
        loWildcardCondition.push("\"".concat(pvField, "\" LIKE '").concat(lvSearchString, "'"));
    }
    return loWildcardCondition.join(' OR ');
};
if (Array.isArray(loWhere) && loWhere.length) {
    for (var _i = 0, loWhere_1 = loWhere; _i < loWhere_1.length; _i++) {
        var loWhereItem = loWhere_1[_i];
        var loFieldsAudit = [];
        var loFieldsUserActivity = [];
        if (loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.objectType) {
            loFieldsAudit.push("\"objectType\" = '".concat(loWhereItem.objectType, "'"));
        }
        if (loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.objectKey) {
            loFieldsAudit.push("\"objectKey\" = '".concat(loWhereItem.objectKey, "'"));
            if (canTargetUserActivity([loWhereItem], false /* NOT strict */)) {
                loFieldsUserActivity.push("\"userID\" = '".concat(loWhereItem.objectKey, "'"));
            }
        }
        if (loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.action) {
            loFieldsAudit.push("\"action\" = '".concat(loWhereItem.action, "'"));
        }
        if (loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.changedBy) {
            loFieldsAudit.push("\"changedBy\" = '".concat(loWhereItem.changedBy, "'"));
            if (canTargetUserActivity([loWhereItem], false /* NOT strict */)) {
                loFieldsUserActivity.push("\"userID\" = 'ID:".concat(loWhereItem.changedBy, ":ID'"));
            }
        }
        if ((loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.beginDate) || (loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.endDate)) {
            if (!(loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.beginDate)) {
                loFieldsAudit.push("( \"createdAt\" <= '".concat(loWhereItem.endDate, "' OR \"updatedAt\" <= '").concat(loWhereItem.endDate, "' )"));
                loFieldsUserActivity.push("( \"createdAt\" <= '".concat(loWhereItem.endDate, "' )"));
            }
            else if (!(loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.endDate)) {
                loFieldsAudit.push("( \"createdAt\" >= '".concat(loWhereItem.beginDate, "' OR \"updatedAt\" >= '").concat(loWhereItem.beginDate, "' )"));
                loFieldsUserActivity.push("( \"createdAt\" >= '".concat(loWhereItem.beginDate, "' )"));
            }
            else {
                var lvBeginDate = (new Date(loWhereItem.beginDate)).toISOString().slice(0, 19).replace("T", " ");
                var lvEndDate = new Date(loWhereItem.endDate).toISOString().slice(11, 19);
                if ((lvEndDate === "00:00:00") && (loWhereItem.endDate.match(/^\d{4}-\d{2}-\d{2}[T ]?\s*$/g))) {
                    // If the time was not specifically set, then the end date is set to the beggining of the next day
                    lvEndDate = (new Date((new Date(loWhereItem.endDate)).getTime() + C_ONE_DAY)).toISOString().slice(0, 19).replace("T", " ");
                }
                else {
                    // else use as provided
                    lvEndDate = new Date(loWhereItem.endDate).toISOString().slice(0, 19).replace("T", " ");
                }
                // let lvEndDate = (new Date((new Date(loWhereItem.endDate)).getTime()+C_ONE_DAY)).toISOString().slice(0,19);
                // BETWEEN dates excludes the end date events, because it uses the 00:00:00 of each day
                loFieldsAudit.push("( ( \"createdAt\" between '".concat(lvBeginDate, "' AND '").concat(lvEndDate, "' ) OR ( \"updatedAt\" between '").concat(lvBeginDate, "' AND '").concat(lvEndDate, "' ) )"));
                loFieldsUserActivity.push("( \"createdAt\" between '".concat(lvBeginDate, "' AND '").concat(lvEndDate, "' )"));
            }
        }
        if (loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.content) {
            var loSearchExpression = resolveExpression(loWhereItem.content);
            if (typeof loSearchExpression === "string") {
                // console.log({ contentSingle: loWhereItem?.content });
                loFieldsAudit.push("\"content\" LIKE '%".concat(loSearchExpression, "%'"));
                if (canTargetUserActivity([loWhereItem], false)) {
                    loFieldsUserActivity.push("( ".concat([
                        "( \"action\" LIKE '%".concat(loSearchExpression, "%' )"),
                        "( \"result\" LIKE '%".concat(loSearchExpression, "%' )"),
                        "( \"data\" LIKE '%".concat(loSearchExpression, "%' )")
                    ].join(' OR '), " )"));
                }
            }
            else {
                // console.log({ contentComplex: loWhereItem?.content });
                loFieldsAudit.push(buildWildcardCondition('content', loSearchExpression));
                if (canTargetUserActivity([loWhereItem], false)) {
                    var loSearchStrings = buildSearchStringsFromOperation(loSearchExpression, true);
                    var loFieldsUserTemp = [];
                    for (var _f = 0, loSearchStrings_1 = loSearchStrings; _f < loSearchStrings_1.length; _f++) {
                        var lvSearchString = loSearchStrings_1[_f];
                        loFieldsUserTemp.push("( ".concat([
                            "( \"action\" LIKE '".concat(lvSearchString, "' )"),
                            "( \"result\" LIKE '".concat(lvSearchString, "' )"),
                            "( \"data\" LIKE '".concat(lvSearchString, "' )")
                        ].join(' OR '), " )"));
                    }
                    loFieldsUserActivity.push("( ".concat(loFieldsUserTemp.join(' AND '), " )"));
                }
            }
        }
        if (loFieldsAudit.length) {
            loQueryAudit.push("( ".concat(loFieldsAudit.join(' AND '), " )"));
            if (canTargetUserActivity([loWhereItem], false /* NOT strict */)) {
                loQueryUserActivity.push("( ".concat(loFieldsUserActivity.join(' AND '), " )"));
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
}
;
var lvAuditWhere = loQueryAudit.join(' OR ');
// console.log('Generated query:', lvAuditWhere);
var lvSelect = "SELECT * FROM planet9.audit_log WHERE ".concat(lvAuditWhere, " ORDER BY \"updatedAt\" DESC");
// log.debug("Audit select:", lvSelect);
var loResult = await p9.manager.query(lvSelect);
// for (let loRow of loResult) {
//     try {
//         loRow.content = JSON.parse(loRow.content);
//     }
//     catch(e) { /* Nothing to do */}
// }
// console.log("step user activity");
if (loQueryUserActivity.length) {
    // log.debug("User activity requested");
    var lvUserActivityWhere = loQueryUserActivity.join(' OR ');
    // Collects the IDs of the usernames
    var loRegex = /ID:(.*?):ID/g;
    var loMatch = { index: 0 };
    while (loMatch = loRegex.exec(lvUserActivityWhere)) {
        var lvUsername = loMatch[1];
        var lvId = ((_b = loUsernameIdRelation[lvUsername]) === null || _b === void 0 ? void 0 : _b.id)
            ? loUsernameIdRelation[lvUsername].id
            : (_c = (await getIdOfUsername(lvUsername))) === null || _c === void 0 ? void 0 : _c.id;
        lvUserActivityWhere = "".concat(lvUserActivityWhere.slice(0, loMatch.index)).concat(lvId).concat(lvUserActivityWhere.slice(loRegex.lastIndex));
        loRegex.lastIndex += lvId.length - loMatch[0].length;
    }
    // Collects the activity
    var lvUserActivitySelect = lvUserActivityWhere.match(/^\(\s*\)$/)
        ? "SELECT * FROM planet9.user_activity"
        : "SELECT * FROM planet9.user_activity WHERE ".concat(lvUserActivityWhere);
    // log.debug("User activity select:", lvUserActivitySelect);
    var loUserActivityResult = await p9.manager.query(lvUserActivitySelect);
    // console.log(loUserActivityResult);
    if (Array.isArray(loUserActivityResult) && loQueryUserActivity.length) {
        // Creates the virtual audit entries
        for (var _g = 0, loUserActivityResult_1 = loUserActivityResult; _g < loUserActivityResult_1.length; _g++) {
            var loUserActivity = loUserActivityResult_1[_g];
            // console.log("User Id:", loUserActivity?.userID);
            // let loTempValue = (loIdUsernameRelation[loUserActivity?.userID]?.username) 
            //                     ? loIdUsernameRelation[loUserActivity.userID].username
            //                     : (await getUsernameOfId(loUserActivity?.userID)).username; 
            insertElement({
                "id": "*".concat(loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.id),
                "createdAt": loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.createdAt,
                "updatedAt": loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.createdAt,
                "changedBy": ((_d = loIdUsernameRelation[loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID]) === null || _d === void 0 ? void 0 : _d.username)
                    ? loIdUsernameRelation[loUserActivity.userID].username
                    : (await getUsernameOfId(loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID)).username,
                "objectType": "User",
                "objectKey": loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID,
                "action": "Activity",
                "content": JSON.stringify({ "detail": loUserActivity }),
                "objectName": (_e = loIdUsernameRelation[loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID]) === null || _e === void 0 ? void 0 : _e.name
            }, loResult);
        }
        // console.log(loResult);        
    }
}
else {
    // log.debug("User activity NOT requested");
}
// log.debug(loResult);
result.statusCode = 200;
result.data = {
    result: {
        audit: loResult
    }
};
// console.log(result.data.result.audit);
// console.log("step end");
return complete();
