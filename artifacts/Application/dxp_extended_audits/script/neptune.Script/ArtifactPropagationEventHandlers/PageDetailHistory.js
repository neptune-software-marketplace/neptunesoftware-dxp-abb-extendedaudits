/**
 * HandlerPageDetailHistory_New
 */
let goArtifactHistoryRequest = {};
let goArtifactHistoryAuditResponse = [];
let goArtifactHistoryObjectResponse = {};

const C_CHANGEDBY_UNKNOWN = txtChangedbyUnknwonUser.getText();
const C_LENGTH_UUID_STRING = 36;

const C_TRACK_HISTORY_CONFIG = {
	Department: [
        // No tracking; D)isplay object field
        // Track F)ield for M|A|R(Modification, Addition, Removal)
        // Track R)elation for A|R(Addition, Removal)
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
        // Track R)elation for A|R(Addition, Removal)
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
        // Track R)elation for A|R(Addition, Removal)
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
C_TRACK_HISTORY_CONFIG.Department = 
    C_TRACK_HISTORY_CONFIG.Department.map(entry => (entry.diffField=`/${entry.field}`) && entry);
C_TRACK_HISTORY_CONFIG.Role = 
    C_TRACK_HISTORY_CONFIG.Role.map(entry => (entry.diffField=`/${entry.field}`) && entry);
C_TRACK_HISTORY_CONFIG.User = 
    C_TRACK_HISTORY_CONFIG.User.map(entry => (entry.diffField=`/${entry.field}`) && entry);

PageDetailHistory = {
    propagationHandler: function ( poData ) {
        goArtifactHistoryRequest = poData;
        PageDetailHistory.setBusy( true );
        let loOptionsAuditLogHistoryRequest = {
            parameters: {
                "objectKey": poData.objectKey, // Required 
                "objectType": poData.objectType // Required 
            }
        };
        apiGetArtifactAndRelations_New(loOptionsAuditLogHistoryRequest);
    },
    setBusy: function ( pvState ) {
        setBusy( pvState, oSplitterPageStart /* oPageDetailHistory */);
    },
    replaceMessagePlaceholders: function(pvSourceText, poValues) {
        let lvText = pvSourceText;
        for (let lvIndex in poValues) {
            lvText = lvText.replace(`&${Number.parseInt(lvIndex)+1}`, poValues[lvIndex]);
        }
        return lvText;
    },
    handleGetArtifactsAndRelations: function(poOptions) {
        switch( !!poOptions.success ) {
            case false:
                sap.m.MessageBox.error(`${
                    txtErrorContactingTheServer.getText()}\n\n${
                    PageDetailHistory.replaceMessagePlaceholders(txtErrorMessageFormat.getText(), [poOptions.code, poOptions.message])}`);
                goArtifactHistoryObjectResponse = {};
                goArtifactHistoryAuditResponse = [];
                PageDetailHistory.refresh();
                PageDetailHistory.setBusy( false );
            default:
                goArtifactHistoryObjectResponse = poOptions.data;
                let loRequestOptions = { data:{} };
                const loTemplateRow = { 
                    beginDate: new Date(goArtifactHistoryRequest.createdAt).toISOString().slice(0,19).replace("T", " "), 
                    endDate: new Date().toISOString().slice(0,19).replace("T", " "),
                    content: goArtifactHistoryRequest.objectKey
                };
                switch (goArtifactHistoryRequest.objectType) {
                    case C_TYPE_GROUP:
                        loRequestOptions.data = {
                            // SELF
                            "where": [{objectType: goArtifactHistoryRequest.objectType, objectKey: goArtifactHistoryRequest.objectKey}]
                        }
                        break;
                    case C_TYPE_ROLE:
                        loRequestOptions.data = {
                            "where": [
                                // SELF
                                {objectType: goArtifactHistoryRequest.objectType, objectKey: goArtifactHistoryRequest.objectKey},
                                // Potential group cross-ref. 
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_GROUP, action: C_ACTION_CREATE}),
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_GROUP, action: C_ACTION_SAVE}),
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_GROUP, action: C_ACTION_DELETE}),
                                // Potential user cross-ref. 
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_USER, action: C_ACTION_CREATE}),
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_USER, action: C_ACTION_SAVE}),
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_USER, action: C_ACTION_DELETE})

                            ]
                        }
                        break;
                    case C_TYPE_USER:
                        loRequestOptions.data = {
                            // SELF
                            "where": [
                                // SELF
                                {objectType: goArtifactHistoryRequest.objectType, objectKey: goArtifactHistoryRequest.objectKey},
                                // Potential group cross-ref.
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_GROUP, action: C_ACTION_CREATE}),
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_GROUP, action: C_ACTION_SAVE}),
                                $.extend(true, {}, loTemplateRow, {objectType: C_TYPE_GROUP, action: C_ACTION_DELETE}),
                            ]
                        }
                        break;
                    default:
                        sap.m.MessageBox.error(
                            PageDetailHistory.replaceMessagePlaceholders(txtCantHandleArtifactType.getText(), [goArtifactHistoryRequest.objectType]));
                        goArtifactHistoryAuditResponse = [];
                        PageDetailHistory.refresh();
                        PageDetailHistory.setBusy( false );
                        return;
                }
                apiGetAuditLogAndCrossReferences(loRequestOptions);
        }
    },
    handleGetAuditLogAndCrossReferences: function(poOptions) {
        switch( !!poOptions.success ) {
            case false:
                sap.m.MessageBox.error(`${
                    txtErrorContactingTheServer.getText()}\n\n${
                    PageDetailHistory.replaceMessagePlaceholders(txtErrorMessageFormat.getText(), [poOptions.code, poOptions.message])}`);
                goArtifactHistoryAuditResponse = [];
                PageDetailHistory.refresh();
                PageDetailHistory.setBusy( false );
            default:
                goArtifactHistoryAuditResponse = poOptions.data;
                let loRequestOptions = { data:{} };
                switch (goArtifactHistoryRequest.objectType) {
                    case C_TYPE_GROUP:
                        // Already have all the necessary data:
                        PageDetailHistory.refresh();
                        PageDetailHistory.setBusy( false );
                        // Leave the flow and present the data
                        return;
                    case C_TYPE_ROLE:
                    case C_TYPE_USER:
                        // Common code for Role and User
                        // Gets an array of UUIDs
                        let loAllPossibleRelations = PageDetailHistory.buildAllPossibleRelations({
                            objectType: goArtifactHistoryRequest.objectType,
                            objectKey: goArtifactHistoryRequest.objectKey,
                            artifactHistory: poOptions.data,
                            artifact: goArtifactHistoryObjectResponse
                        });
                        const loTemplateRow = { 
                            beginDate: new Date(goArtifactHistoryRequest.createdAt).toISOString().slice(0,19).replace("T", " "), 
                            endDate: new Date().toISOString().slice(0,19).replace("T", " "),
                        };
                        loRequestOptions.data = { "where": [] };
                        // Gets the log entries for all these objects in the specified time
                        for (let lvUUID of loAllPossibleRelations) {
                            loRequestOptions.data.where.push($.extend(true, {}, loTemplateRow, {objectKey: lvUUID}));
                        }
                        break;
                    default:
                        sap.m.MessageBox.error(
                            PageDetailHistory.replaceMessagePlaceholders(txtCantHandleArtifactType.getText(), [goArtifactHistoryRequest.objectType]));
                        PageDetailHistory.refresh();
                        PageDetailHistory.setBusy( false );
                        return;
                }
                if (loRequestOptions.data.where.length) {
                    apiGetFinalCrossReferences(loRequestOptions);
                }
                else {
                    // There are no cross-references to look after, then just display what exists already
                    PageDetailHistory.refresh();
                    PageDetailHistory.setBusy( false );
                }
        }
    },
    handleGetFinalCrossReferences: function(poOptions) {
        switch( !!poOptions.success ) {
            case false:
                sap.m.MessageBox.error(`${
                    txtErrorContactingTheServer.getText()}\n\n${
                    PageDetailHistory.replaceMessagePlaceholders(txtErrorMessageFormat.getText(), [poOptions.code, poOptions.message])}`);
                goArtifactHistoryAuditResponse = [];
                PageDetailHistory.refresh();
                PageDetailHistory.setBusy( false );
                return;
            default:
                //
                // Only artifacts type Role or User can come here. 
                // Must extract the logs from the artifact first and then concat the result from API
                goArtifactHistoryAuditResponse = ModelData.Find(goArtifactHistoryAuditResponse, "objectKey", goArtifactHistoryRequest.objectKey)
                                                    .concat(poOptions.data);
                PageDetailHistory.refresh();
                PageDetailHistory.setBusy( false );
        }
    },
    buildAllPossibleRelations: function( poOptions ) {
        loHistoryData = PageDetailHistory.buildHistoryData(poOptions);
        // create a list of relation ids based on the built history data
        return loHistoryData.reduce( function(poPossibleRelations, poEntry) {
            if (Array.isArray(poEntry.added) && poEntry.added.length) {
                for (let loAddedField of poEntry.added) {
                    if (!(Array.isArray(loAddedField.value) && loAddedField.value.length)) {continue;}
                    for (let loNewRelation of loAddedField.value) {
                        // Adds to possible relations
                        if (!(typeof loNewRelation?.id === "string" && loNewRelation.id.length === C_LENGTH_UUID_STRING)) {continue;}
                        if (!poPossibleRelations.includes(loNewRelation.id)) { poPossibleRelations.push(loNewRelation.id) }
                    }
                }
            }
            if (Array.isArray(poEntry.deleted) && poEntry.deleted.length) {
                for (let loDeletedField of poEntry.deleted) {
                    if (!(Array.isArray(loDeletedField.value) && loDeletedField.value.length)) {continue;}
                    for (let loNewRelation of loDeletedField.value) {
                        // Adds to possible relations
                        if (!(typeof loNewRelation?.id === "string" && loNewRelation.id.length === C_LENGTH_UUID_STRING)) {continue;}
                        if (!poPossibleRelations.includes(loNewRelation.id)) { poPossibleRelations.push(loNewRelation.id) }
                    }
                }
            }
            return poPossibleRelations;
        },[]);
    },
    buildHistoryData: function( poOptions ) {
        /**
         * poOption: { 
         *      objectType: UUID,       // main artifact's type
         *      objectKey: UUID,        // main artifact's id
         *      artifactHistory: array  // audit log entries of artifact and relations that mention it in content
         * }
         */
        let lvNow = new Date();
        // Acquires the display configuration for this artifact type
        let loConfig = C_TRACK_HISTORY_CONFIG[goArtifactHistoryRequest.objectType];
        // Separates the artifact history from the relations history
        let loRelationsHistoryCopy = $.extend(true, [], poOptions.artifactHistory);
        let loArtifactHistoryCopy = ModelData.Find(loRelationsHistoryCopy, "objectKey", poOptions.objectKey);
        ModelData.Delete(loRelationsHistoryCopy, "objectKey", poOptions.objectKey);
        // after PageDetailHistory.reduceRelationsToMinimum, loRelationsHistoryCopy is now a Map object where 
        // given an objectKey => the relation History of that objectKey
        // e.g.: loSingleRelHist = loRelationsHistoryCopy.get(objectKey)
        loRelationsHistoryCopy = PageDetailHistory.reduceRelationsToMinimum(loRelationsHistoryCopy);
        // Prepares the artifact entries for comparison 
        //      pre-requisite: updatedAt is ordered in Descending
        //      note: the auditLog api already orders the entries by updatedAt DESC, it's important to keep it that way
        let loArtifactLogEntries = 
            // Inserts the current artifact data (as the absolute state)
            [{
                objectType: poOptions.objectType, 
                objectKey: poOptions.objectKey,
                createdAt: lvNow.toISOString(),
                changedBy: txtChangedbyUnknwonUser.getText(),
                updatedAt: lvNow.toISOString(),
                content: poOptions.artifact // goArtifactHistoryObjectResponse
            }]
            // adds all the modifications registered in the audit log (including create)
            .concat(loArtifactHistoryCopy)
            // appends an empty entry, so we can see:
            //  1: which fields were filled at the creation point (if the creation exists - single entry in the history tab)
            //  2: which fields were filled in since creation (period entry in the history tab)
            .concat([{
                objectType: poOptions.objectType, 
                objectKey: poOptions.objectKey,
                createdAt: poOptions.artifact.createdAt,
                updatedAt: poOptions.artifact.createdAt,
                content: {
                    id: poOptions.objectKey,
                    createdAt: poOptions.artifact.createdAt,
                    updatedAt: poOptions.artifact.createdAt
                }
            }]);
        // Builds the history
        // Note: it always assume an entry was found, even if modified, added and deleted are empty
        //       this is needed for the relations cross-reference. It will be checked on display
        let loHistoryFound = [];
        for (let lvIndex = 0; lvIndex < loArtifactLogEntries.length-1; lvIndex++) {
            if ([C_ACTION_ACTIVITY].includes(loArtifactLogEntries[lvIndex].action)) {
                loHistoryFound.push({
                    action   : loArtifactLogEntries[lvIndex].action,
                    changedBy: loArtifactLogEntries[lvIndex].changedBy,
                    beginDate: loArtifactLogEntries[lvIndex].createdAt,
                    endDate  : loArtifactLogEntries[lvIndex].createdAt,
                    modified : [], 
                    added    : [], 
                    deleted  : [],
                    activity : loArtifactLogEntries[lvIndex].content.detail
                });
                continue;
            }
            let loNewest = (loArtifactLogEntries[lvIndex]?.content?.detail)
                                ? loArtifactLogEntries[lvIndex].content.detail
                                : loArtifactLogEntries[lvIndex].content;
            let loOldest = (loArtifactLogEntries[lvIndex+1]?.content?.detail)
                                ? loArtifactLogEntries[lvIndex+1].content.detail
                                : loArtifactLogEntries[lvIndex+1].content;
            // Oldest is compared to Newest to findout the differences
            let loDiffData = compareObjects( loOldest, loNewest );
            let loHistoryEntry = {
                action   : loArtifactLogEntries[lvIndex].action,
                changedBy: loArtifactLogEntries[lvIndex].changedBy,
                beginDate: loArtifactLogEntries[lvIndex+1].createdAt,
                endDate  : loArtifactLogEntries[lvIndex].createdAt,
                modified : [], 
                added    : [], 
                deleted  : []
            };
            for (let loDiffEntry in loDiffData.modified) {
                let loDiffEntryConfig = ModelData.FindFirst(loConfig, ["diffField", "tracking"], [loDiffEntry, "F"]);
                if (loDiffEntryConfig) {
                    loHistoryEntry.modified.push({
                        field: loDiffEntry.displayAs || loDiffEntry.field,
                        from: loDiffData.modified[loDiffEntry].from, // from value
                        to: loDiffData.modified[loDiffEntry].to      // to value
                    });
                }
            };
            for (let loDiffEntry in loDiffData.added) {
                let loDiffEntry1st = (loDiffEntry.indexOf("/",1)<0) ? loDiffEntry : loDiffEntry.slice(0, loDiffEntry.indexOf("/",1));
                let loDiffEntryConfig = ModelData.FindFirst(loConfig, "diffField", loDiffEntry1st);
                if (loDiffEntryConfig) {
                    let lvDiffIndex = loDiffEntryConfig.displayAs || loDiffEntryConfig.field;
                    switch(loDiffEntryConfig.tracking) {
                        case "F":
                            loHistoryEntry.added.push({
                                field: lvDiffIndex,
                                value: loDiffData.added[loDiffEntry] // value
                            });
                            break;
                        case "R":
                            let loDiffIndexFound = ModelData.FindFirst(loHistoryEntry.added, "field", lvDiffIndex);
                            let loValue = Array.isArray(loDiffData.added[loDiffEntry])
                                            ? loDiffData.added[loDiffEntry]
                                            : [loDiffData.added[loDiffEntry]];
                            if (loDiffIndexFound) {
                                loDiffIndexFound.value = loDiffIndexFound.value.concat(loValue)
                            }
                            else {
                                loHistoryEntry.added.push({
                                    field: lvDiffIndex,
                                    value: loValue
                                });
                            }
                            break;
                    }
                }
            };
            for (let loDiffEntry in loDiffData.deleted) {
                let loDiffEntry1st = (loDiffEntry.indexOf("/",1)<0) ? loDiffEntry : loDiffEntry.slice(0, loDiffEntry.indexOf("/",1));
                let loDiffEntryConfig = ModelData.FindFirst(loConfig, "diffField", loDiffEntry1st);
                if (loDiffEntryConfig) {
                    let lvDiffIndex = loDiffEntryConfig.displayAs || loDiffEntryConfig.field;
                    switch(loDiffEntryConfig.tracking) {
                        case "F":
                            loHistoryEntry.deleted.push({
                                field: lvDiffIndex,
                                value: loDiffData.added[loDiffEntry] // value
                            });
                            break;
                        case "R":
                            let loDiffIndexFound = ModelData.FindFirst(loHistoryEntry.deleted, "field", lvDiffIndex);
                            let loValue = Array.isArray(loDiffData.deleted[loDiffEntry])
                                            ? loDiffData.deleted[loDiffEntry]
                                            : [loDiffData.deleted[loDiffEntry]];
                            if (loDiffIndexFound) {
                                loDiffIndexFound.value = loDiffIndexFound.value.concat(loValue)
                            }
                            else {
                                loHistoryEntry.deleted.push({
                                    field: lvDiffIndex,
                                    value: loValue // array of values
                                });
                            }
                            break;
                    }
                }
            };
            loHistoryFound.push(loHistoryEntry);
        }
        // Calculates the relationships
        let loAllEntries = Array.from(loRelationsHistoryCopy.keys());
        // // array of objectKey
        // let loConfigRelations = (ModelData.Find(loConfig, "tracking", "R")).reduce(function (poAccum, poValue) {
        //     poAccum.push(poValue.field);
        //     return poAccum;
        // },[]);
        for (let loDiffEntry of loHistoryFound) {
            // Copies the list of all possible relations. Use the copy only
            let loAllEntriesCopy = $.extend( true, [], loAllEntries);
            // user activity is not processed here
            if ([C_ACTION_ACTIVITY].includes(loDiffEntry.action)) { continue; }
            // using the configured roles
            for (let loConfigRel of ModelData.Find(loConfig, "tracking", "R")) {
                // access the relations that were added/removed
                /* ADDED */
                let loAddedRelations = ModelData.FindFirst(loDiffEntry.added, "field", (loConfigRel.displayAs || loConfigRel.field))?.value;
                loAddedRelations = Array.isArray(loAddedRelations) ? loAddedRelations : [];
                for (let loRelation of loAddedRelations) {
                    // get all the cross refs. found
                    let loRelationInPeriod = ModelData.Find(
                        ModelData.Find(loRelationsHistoryCopy.get(loRelation.id) || [], "updatedAt", loDiffEntry.beginDate, "GE"),
                        "updatedAt", loDiffEntry.endDate, "LE" );
                    if (loAllEntriesCopy.indexOf(loRelation.id)>=0) { 
                        // Removes the entry if it exists
                        loAllEntriesCopy.splice(loAllEntriesCopy.indexOf(loRelation.id),1); 
                    }
                    // must have cross-ref to continue
                    if (!(Array.isArray(loRelationInPeriod) && loRelationInPeriod.length)) {continue;}
                    loRelation._crossRef = [];
                    // just add the cross-ref (including the type)
                    for (let loRipEntry of loRelationInPeriod) {
                        loRelation._crossRef.push({
                            added     : PageDetailHistory.hasObjectInContent(loRipEntry, poOptions),
                            objectType: loRipEntry.objectType,
                            objectKey : loRipEntry.objectKey,
                            objectName: loRipEntry.objectName,
                            createdAt : loRipEntry.createdAt,
                            updatedAt : loRipEntry.updatedAt,
                            changedBy : loRipEntry.changedBy
                        });
                    }
                }
                /* REMOVED */
                // loAllEntriesCopy: Uses a temporary to hold the loop, while it may change
                let loAllEntriesCopyTemp = $.extend( true, [], loAllEntriesCopy);
                for (let lvRelationId of loAllEntriesCopyTemp) {
                    // get all the cross refs. found
                    let loRelationInPeriod = ModelData.Find(
                        ModelData.Find(loRelationsHistoryCopy.get(lvRelationId) || [], "updatedAt", loDiffEntry.beginDate, "GE"),
                        "updatedAt", loDiffEntry.endDate, "LE" );
                    // must have cross-ref to continue
                    if (!(Array.isArray(loRelationInPeriod) && loRelationInPeriod.length)) {continue;}
                    // It must be of the same object type
                    if (!(loRelationInPeriod[0].objectType === loConfigRel.searchAs)) {continue;}
                    loAllEntriesCopy.splice(loAllEntriesCopy.indexOf(lvRelationId),1);
                    let loRelation = ModelData.FindFirst(
                        // Search inside the values of the relation
                        (ModelData.FindFirst(
                            loDiffEntry.deleted, 
                            "field", 
                            (loConfigRel.displayAs || loConfigRel.field)) || { value:[] }).value,
                        "id",
                        lvRelationId);
                    if (!loRelation) {
                        loRelation = $.extend( true, {}, (loRelationInPeriod[0].content?.detail) 
                                                            ? loRelationInPeriod[0].content.detail 
                                                            : loRelationInPeriod[0].content)
                        if (!(loRelation && loRelation.id)) {
                            // This may happen when action === C_ACTION_DELETE
                            let lvName = '';
                            switch (loConfigRel.searchAs) {
                                case C_TYPE_USER:
                                    lvName = 'username';
                                    break;
                                case C_TYPE_GROUP:
                                case C_TYPE_ROLE:
                                    lvName = 'name'
                                    break;
                            };
                            loRelation = { id: loRelationInPeriod[0].objectKey };
                            loRelation[lvName] = loRelationInPeriod[0].objectName;
                            console.log( loRelation );
                        }
                        loDiffEntry.deleted.push({
                            field: loConfigRel.displayAs || loConfigRel.field,
                            value: [loRelation]
                        });
                    }
                    loRelation._crossRef = [];
                    // just add the cross-ref (including the type)
                    for (let loRipEntry of loRelationInPeriod) {
                        loRelation._crossRef.push({
                            added     : PageDetailHistory.hasObjectInContent(loRipEntry, poOptions),
                            objectType: loRipEntry.objectType,
                            objectKey : loRipEntry.objectKey,
                            objectName: loRipEntry.objectName,
                            createdAt : loRipEntry.createdAt,
                            updatedAt : loRipEntry.updatedAt,
                            changedBy : loRipEntry.changedBy
                        });
                    }
                }
                // delete the temp copy
                delete loAllEntriesCopyTemp;
            }
        }
        return loHistoryFound;
    },
    reduceRelationsToMinimum: function( poRelationsHistory ) {
        /**
         * This method will reduce entries to match the exact moment the artifact was added or removed.
         * First acquire all unique relations and then apply the relation's reduction process 
         * Process (for each unique relation):
         *      - marks the oldest entry as the cursor
         *      - if this cursor has a relation to the artifact then 
         *          - (yes it has) start the reduction with it;
         *          - ignore otherwise: it means there was no relation before, and their change history started with the first addition found
         *      - loops through the entries of the same artifact, starting from the next to oldest (and up)
         *          - if the cursor and the indexedEntry both do NOT have a relation to the artifact, then 
         *              - ignores the indexedEntry and jumps to the next;
         *          - else if the cursor and the indexedEntry both DO have a relation to the artifact, then 
         *              - ignores the indexedEntry and jumps to the next;
         *          - else then
         *              - keep the indexedEntry and make it the cursor.
         *              - insert this entry
         */ 
        let loSource = goArtifactHistoryRequest;
        let loUniqueRelations = poRelationsHistory.reduce(
            function(poUniqueBundle, poEntry) {
                if (!poUniqueBundle.includes(poEntry.objectKey)) {
                    poUniqueBundle.push(poEntry.objectKey);
                }
                return poUniqueBundle;
            }, 
            [] // Initial state of poUniqueBundle
        );
        // Applies the reduction process
        let loAllReducedRelations = new Map();
        for (let loObjectKey of loUniqueRelations) {
            let loRelationHistory = ModelData.Find(poRelationsHistory, "objectKey", loObjectKey);
            ModelData.Delete(loRelationHistory, ["action"         , "objectType"],
                                                [C_ACTION_ACTIVITY, C_TYPE_USER ]);
            // If it was all User Activities, then skip to the next
            if (!loRelationHistory.length) { continue; }
            let loReducedRelation = [];
            let loCursor = loRelationHistory[loRelationHistory.length - 1];
            // Inserts first item if it is an "Add"
            if (PageDetailHistory.hasObjectInContent(loCursor, loSource)) {loReducedRelation.push(loCursor);}
            for (let lvIndex=loRelationHistory.length-2; lvIndex>=0; lvIndex--) {
                // If the relation was added/deleted equally on both then skip
                if (PageDetailHistory.hasObjectInContent(loCursor, loSource)
                    ===
                    PageDetailHistory.hasObjectInContent(loRelationHistory[lvIndex], loSource)) { continue; }
                // otherwise, change the cursor to the current entry and insert it
                loCursor = loRelationHistory[lvIndex];
                loReducedRelation.splice(0,0,loCursor);
            }
            loAllReducedRelations.set(loObjectKey, loReducedRelation);
        }
        return loAllReducedRelations;
    },
    hasObjectInContent: function(poEntry, poRelationToFind) {
        let loEntry = (poEntry.content?.detail) ? poEntry.content.detail : poEntry.content;
        let loRelationName = "";
        switch(poRelationToFind.objectType) {
            case C_TYPE_GROUP:
                loRelationName = "departments"
                break;
            case C_TYPE_ROLE:
                loRelationName = "roles"
                break;
            case C_TYPE_USER:
                loRelationName = "users"
                break;
        }
        let loFound = ModelData.FindFirst(
            Array.isArray(loEntry[loRelationName]) ? loEntry[loRelationName] : [], 
            "id", 
            poRelationToFind.objectKey);
        return !!loFound;
    },
    refresh: function () {
        // TODO: 
        /**
         * goArtifactHistoryRequest - contains the data from the tree table entry related to the artifact history
         * goArtifactHistoryObjectResponse - contains the artifact's current data
         * goArtifactHistoryAuditResponse - contains all the audit log data relevant this artifact's history
         */
        if (!goArtifactHistoryObjectResponse) {
            // **=================**
            // ** OUTPUT: No data **
            // **=================**
            oHtmlDetailHistoryDisplay.CUST?.monacoEditor & oHtmlDetailHistoryDisplay.CUST.monacoEditor.setValue(txtNoInformationFound.getText());
            oHtmlDetailHistoryDisplay.CUST?.monacoEditor & oHtmlDetailHistoryDisplay.CUST.monacoEditor.setScrollPosition({scrollTop: 0});
            return;
        }
        // **==================**
        // ** Current Artifact **
        // **==================**
        // Header for the current artifact data
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
                loText.push(`\t${loConfigRow.displayAs || loConfigRow.field}: ${PageDetailHistory.valueOutput(goArtifactHistoryObjectResponse[loConfigRow.field])}`);
            }
        }

        // **================**
        // ** Change History **
        // **================**
        loText.push("\n");
        switch (goArtifactHistoryRequest.objectType) {
            case C_TYPE_USER:
                loText.push(`${txtArtifactActivityAndChangeHistory.getText()}:`);
                break;
            default:
                loText.push(`${txtArtifactChangeHistory.getText()}:`);
        }
        if (!(Array.isArray(goArtifactHistoryAuditResponse) && goArtifactHistoryAuditResponse.length)) {
            // Sanity check
            goArtifactHistoryAuditResponse = [];
        }

        let lvChangeCount = 0;
        let loAllHistoryData = PageDetailHistory.buildHistoryData({
            objectType: goArtifactHistoryRequest.objectType,
            objectKey: goArtifactHistoryRequest.objectKey,
            artifactHistory: goArtifactHistoryAuditResponse,
            artifact: goArtifactHistoryObjectResponse
        });
        for (let loEntry of loAllHistoryData) {
            if (PageDetailHistory.hasNoChange(loEntry)) {continue};
            lvChangeCount++;
            loText = loText.concat(PageDetailHistory.outputEntry(loEntry, loConfig, 1)); // 1 => tabCount
        }
        if (!lvChangeCount) {
            loText.push(`\t${txtNoArtifactChangeHistoryFound.getText()}`);
        }
        // **==========================================**
        // ** OUTPUT: Artifact data and change history **
        // **==========================================**
        oHtmlDetailHistoryDisplay.CUST?.monacoEditor & oHtmlDetailHistoryDisplay.CUST.monacoEditor.setValue(loText.join("\n"));
        oHtmlDetailHistoryDisplay.CUST?.monacoEditor & oHtmlDetailHistoryDisplay.CUST.monacoEditor.setScrollPosition({scrollTop: 0});
    },
    outputEntry: function (poEntry, poConfig, pvTabCount) {
        switch( poEntry.action ) {
            case C_ACTION_ACTIVITY:
                return PageDetailHistory.outputActivity( poEntry, pvTabCount );
            default:
                let loBeginDate = new Date(poEntry.beginDate).toISOString().slice(0,19);
                let loEndDate   = new Date(poEntry.endDate)  .toISOString().slice(0,19);
                if (loBeginDate === loEndDate) {
                    return PageDetailHistory.outputSingleEntry( poEntry, poConfig, pvTabCount );
                }
        }
        return PageDetailHistory.outputPeriod( poEntry, poConfig, pvTabCount );
    },
    outputActivity: function(poEntry, pvTabCount ){
        let lvTabs = "\t".repeat(pvTabCount);
        return [
            `${lvTabs}[${PageDetailHistory.valueOutput(poEntry.beginDate)}] ${poEntry.changedBy}`,
            // user activity: &1 (&2) with data "&3"
            `${lvTabs}\t${txtHistoryUserActivity.getText()
                    .replace("&1",poEntry.activity.action)
                    .replace("&2",poEntry.activity.result)
                    .replace("&3",poEntry.activity.data)}`
        ];
    },
    outputSingleEntry: function(poEntry, poConfig, pvTabCount ){
        let lvTabs = "\t".repeat(pvTabCount);
        let lvDate1 = PageDetailHistory.valueOutput(poEntry.beginDate);
        let loText  = [`${lvTabs}[${lvDate1}] ${poEntry.changedBy}`];
        return loText.concat(PageDetailHistory.outputEntryHistory(poEntry, poConfig, pvTabCount+1));
    },
    outputPeriod: function(poEntry, poConfig, pvTabCount ){
        let lvTabs = "\t".repeat(pvTabCount);
        let lvDate1 = PageDetailHistory.valueOutput(poEntry.beginDate);
        let lvDate2 = PageDetailHistory.valueOutput(poEntry.endDate);
        let loText  = [`${lvTabs}[${lvDate1} -> ${lvDate2}] ${poEntry.changedBy}`];
        return loText.concat(PageDetailHistory.outputEntryHistory(poEntry, poConfig, pvTabCount+1));
    },
    outputEntryHistory: function(poEntry, poConfig, pvTabCount ){
        let loText = [];
        for (let loEntry of poEntry.modified) {
            let loEntryConfig = ModelData.FindFirst(poConfig, "field", loEntry.field);
            if (!(loEntryConfig && loEntryConfig.diff.includes("M"))) { continue; }
            let loChidText = PageDetailHistory.outputEntryHistoryField(loEntry, "M", pvTabCount); 
            loText = loText.concat(loChidText);
        }
        for (let loEntry of poEntry.added) {
            let loEntryConfig = ModelData.FindFirst(poConfig, "displayAs", loEntry.field) 
                                || 
                                ModelData.FindFirst(poConfig, "field", loEntry.field);
            if (!(loEntryConfig && loEntryConfig.diff.includes("A"))) { continue; }
            let loChidText = []
            if (loEntryConfig.tracking === "F") {
                loChidText = PageDetailHistory.outputEntryHistoryField(loEntry, "A", pvTabCount);
            }
            else if (loEntryConfig.tracking === "R") {
                loChidText = PageDetailHistory.outputEntryHistoryRelation(loEntry, "A", pvTabCount);
            }
            loText = loText.concat(loChidText);
        }
        for (let loEntry of poEntry.deleted) {
            let loEntryConfig = ModelData.FindFirst(poConfig, "displayAs", loEntry.field)
                                ||
                                ModelData.FindFirst(poConfig, "field", loEntry.field);
            if (!(loEntryConfig && loEntryConfig.diff.includes("R"))) { continue; }
            // Once a field already exists it is at most modified, so a field can only be added or modified.
            // Removal only makes sense to relations
            let loChidText = PageDetailHistory.outputEntryHistoryRelation(loEntry, "R", pvTabCount);
            loText = loText.concat(loChidText);
        }
        return loText;
    },
    outputEntryHistoryField: function(poEntry, pvDiffMode, pvTabCount) {
        let lvTabs = "\t".repeat(pvTabCount);
        switch(pvDiffMode) {
            case "M":
                // FIELD: from VALUE1; to VALUE2
                // &1: from &2; to &3
                return [`${lvTabs}${txtHistoryFieldModifiedOutput.getText()
                                        .replace("&1", poEntry.field)
                                        .replace("&2", poEntry.from)
                                        .replace("&3", poEntry.to)}`];
            case "A":
                // FIELD: added VALUE1
                // &1: added &2
                if (typeof poEntry.value === "undefined" || poEntry.value === null) {return [];}
                return [`${lvTabs}${txtHistoryFieldAddedOutput.getText()
                                        .replace("&1", poEntry.field)
                                        .replace("&2", poEntry.value)}`];
            // case "R":            
            //     return [`${lvTabs}`];
        }
        // TODO: add txtHistoryFieldModifiedOutput; txtHistoryFieldAddedOutput
    },
    outputEntryHistoryRelation: function(poEntry, pvDiffMode, pvTabCount) {
        let lvTabs = "\t".repeat(pvTabCount);
        let loText = [];
        if (!(Array.isArray(poEntry.value) && poEntry.value.length)) {return [];}
        switch(pvDiffMode) {
            case "A":
                // (groups|roles|users) added:
                // &1 added:
                loText.push(`${lvTabs}${txtHistoryRelationAddedOutput.getText()
                                            .replace("&1", poEntry.field)}`);
                break;
            case "R":
                // (groups|roles|users) removed:
                // &1 removed:
                loText.push(`${lvTabs}${txtHistoryRelationRemovedOutput.getText()
                                            .replace("&1", poEntry.field)}`);
                break;
        }
        for (let loRelation of poEntry.value) {
            // name: NAME; id: GUID
            // name: &1; id: &2
            loText.push(`${lvTabs}\t${txtHistoryRelationDataOutput.getText()
                                        .replace("&1", (loRelation.name || loRelation.username))
                                        .replace("&2", loRelation.id)}`);
            if (Array.isArray(loRelation._crossRef)) {
                for (let loCrossRef of loRelation._crossRef) {
                    switch(loCrossRef.added) {
                        case true:
                            // [DATE TIME] added by USER
                            // [&1] added by &2
                            loText.push(`${lvTabs}\t\t${txtHistoryRelationCrossrefAddedOutput.getText()
                                                            .replace("&1", PageDetailHistory.valueOutput(loCrossRef.updatedAt))
                                                            .replace("&2", loCrossRef.changedBy)}`);
                            break;
                        default:
                            // [DATE TIME] removed by USER
                            // [&1] removed by &2
                            loText.push(`${lvTabs}\t\t${txtHistoryRelationCrossrefRemovedOutput.getText()
                                                            .replace("&1", PageDetailHistory.valueOutput(loCrossRef.updatedAt))
                                                            .replace("&2", loCrossRef.changedBy)}`);
                    }
                }
            }
        }
        return loText;
        // TODO: add texts
    },
    hasNoChange: function( poDiffEntry ) {
        let loModified = Array.isArray(poDiffEntry?.modified) ? poDiffEntry.modified : [];
        let loAdded    = Array.isArray(poDiffEntry?.added   ) ? poDiffEntry.added    : [];
        let loDeleted  = Array.isArray(poDiffEntry?.deleted ) ? poDiffEntry.deleted  : [];
        return (!(loModified.length || loAdded.length || loDeleted.length || poDiffEntry?.activity));
    },
    valueOutput: function( poValue ) {
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

}
