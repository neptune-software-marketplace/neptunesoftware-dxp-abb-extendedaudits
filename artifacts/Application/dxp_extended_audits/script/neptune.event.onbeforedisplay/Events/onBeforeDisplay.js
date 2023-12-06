let loCurrentMultiInput = sap.ui.getCore().byId(APPVIEW.createId("oInputHeaderPackageFilter"));

let loPackageIds = Array.isArray((sap?.n?.storage?.getWorkspacePackages) ?sap.n.storage.getWorkspacePackages() :null) ? $.extend( true, [], sap.n.storage.getWorkspacePackages() ) : [];
if (!loPackageIds.length) {
    When.promise(() => Array.isArray(modelAppControl.getData()?.filter?.package) ? 1 : 0).then(() => {
        loCurrentMultiInput.removeAllTokens();
        modelAppControl.getData().filter.package = [];
        modelAppControl.refresh();
        applyFilterToTree();
    });
    return;
}
// modelAppControl.getData().filter.package = $.extend( true, [], loPackageIds );
let loTokens = [];
sap.n.Planet9.getPackageList().then( loPackages => {
    for (let lvPackageId of loPackageIds) {
        let loPackageInfo = ModelData.FindFirst(loPackages, "id", lvPackageId);
        if (loPackageInfo) {
            loTokens.push(new sap.m.Token({"key": loPackageInfo.id, "text": loPackageInfo.name}))
        }
        else {
            loTokens.push(new sap.m.Token({"key": lvPackageId, "text": lvPackageId}))
        }
    }
    loCurrentMultiInput.setTokens(loTokens);
}); 