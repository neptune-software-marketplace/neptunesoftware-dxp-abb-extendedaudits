let goArtifactHistoryRequest = {};
let goArtifactHistoryAuditResponse = [];
let goArtifactHistoryObjectResponse = {};

const C_CHANGEDBY_UNKNOWN = txtChangedbyUnknwonUser.getText();
const ArtifactHistoryCrossReference = {};

const C_TRACK_HISTORY_CONFIG = {
	Department: [
        // No tracking; D)isplay object field
        // Track F)ield for M|A|R(Modification, Addition, Removal)
        // Track R)ow for A|R(Addition, Removal)
		{ field: "createdAt",    tracking: "D", diff: [] },
		{ field: "createdBy",    tracking: "D", diff: [] },
		{ field: "updatedAt",    tracking: "D", diff: [] },
		{ field: "changedBy",    tracking: "D", diff: [] },
		{ field: "id",           tracking: "D", diff: [] },

		{ field: "name",         tracking: "F", diff: ["M", "A", "R"] },
		{ field: "description",  tracking: "F", diff: ["M", "A", "R"] },
		{ field: "isExternal",   tracking: "F", diff: ["M", "A", "R"] },
		{ field: "package",      tracking: "F", diff: ["M", "A", "R"] },
		{ field: "parent",       tracking: "F", diff: ["M", "A", "R"] },

		{ field: "idpSource",    tracking: "D", diff: [] },
		{ field: "idpSourceId",  tracking: "D", diff: [] },
		{ field: "idpSourceKey", tracking: "D", diff: [] },

		{ field: "roles",        tracking: "R", diff: ["A","R"], crossRef: false, searchAs: C_TYPE_ROLE, children: [
                { field: "name" },
                { field: "id"   }
            ] 
        },
		{ field: "users",        tracking: "R", diff: ["A","R"], crossRef: false, searchAs: C_TYPE_USER, children: [
                { field: "username" },
                { field: "id"   }
            ] 
        }
	],
	Role: [
        // No tracking; D)isplay object field
        // Track F)ield for M|A|R(Modification, Addition, Removal)
        // Track R)ow for A|R(Addition, Removal)
		{ field: "createdAt",   tracking: "D", diff: [] },
		{ field: "createdBy",   tracking: "D", diff: [] },
		{ field: "updatedAt",   tracking: "D", diff: [] },
		{ field: "changedBy",   tracking: "D", diff: [] },
		{ field: "id",          tracking: "D", diff: [] },

		{ field: "name",        tracking: "F", diff: ["M", "A", "R"] },
		{ field: "description", tracking: "F", diff: ["M", "A", "R"] },
		{ field: "package",     tracking: "F", diff: ["M", "A", "R"] },

		{ field: "departments", tracking: "R", diff: ["A","R"], crossRef: true, displayAs: "groups", searchAs: C_TYPE_GROUP, children: [
                { field: "name" },
                { field: "id"   }
            ] 
        },
		{ field: "users",       tracking: "R", diff: ["A","R"], crossRef: true, searchAs: C_TYPE_USER, children: [
                { field: "username" },
                { field: "id"   }
            ] 
        }
	],
	User: [
        // No tracking; D)isplay object field
        // Track F)ield for M|A|R(Modification, Addition, Removal)
        // Track R)ow for A|R(Addition, Removal)
		{ field: "createdAt",                tracking: "D", diff: [] },
		{ field: "createdBy",                tracking: "D", diff: [] },
		{ field: "updatedAt",                tracking: "D", diff: [] },
		{ field: "changedBy",                tracking: "D", diff: [] },
		{ field: "id",                       tracking: "D", diff: [] },

		{ field: "username",                 tracking: "F", diff: ["M", "A", "R"] },
		{ field: "name",                     tracking: "F", diff: ["M", "A", "R"] },
		{ field: "email",                    tracking: "F", diff: ["M", "A", "R"] },
		{ field: "phone",                    tracking: "F", diff: ["M", "A", "R"] },
		{ field: "mobile",                   tracking: "F", diff: ["M", "A", "R"] },
		{ field: "locked",                   tracking: "F", diff: ["M", "A", "R"] },
		{ field: "admin",                    tracking: "F", diff: ["M", "A", "R"] },
		{ field: "requirePasswordReset",     tracking: "F", diff: ["M", "A", "R"] },
		{ field: "language",                 tracking: "F", diff: ["M", "A", "R"] },
		{ field: "jwtEnabled",               tracking: "F", diff: ["M", "A", "R"] },
		{ field: "jwtTokenExpires",          tracking: "F", diff: ["M", "A", "R"] },
		{ field: "sendJwtTokenExpiryAlert",  tracking: "F", diff: ["M", "A", "R"] },
		{ field: "jwtAlertDaysBeforeExpiry", tracking: "F", diff: ["M", "A", "R"] },
		{ field: "failedLoginAttempts",      tracking: "F", diff: ["M", "A", "R"] },
		{ field: "passwordUpdated",          tracking: "F", diff: ["M", "A", "R"] },
		{ field: "begins",                   tracking: "F", diff: ["M", "A", "R"] },
		{ field: "ends",                     tracking: "F", diff: ["M", "A", "R"] },

		{ field: "isExternal",               tracking: "F", diff: [] },
		{ field: "idpSource",                tracking: "F", diff: [] },
		{ field: "idpSourceId",              tracking: "F", diff: [] },
		{ field: "idpSourceKey",             tracking: "F", diff: [] },

		{ field: "departments",              tracking: "R", diff: ["A","R"], crossRef: true, displayAs: "groups", searchAs: C_TYPE_GROUP, children: [
                { field: "name" },
                { field: "id"   }
            ] 
        },
		{ field: "roles",                    tracking: "R", diff: ["A","R"], crossRef: false, searchAs: C_TYPE_ROLE, children: [
                { field: "name" },
                { field: "id"   }
            ] 
        }
	]
};


function gfHandlerPageDetailHistory( poData ) {
    goArtifactHistoryRequest = poData;
    setBusy( true, oPageDetailHistory );
    let loOptionsAuditLogHistoryRequest = {
        data: {
            "where": [{objectType: poData.objectType, objectKey: poData.objectKey}],
        }
    }
    apiGetAuditLogHistory(loOptionsAuditLogHistoryRequest);
}

function pageDetailHistoryValueOutput( poValue ) {
    if (["undefined", "boolean", "number", "bigint", "symbol"].includes(typeof poValue) || poValue === null) { return poValue; }
    if (poValue instanceof Date) {
        return getLocalISOString(poValue).slice(0,19).replace("T", " ");
    }
    let loRegex = /\d{4}[/.-]\d{2}[/.-]\d{2}(?:[T ]\d{2}:\d{2}(?:\:\d{2})?)?/g;
    if (!poValue.match(loRegex)) {return poValue};
    let loMaybeDate = new Date(poValue);
    if (isNaN(loMaybeDate)) { return poValue; }
    return getLocalISOString(loMaybeDate).slice(0,19).replace("T", " ");
}

function pageDetailHistoryRefresh() {
    if (goArtifactHistoryObjectResponse || (Array.isArray(goArtifactHistoryAuditResponse) && goArtifactHistoryAuditResponse.length)) {
        let loText = [ txtCurrentDataForArtifact.getText()
                        .replace("&1", goArtifactHistoryRequest.name)
                        .replace("&2", [C_TYPE_GROUP].includes(goArtifactHistoryRequest.objectType)
                                        ? txtLiteralGroup.getText()
                                        : [C_TYPE_ROLE].includes(goArtifactHistoryRequest.objectType)
                                            ? txtLiteralRole.getText()
                                            : txtLiteralUser.getText()) ];
        let loConfig = C_TRACK_HISTORY_CONFIG[goArtifactHistoryRequest.objectType];
        // Display all fields;
        for (let loConfigRow of loConfig) {
            if (["R"].includes(loConfigRow.tracking)) {
                // Quickly shows the field's id and name
                loText.push(`\t${loConfigRow.displayAs || loConfigRow.field}`);
                // for (let lvRowChild in goArtifactHistoryObjectResponse[loConfigRow.field]){
                for (let loRowChild of goArtifactHistoryObjectResponse[loConfigRow.field]){
                    let lvRowChildString = [];
                    for (let loConfigChildRow of loConfigRow.children) {
                        lvRowChildString.push(`${loConfigChildRow.field}: ${
                            // goArtifactHistoryObjectResponse[loConfigRow.field][lvRowChild][loConfigChildRow.field]}`);
                            loRowChild[loConfigChildRow.field]}`);
                    }
                    loText.push(`\t\t${lvRowChildString.join('; ')}`);
                }
            }
            else {
                loText.push(`\t${loConfigRow.displayAs || loConfigRow.field}: ${pageDetailHistoryValueOutput(goArtifactHistoryObjectResponse[loConfigRow.field])}`);
            }
        }
        // Computes the changes 
        let loCursor = goArtifactHistoryObjectResponse;
        let loCursorUpdatedAt = new Date(); // loCursor.updatedAt;
        let loCompleteHistory = $.extend(true, [], goArtifactHistoryAuditResponse);
        if (!(loCompleteHistory.length && [C_ACTION_CREATE].includes(loCompleteHistory[loCompleteHistory.length-1].action))) {
            loCompleteHistory.push({updatedAt: loCursor.createdAt, changedBy: C_CHANGEDBY_UNKNOWN, content: {id: loCursor.id}});
        } else {
            loCompleteHistory.push({updatedAt: loCursor.createdAt, changedBy: loCompleteHistory[loCompleteHistory.length-1].changedBy, content: {id: loCursor.id}});
        }
        let loDiffText = [];
        for (let loArtifact of loCompleteHistory) {
            if ((loArtifact.objectType === C_TYPE_USER) && (loArtifact.action === C_ACTION_ACTICITY)) {
                loDiffText.push(`\t[${pageDetailHistoryValueOutput(loArtifact.updatedAt)}] ${loArtifact.changedBy}\n\t\tuser activity: ${
                    loArtifact.content.detail.action} (${
                    loArtifact.content.detail.result}) with data "${
                    loArtifact.content.detail.data}"`);
                continue;
            }
            const loDiffData = compareObjects(
                                    (typeof loArtifact?.content?.detail === "object")
                                        ?loArtifact.content.detail
                                        :loArtifact.content, 
                                    loCursor);
            let loDiffTextChildren = [];
            for (let loConfigRow of loConfig) {
                let lvTextOutput;
                let loOptions = {
                    parentKey: goArtifactHistoryRequest.objectKey,
                    parentType: goArtifactHistoryRequest.objectType,
                    dateFrom: loArtifact.updatedAt,
                    dateTo: loCursorUpdatedAt
                }
                switch(loConfigRow.tracking) {
                    case "F":
                        lvTextOutput = pageDetailHistoryDiffOutputField(loConfigRow, loDiffData, loOptions);
                        // if (lvTextOutput) { console.log("F:", lvTextOutput); };
                        break;
                    case "R":
                        lvTextOutput = pageDetailHistoryDiffOutputRow(loConfigRow, loDiffData, loOptions);
                        // if (lvTextOutput) { console.log("R:", lvTextOutput); };
                        break;
                }
                if (lvTextOutput && !Array.isArray(lvTextOutput)) { 
                    loDiffTextChildren.push(`\t\t${lvTextOutput}`) 
                }
                else if (Array.isArray(lvTextOutput) && lvTextOutput.length) {
                    for (let lvParcel of lvTextOutput) {
                        loDiffTextChildren.push(`\t\t${lvParcel}`); 
                    }
                };
            }
            if (loDiffTextChildren.length) { 
                lvDate1 = pageDetailHistoryValueOutput(loArtifact.updatedAt);
                lvDate2 = pageDetailHistoryValueOutput(loCursorUpdatedAt)
                loDiffText.push(`\t[${(lvDate1 === lvDate2)
                                        ? lvDate1
                                        : `${lvDate1} -> ${lvDate2}`}] ${loArtifact.changedBy}`);
                loDiffText = loDiffText.concat(loDiffTextChildren);
            };

            loCursor = (typeof loArtifact?.content?.detail === "object")
                            ?loArtifact.content.detail
                            :loArtifact.content;
            loCursorUpdatedAt = loArtifact.updatedAt;
        }
        if (loDiffText.length) {
            loText.push("\n");
            switch (goArtifactHistoryRequest.objectType) {
                case C_TYPE_USER:
                    loText.push(`${txtArtifactActivityAndChangeHistory.getText()}:`);
                    break;
                default:
                    loText.push(`${txtArtifactChangeHistory.getText()}:`);
            }
            
            loText = loText.concat(loDiffText);
        }
        else {
            loText.push("\n");
            loText.push(`${txtNoArtifactChangeHistoryFound.getText()}`);
        }
        if (oHtmlDetailHistoryDisplay.CUST?.monacoEditor) {
            oHtmlDetailHistoryDisplay.CUST.preLoadedText = `${loText.join("\n")}\n`;
            let loCountCheck = 0; // Every four is a second
            setBusy( true, oTabDetailPages );
            When.promise(() => {
                if (loCountCheck++ > 1200) { // 5 minutes timeout
                    return -1; // fail
                } else if (oHtmlDetailHistoryDisplay.CUST.preLoadedText.indexOf(`${ArtifactHistoryCrossReference.getCrossRefIdentifier()}`) < 0) {
                    return 1;
                }
                return 0;
            }).then(() => {
                oHtmlDetailHistoryDisplay.CUST.monacoEditor.setValue( oHtmlDetailHistoryDisplay.CUST.preLoadedText );
                oHtmlDetailHistoryDisplay.CUST.preLoadedText = "";
                oHtmlDetailHistoryDisplay.CUST.monacoEditor.setScrollPosition({scrollTop: 0});
                setBusy( false, oTabDetailPages );
            }).catch(() => {
                oHtmlDetailHistoryDisplay.CUST.preLoadedText = ArtifactHistoryCrossReference.removeAllOrphanCrossRef( oHtmlDetailHistoryDisplay.CUST.preLoadedText );
                oHtmlDetailHistoryDisplay.CUST.monacoEditor.setValue( oHtmlDetailHistoryDisplay.CUST.preLoadedText );
                oHtmlDetailHistoryDisplay.CUST.preLoadedText = "";
                oHtmlDetailHistoryDisplay.CUST.monacoEditor.setScrollPosition({scrollTop: 0});
                let lvErrorMessage = `Timeout occurred while acquiring cross-refs for the  ${goArtifactHistoryRequest.objectType} object ${goArtifactHistoryRequest.name} (${goArtifactHistoryRequest.objectKey})`;
                // console.error(lvErrorMessage)
                sap.m.MessageToast.show(lvErrorMessage);
                setBusy( false, oTabDetailPages );
            });
        }        
    }
    else {
        oHtmlDetailHistoryDisplay.CUST?.monacoEditor & oHtmlDetailHistoryDisplay.CUST.monacoEditor.setValue(txtNoInformationFound.getText());
        oHtmlDetailHistoryDisplay.CUST?.monacoEditor & oHtmlDetailHistoryDisplay.CUST.monacoEditor.setScrollPosition({scrollTop: 0});
    }
    
}

function pageDetailHistoryDiffOutputField(poConfig, poDiffData, poOptions) {
    if (poConfig.diff.includes("M") && poDiffData.modified[`/${poConfig.field}`]) {
        let loFieldData = poDiffData.modified[`/${poConfig.field}`];
        return `${poConfig.displayAs || poConfig.field}: from "${pageDetailHistoryValueOutput(loFieldData.from)}"; to "${
                                           pageDetailHistoryValueOutput(loFieldData.to  )}".`;
    };
    if (poConfig.diff.includes("A") && poDiffData.added[`/${poConfig.field}`]) {
        return `${poConfig.displayAs || poConfig.field}: added "${pageDetailHistoryValueOutput(poDiffData.added[`/${poConfig.field}`])}".`;
    };
    if (poConfig.diff.includes("R") && poDiffData.deleted[`/${poConfig.field}`]) {
        return `${poConfig.displayAs || poConfig.field}: removed "${pageDetailHistoryValueOutput(poDiffData.deleted[`/${poConfig.field}`])}".`;
    };
    return;
};

function pageDetailHistoryDiffOutputRow(poConfig, poDiffData, poOptions) {
    let loResultOutput = [];
    if (poConfig.diff.includes("A")) {
        let loAddedRelation = []
        for (let lvIndex in poDiffData.added) {
            if (!lvIndex.startsWith(`/${poConfig.field}`)) {continue;}
            if (typeof poDiffData.added[lvIndex] !== 'object') {continue;}
            let loRelationsData = (!Array.isArray(poDiffData.added[lvIndex]))
                                    ? [poDiffData.added[lvIndex]]
                                    : poDiffData.added[lvIndex];
            for (let loRelation of loRelationsData) {
                let loChildFields = [];
                for (let lvChild in poConfig.children) {
                    if (loRelation[poConfig.children[lvChild].field]) {
                        loChildFields.push(`${poConfig.children[lvChild].field}: ${loRelation[poConfig.children[lvChild].field]}`);
                    }
                }
                if (loChildFields.length) {
                    loAddedRelation.push(`\t${loChildFields.join("; ")}`);
                    if (poConfig.crossRef) {
                        let loSourceKey = generateUUID();
                        ArtifactHistoryCrossReference.check(
                            poConfig, 
                            loRelation, 
                            $.extend(true, {}, poOptions, {
                                sourceKey: loSourceKey,
                                add: true, 
                                callback: (poSourceKey, poData)=> {
                                    oHtmlDetailHistoryDisplay.CUST.preLoadedText = ArtifactHistoryCrossReference.transformOutput(oHtmlDetailHistoryDisplay.CUST.preLoadedText, poSourceKey, poData)
                                }}));
                        loAddedRelation.push(`\t\t${ArtifactHistoryCrossReference.imprintCrossRef(loSourceKey)}`);
                    }
                }
            }
        }
        if (loAddedRelation.length) { 
            loResultOutput = loResultOutput.concat([`${poConfig.displayAs || poConfig.field} added:`].concat(loAddedRelation)); 
        }
    };
    if (poConfig.diff.includes("R")) {
        let loRemovedRelation = []
        for (let lvIndex in poDiffData.deleted) {
            if (!lvIndex.startsWith(`/${poConfig.field}`)) {continue;}
            if (typeof poDiffData.deleted[lvIndex] !== 'object') {continue;}
            let loRelationsData = (!Array.isArray(poDiffData.deleted[lvIndex]))
                                    ? [poDiffData.deleted[lvIndex]]
                                    : poDiffData.deleted[lvIndex];
            for (let loRelation of loRelationsData) {
                let loChildFields = [];
                for (let lvChild in poConfig.children) {
                    if (loRelation[poConfig.children[lvChild].field]) {
                        loChildFields.push(`${poConfig.children[lvChild].field}: ${loRelation[poConfig.children[lvChild].field]}`);
                    }
                }
                if (loChildFields.length) {
                    loRemovedRelation.push(`\t${loChildFields.join("; ")}`)
                    if (poConfig.crossRef) {
                        let loSourceKey = generateUUID();
                        ArtifactHistoryCrossReference.check(
                            poConfig, 
                            loRelation, 
                            $.extend(true, {}, poOptions, {
                                sourceKey: loSourceKey, 
                                add: false, 
                                callback: (poSourceKey, poData)=> {
                                    oHtmlDetailHistoryDisplay.CUST.preLoadedText = ArtifactHistoryCrossReference.transformOutput(oHtmlDetailHistoryDisplay.CUST.preLoadedText, poSourceKey, poData)
                                }}));
                        loRemovedRelation.push(`\t\t${ArtifactHistoryCrossReference.imprintCrossRef(loSourceKey)}`);
                    }
                }
            }
        }
        if (loRemovedRelation.length) { 
            loResultOutput = loResultOutput.concat([`${poConfig.displayAs || poConfig.field} removed:`].concat(loRemovedRelation)); 
        }
    };
    return (loResultOutput.length) ? loResultOutput : undefined;
};

(function() {
    const ArtifactHistoryCrossReferenceOptions = new Map();

    $.extend(true, ArtifactHistoryCrossReference, {
        check: function (poConfig, loRelation, poOptions) {
            const loTemplateRow = { 
                objectType: poConfig.searchAs, 
                objectKey: loRelation.id, 
                beginDate: new Date(poOptions.dateFrom).toISOString().slice(0,19).replace("T", " "), 
                endDate: new Date(poOptions.dateTo).toISOString().slice(0,19).replace("T", " ")
            };
            const loOptions = {
                data: {
                    "where": [
                        $.extend(true, {}, loTemplateRow, {action: C_ACTION_CREATE}),
                        $.extend(true, {}, loTemplateRow, {action: C_ACTION_SAVE}),
                        $.extend(true, {}, loTemplateRow, {action: C_ACTION_DELETE})
                    ],
                    "sourceKey": poOptions.sourceKey
                }
            };
            if (poOptions.sourceKey) {
                loOptions.data.sourceKey = poOptions.sourceKey;
                ArtifactHistoryCrossReferenceOptions.set(poOptions.sourceKey, {
                    config: poConfig,
                    parentKey: poOptions.parentKey,
                    parentType: poOptions.parentType,
                    add: poOptions.add,
                    beginDate: loTemplateRow.beginDate,
                    endDate: loTemplateRow.endDate,
                    callback: poOptions.callback
                })
            }
            setBusy( true, oTabDetailPages );
            apiGetAuditLogCrossRef(loOptions);    
        },
        applyData: function( poSourceKey, poData ) {
            /*
                Variables to use:
                poSourceKey to get options: {
                    parentKey: the object being analyzed
                    parentType: the type of object of the parent,
                    add: (T/F) was the referred object being added (true) or removed (false)
                    callback: if there's a callback then execute it
                }
                poData for the cross-reference

                NOTE: if (poData is empty then nothing was done in the cross-ref).
                NOTE 2: for all the cross-reference, only the mentions of parentKey are to keep
             */
            let loOptions = ArtifactHistoryCrossReferenceOptions.get(poSourceKey);
            let loResult = [];
            let loData = (!poData.length) ?[] : (function() {
                let loUnpackedData = $.extend(true, [], poData);
                for (let loRow of loUnpackedData) {
                    try {
                        loRow.content = JSON.parse(loRow.content);
                    } catch( e ) {
                        console.error(`Inputted stringified JSON: ${(loRow.content) ? loRow.content : '<empty string>'}`);
                        console.error(e);
                        loRow.content = {};
                    }
                }
                return loUnpackedData;
            })();


            let loActionsOutput = [];
            //
            // Reduces actions taken to the object in question and to the times it was added/removed 
            let loTargetRelation = ([C_TYPE_GROUP].includes(loOptions.parentType))
                                    ? "departments"
                                    : ([C_TYPE_ROLE].includes(loOptions.parentType))
                                        ? "roles"
                                        : "users";
            for (let loEntry of loData) {
                let loEntryContent = (typeof loEntry.content?.detail === "object")
                                        ? loEntry.content.detail
                                        : loEntry.content;
                let loEntryRelations = loEntryContent[loTargetRelation];
                if (!(Array.isArray(loEntryRelations) && loEntryRelations.length)) { continue; }
                let loParentExistsInRelation = ModelData.FindFirst(loEntryRelations, "id", loOptions.parentKey);
                let loAction = {
                    actionAdd   : !!loParentExistsInRelation,
                    actionRemove:  !loParentExistsInRelation,
                    actionDate  : loEntry.createdAt,
                    actionByWho : loEntry.changedBy,
                    displayAs   : (loOptions.config.displayAs) ? loOptions.config.displayAs : loOptions.config.field
                }
                if (loActionsOutput.length && (loActionsOutput[loActionsOutput.length-1].actionAdd === loAction.actionAdd)) {
                    let lvLastIndex = loActionsOutput.length-1;
                    loActionsOutput[lvLastIndex].actionDate  = loAction.actionDate;
                    loActionsOutput[lvLastIndex].actionByWho = loAction.actionByWho;
                }
                else {
                    loActionsOutput.push(loAction);
                }
            }
            //
            // Remove the very first if it doesn't match with the parent action (in request)
            // Reason: sanity check - this should never happen
            if (loActionsOutput.length 
                && 
                (
                    (loActionsOutput[0].actionAdd && !loOptions.add) 
                    || 
                    (loActionsOutput[0].actionRemove && loOptions.add)
                )
            ) {
                loActionsOutput.splice(0,1);
            }
            //
            // Remove the very last if it doesn't match with the parent action (in request)
            // Reason: if the last output action is the opposite of the requested parent action, then
            //         there must be another iteration on the parent object, further down the line,
            //         that will cover it.
            if ((loActionsOutput.length > 1) 
                && 
                (
                    (loActionsOutput[loActionsOutput.length-1].actionAdd && !loOptions.add) 
                    || 
                    (loActionsOutput[loActionsOutput.length-1].actionRemove && loOptions.add)
                )
            ) {
                loActionsOutput.splice(loActionsOutput.length-1,1);
            }

            //
            // Processes the data found into an output array
            loDataOutput = [];
            for (let loActionEntry of loActionsOutput) {
                loDataOutput.push(
                    `[${getLocalISOString(loActionEntry.actionDate).slice(0,19).replace("T", " ")}] ${
                        (loActionEntry.actionAdd) ? 'added' : 'removed'} by ${loActionEntry.actionByWho}`);
            }

            // console.log('@ArtifactHistoryCrossReference.applyData(...):', loOptions, loData);
            if (typeof loOptions.callback === "function") {
                //
                // Callback responsible for applying and cleaning up the output.
                loOptions.callback(poSourceKey, loDataOutput);
            }
        },
        transformOutput: function(poOutputString, poSourceKey, poDataOutput) {
            if (!poDataOutput.length) {
                const loRegexLine = new RegExp(`^\\s*\\{CROSS-REF:${poSourceKey}}\\s*\\n`, "gm");
                poOutputString = poOutputString.replace(loRegexLine, "");
            } else {
                const loRegexToMatch = new RegExp(`(^\\s*)(\\{CROSS-REF:${poSourceKey}})(\\s*\\n)`, "gm");
                const loMatch = loRegexToMatch.exec(poOutputString);
                let lvOutput = "";
                if (loMatch) {
                    for (let lvParcelOutput of poDataOutput) {
                        lvOutput += `${loMatch[1]}${lvParcelOutput}${loMatch[3]}`
                    }
                }
                poOutputString = poOutputString.replace(loRegexToMatch, lvOutput);
            }
            return poOutputString;
        },
        getCrossRefIdentifier: () => 'CROSS-REF',
        imprintCrossRef: function(poSourceKey) {
            return `{${ArtifactHistoryCrossReference.getCrossRefIdentifier()}:${poSourceKey}}`;
        },
        removeAllOrphanCrossRef: function(poOutputString) {
            const loRegEx = /^\s*\{CROSS-REF:.*}\s*\n/gm;
            poOutputString = poOutputString.replace(loRegEx, "");
            return poOutputString;
        }
    });
})();

