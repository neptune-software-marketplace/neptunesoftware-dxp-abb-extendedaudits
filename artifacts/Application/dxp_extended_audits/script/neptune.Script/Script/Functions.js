const setBusyQueue = {}; 
function setBusy( pvState, poObject, pvDelay ) {
    const C_GLOBAL = '_';
    let lvObjName = (poObject instanceof sap.ui.core.Control) ? poObject.getId() : C_GLOBAL;
    if (!setBusyQueue[lvObjName]) {setBusyQueue[lvObjName] = 0;}
    let lvDelay = (isNaN(Number.parseInt(pvDelay)) || (pvDelay < 0)) ? 0 : Number.parseInt(pvDelay);
    let lvState = !!(pvState);
    if (poObject instanceof sap.ui.core.Control) {
        // act?
        if (
            (pvState && !setBusyQueue[lvObjName]) /* ...... setBusy=true AND first enqueue */
            ||
            ((!pvState) && (setBusyQueue[lvObjName]<=1)) /* setBusy=false AND last dequeue */
        ) {
            poObject.setBusyIndicatorDelay( lvDelay );
            poObject.setBusy( lvState );
        }
    }
    else if ( lvState ) {
        if (!setBusyQueue[lvObjName]) { /* setBusy=true AND first enqueue */
            sap.ui.core.BusyIndicator.show( lvDelay );
        }
    }
    else {
        if (setBusyQueue[lvObjName]<=1) { /* setBusy=false AND last enqueue */
            sap.ui.core.BusyIndicator.hide(); 
        }
    }
    // progress enqueue/dequeue
    setBusyQueue[lvObjName] = (lvState) ? setBusyQueue[lvObjName]+1 : setBusyQueue[lvObjName]-1;
}

function getSAPDateTimeString( poDateValue ) {
    let loDate;
    try {
        loDate = new Date(poDateValue)
    }
    catch(e) { }
    if ((!loDate) || !(loDate instanceof Date) || isNaN(loDate)) { return ''; } // Not a valid date. Returns empty
    let lvDateString = loDate.toISOString().replace("T", " ").slice(0,19);
    let lvDay = lvDateString.slice(8,10);
    let lvMonth = lvDateString.slice(5,7);
    let lvYear = lvDateString.slice(0,4);
    return `${lvDay}.${lvMonth}.${lvYear}${lvDateString.slice(10)}`;
}

function harmonizeBundleToMultipleSingleEntries( poSelectionEntry ) {
    // Harmonize objectType
    if (!(poSelectionEntry.objectType || poSelectionEntry?.objectTypeMany?.length)) {
        return []
            .concat(harmonizeBundleToMultipleSingleEntries($.extend(true,{},poSelectionEntry,{objectType:'Department'})))
            .concat(harmonizeBundleToMultipleSingleEntries($.extend(true,{},poSelectionEntry,{objectType:'Role'})))
            .concat(harmonizeBundleToMultipleSingleEntries($.extend(true,{},poSelectionEntry,{objectType:'User'})));
    }
    else if ((!poSelectionEntry.objectType) && Array.isArray(poSelectionEntry?.objectTypeMany) && poSelectionEntry?.objectTypeMany?.length) {
        let loHarmonizedEntries = [];
        for (let lvTypeName of poSelectionEntry.objectTypeMany) {
            let loNewEntries = harmonizeBundleToMultipleSingleEntries($.extend(true,{},poSelectionEntry,{objectType: lvTypeName}));
            loHarmonizedEntries = loHarmonizedEntries.concat( loNewEntries );
        }
        return loHarmonizedEntries;
    }
    // Harmonize objectKey
    if ((!poSelectionEntry.objectKey) && Array.isArray(poSelectionEntry?.objectKeyMany) && poSelectionEntry?.objectKeyMany?.length) {
        let loHarmonizedEntries = [];
        for (let lvKeyName of poSelectionEntry.objectKeyMany) {
            let loNewEntries = harmonizeBundleToMultipleSingleEntries($.extend(true,{},poSelectionEntry,{objectKey: lvKeyName}));
            loHarmonizedEntries = loHarmonizedEntries.concat( loNewEntries );
        }
        return loHarmonizedEntries;
    }
    // Harmonize action
    else if ((!poSelectionEntry.action) && Array.isArray(poSelectionEntry?.actionMany) && poSelectionEntry?.actionMany?.length) {
        let loHarmonizedEntries = [];
        for (let lvActionName of poSelectionEntry.actionMany) {
            let loNewEntries = harmonizeBundleToMultipleSingleEntries($.extend(true,{},poSelectionEntry,{action: lvActionName}));
            loHarmonizedEntries = loHarmonizedEntries.concat( loNewEntries );
        }
        return loHarmonizedEntries;
    }
    //
    // Now all fields are one value only.
    // Remove excess values
    delete poSelectionEntry.objectTypeMany;
    delete poSelectionEntry.objectKeyMany;
    delete poSelectionEntry.actionMany;
    return [ poSelectionEntry ];
}

function resetFiltersInMainScreen( poOptions ) {
    oInputHeaderSearch.setValue( (poOptions?.search) ? poOptions.search : '' );
    let loPackageTokens = [];
    for (let loPackage of (Array.isArray(poOptions?.package) ? poOptions?.package : [])){
        if (loPackage instanceof sap.m.Token) {
            loPackageTokens.push(loPackage);
        }
        else if (typeof loPackage === "object") {
            if (loPackage.key && loPackage.text) {
                loPackageTokens.push(new sap.m.Token(loPackage));
            }
            else if (loPackage.key) {
                loPackageTokens.push(new sap.m.Token({"key": loPackage.key, "text": loPackage.key}));
            }
        }
    }
    sap.n.storage.setWorkspacePackages(Array.isArray(poOptions?.package) ? poOptions?.package : []);
    oInputHeaderPackageFilter.setTokens(loPackageTokens);
    oInputHeaderPackageFilter.setValue( '' );
    oInputHeaderShowBy.setSelectedKey( (poOptions?.showBy) ? poOptions.showBy : 'all' );
    oInputHeaderStatus.setSelectedKey( (poOptions?.status) ? poOptions.status : 'all' );

    modelAppControl.getData().filter = {
        search:  oInputHeaderSearch.getValue(),
        package: sap.n.storage.getWorkspacePackages(),
        showBy:  oInputHeaderShowBy.getSelectedKey(),
        status:  oInputHeaderStatus.getSelectedKey()
    }
    modelAppControl.refresh();
    applyFilterToTree();
}
