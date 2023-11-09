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
    // { beginDate: "2023-10-16", endDate: "2023-10-17" },
    // { objectType: "User", beginDate: "2023-10-16", endDate: "2023-10-17" },
    // { beginDate: "2023-10-17" },
    // { changedBy: 'paulo.reis.rosa@neptune-software.com', beginDate: "2023-10-19", endDate: "2023-10-19" },
    // { objectKey:"112b3c12-d9b6-467d-bf6b-ae3f8aaec65f", changedBy: 'rommel@neptune-software.com', action: "Activity", beginDate: "2023-10-18", endDate: "2023-10-19", content: 'Logout' },
    { objectKey:"New" },
    // { action: "Save" },
]
/* */
console.log('Calculating query...');
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
                    return [4 /*yield*/, p9.manager.findOne('users', {
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
                    return [4 /*yield*/, p9.manager.findOne('users', {
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
                var lvBeginDate = (new Date(loWhereItem.beginDate)).toISOString().slice(0, 10);
                var lvEndDate = (new Date((new Date(loWhereItem.endDate)).getTime() + C_ONE_DAY)).toISOString().slice(0, 10);
                // BETWEEN dates excludes the end date events, because it uses the 00:00:00 of each day
                loFieldsAudit.push("( ( \"createdAt\" between '".concat(lvBeginDate, "' AND '").concat(lvEndDate, "' ) OR ( \"updatedAt\" between '").concat(lvBeginDate, "' AND '").concat(lvEndDate, "' ) )"));
                loFieldsUserActivity.push("( \"createdAt\" between '".concat(lvBeginDate, "' AND '").concat(lvEndDate, "' )"));
            }
        }
        if (loWhereItem === null || loWhereItem === void 0 ? void 0 : loWhereItem.content) {
            loFieldsAudit.push("\"content\" LIKE '%".concat(loWhereItem.content, "%'"));
            if (canTargetUserActivity([loWhereItem], false)) {
                loFieldsUserActivity.push("( ".concat([
                    "( \"action\" LIKE '%".concat(loWhereItem.content, "%' )"),
                    "( \"result\" LIKE '%".concat(loWhereItem.content, "%' )"),
                    "( \"data\" LIKE '%".concat(loWhereItem.content, "%' )")
                ].join(' OR '), " )"));
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
var lvSelect = "SELECT * FROM audit_log WHERE ".concat(lvAuditWhere, " ORDER BY \"updatedAt\" DESC");
log.debug("Audit select:", lvSelect);
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
        ? "SELECT * FROM user_activity"
        : "SELECT * FROM user_activity WHERE ".concat(lvUserActivityWhere);
    log.debug("User activity select:", lvUserActivitySelect);
    var loUserActivityResult = await p9.manager.query(lvUserActivitySelect);
    // console.log(loUserActivityResult);
    if (Array.isArray(loUserActivityResult) && loQueryUserActivity.length) {
        // Creates the virtual audit entries
        for (var _f = 0, loUserActivityResult_1 = loUserActivityResult; _f < loUserActivityResult_1.length; _f++) {
            var loUserActivity = loUserActivityResult_1[_f];
            insertElement({
                "id": "*".concat(loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.id),
                "createdAt": loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.createdAt,
                "updatedAt": loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.createdAt,
                "changedBy": ((_d = loIdUsernameRelation[loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID]) === null || _d === void 0 ? void 0 : _d.username)
                    ? loIdUsernameRelation[loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID.username]
                    : (await getUsernameOfId(loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID)).username,
                "objectType": "User",
                "objectKey": loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID,
                "action": "Activity",
                "content": JSON.stringify({ "detail": loUserActivity }),
                "objectName": (_e = loIdUsernameRelation[loUserActivity === null || loUserActivity === void 0 ? void 0 : loUserActivity.userID]) === null || _e === void 0 ? void 0 : _e.name
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
