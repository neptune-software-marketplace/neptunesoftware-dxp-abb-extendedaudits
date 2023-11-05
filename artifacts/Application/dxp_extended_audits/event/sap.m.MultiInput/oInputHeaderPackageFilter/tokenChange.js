//
console.log("token change");
When.promise(()=>(Array.isArray(modelAppControl.getData()?.filter?.package) ? 1: 0)).then(() => {
    modelAppControl.getData().filter.package = sap.n.storage.getWorkspacePackages();
    modelAppControl.refresh();
    applyFilterToTree();
});