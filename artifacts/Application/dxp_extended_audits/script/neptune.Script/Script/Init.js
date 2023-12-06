sap.ui.getCore().attachInit(function(startParams) {
    setTimeout( () => {
        modelAppControl.setData(
            // Confirm with AppControl.Model 
            {
                "supports" : {
                    "monaco": !!monaco
                },
                "filter": {
                    "search": "",
                    "package": [],
                    "folder": "",
                    "status": ""
                },
                "types": [
                    { "key": C_TYPE_GROUP, "text": txtLiteralGroup.getText() },
                    { "key": C_TYPE_ROLE , "text": txtLiteralRole.getText() },
                    { "key": C_TYPE_USER , "text": txtLiteralUser.getText() },
                ],
                "keys": [
                    { "key": "New", "text": txtLiteralNew.getText() } // "type": undefined => Any
                ],
                "actions": [
                    { "key": C_ACTION_ACTICITY, "text": txtLiteralActivity.getText() },
                    { "key": C_ACTION_SAVE    , "text": txtLiteralSave.getText() },
                    { "key": C_ACTION_CREATE  , "text": txtLiteralCreate.getText() },
                    { "key": C_ACTION_DELETE  , "text": txtLiteralDelete.getText() },
                ],
                "treeTable": {
                    "lastArtifact": ""
                },
                "toggle": {
                    "typeAndKey": {
                        "group": false,
                        "role": false,
                        "user": false
                    }
                },
                "messageStrip": {
                    "typeAndKey": {
                        "visible": false
                    }
                }
            }
        );
        
        oHtmlJsonDisplay
            .setContent(`<div id='${oHtmlJsonDisplay.getId()}' style='width:100%;height:100%'></div>`);
        oHtmlDetailHistoryDisplay
            .setContent(`<div id='${oHtmlDetailHistoryDisplay.getId()}' style='width:100%;height:calc(100% - 2rem)'></div>`);

        goRelationsTexts = {
            group: txtLiteralGroup.getText(),
            groups:txtLiteralGroups.getText(),
            role:  txtLiteralRole.getText(),
            roles: txtLiteralRoles.getText(),
            user:  txtLiteralUser.getText(),
            users: txtLiteralUsers.getText()
        }

        txtoTreeTabledescription.setWrapping(false);
        txtoTreeTablepackage.setWrapping(false);
        txtoTreeTableStatus.setWrapping(false);
        txtoTreeTablecreatedAt.setWrapping(false);
        txtoTreeTablecreatedBy.setWrapping(false);
        txtoTreeTableupdatedAt.setWrapping(false);
        txtoTreeTablechangedBy.setWrapping(false);

        colHoTableSearchAuditResultsupdatedAt.setWrapping(false);
        colHoTableSearchAuditResultscreatedAt.setWrapping(false);
        colHoTableSearchAuditResultschangedBy.setWrapping(false);

        // ArtifactPropagation
        ArtifactPropagation.subscribe(oPageDetailHistory.getId(), gfHandlerPageDetailHistory);

        // Gets the packages
        setBusy( true, oSplitterPageStart );

        // Launchpad code to get the packages
        sap.n.Planet9.getPackageList().then(function(poPackages) { 
            let loPackages = [];
            for (loPackSingle of poPackages) {
                loPackages.push({"id": loPackSingle.id, "name": loPackSingle.name})
            }
            modelDataPackages.setData({
                result: {
                    packages: loPackages
                }
            });
            // console.log(loPackages);
            toolStartUpdate.firePress();
            setBusy( false, oSplitterPageStart );
        });

    }, 100);
});