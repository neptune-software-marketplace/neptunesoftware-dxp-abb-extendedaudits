function applyFilterToTree() {
    const loFilterSettings = modelAppControl.getData()?.filter;

    const loMainFilter = [];

    if ((typeof loFilterSettings?.search === "string") && (loFilterSettings?.search.trim()!=="")) {
        loMainFilter.push(new sap.ui.model.Filter({
            filters: [
                new sap.ui.model.Filter("objectKey", "EQ", loFilterSettings.search),
                new sap.ui.model.Filter("name", "Contains", loFilterSettings.search),
                new sap.ui.model.Filter("description", "Contains", loFilterSettings.search)
            ],
            and: false
        }));
    }
    if (Array.isArray(loFilterSettings?.package) && (loFilterSettings.package.length)) {
        let loFilterPackages = [];
/*
        // Filters only the element that contains the property "package"
        for (let lvPackageId of loFilterSettings.package) {
            loFilterPackages.push(new sap.ui.model.Filter("package", "EQ", lvPackageId));
        }
*/
        // Filters the elements that contains the property "package" and their reespective descendants
        // (through the usage of filtercrumb)
        let loRelations = Array.isArray(modelDataPackageFltercrumbs.getData()?.relations) ? modelDataPackageFltercrumbs.getData().relations : [];
        for (let lvPackageId of loFilterSettings.package) {
            let loPackageFiltercrumbs = ModelData.Find(loRelations, "package", lvPackageId);
            for (let loRelation of loPackageFiltercrumbs) {
                loFilterPackages.push(new sap.ui.model.Filter("filtercrumb", "StartsWith", loRelation.filtercrumb));
            }
        }

        if (loFilterPackages.length == 1) {
            loMainFilter.push(loFilterPackages[0]);
        }
        else {
            loMainFilter.push(new sap.ui.model.Filter({
                filters: loFilterPackages,
                and: false
            }))
        }
    }

    if (['department', 'role', 'user'].includes(loFilterSettings?.folder)) {
        loMainFilter.push(new sap.ui.model.Filter("root", "EQ", loFilterSettings?.folder));
    }

    switch(loFilterSettings?.status) {
        case 'active':
            loMainFilter.push(new sap.ui.model.Filter("active", "NE", false));
            loMainFilter.push(new sap.ui.model.Filter("locked", "NE", true));
            break;
        case 'inactive':
            loMainFilter.push(new sap.ui.model.Filter("active", "EQ", false));
            break;
        case 'locked':
            loMainFilter.push(new sap.ui.model.Filter("locked", "EQ", true));
            break;
    }

    const loBinding = oTreeTable.getBinding("rows");
    loBinding.filter(loMainFilter); // loMainFilter is always an array
}

function applyVisibleObjectsToCounter() {
    let loTreeBinding = oTreeTable.getBinding("rows");
    if (Array.isArray(loTreeBinding._aRowIndexMap) && loTreeBinding._aRowIndexMap.length) {
        let lvNumber = 0;
        for (let loRow of loTreeBinding._aRowIndexMap) {
            let loData = loRow.context.getObject();
            if (loData.objectType !== 'folder') {lvNumber++;}
        }
        oPageHeaderNumber.setNumber(`(${lvNumber})`);
    }
    else {
        oPageHeaderNumber.setNumber("(0)");
    }
}