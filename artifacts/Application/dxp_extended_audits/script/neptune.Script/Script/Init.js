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
                    { "key": "Department", "text": txtLiteralGroup.getText() },
                    { "key": "Role", "text": txtLiteralRole.getText() },
                    { "key": "User", "text": txtLiteralUser.getText() },
                ],
                "keys": [
                    { "key": "New", "text": txtLiteralNew.getText() }
                ],
                "actions": [
                    { "key": "Activity", "text": txtLiteralActivity.getText() },
                    { "key": "Save", "text": txtLiteralSave.getText() },
                    // { "key": "Create", "text": txtLiteralCreate.getText() },
                    { "key": "Delete", "text": txtLiteralDelete.getText() },
                ]
            }
        );
        
        oHtmlJsonDisplay
            .setContent(`<div id='${oHtmlJsonDisplay.getId()}' style='width:100%;height:100%'></div>`);

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

        // Gets the packages
        setBusy( true, oSplitterPageStart );

        // TODO: packages
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
            console.log(loPackages);
            toolStartUpdate.firePress();
            setBusy( false, oSplitterPageStart );
        });
    //    apiGetPackages();
        
        //
        // DEBUG
        window.CUST = {
            o: {
                goMonacoEditor: goMonacoEditor,
                When: When
            }
        }

    }, 100);
});