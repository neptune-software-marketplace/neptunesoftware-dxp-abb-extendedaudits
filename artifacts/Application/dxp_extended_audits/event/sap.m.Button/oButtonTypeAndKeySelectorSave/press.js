// Resets the tables (NOTE: this is a row from DataSelectionScreen)
let loData = oDiaTypeAndKeySelector.CUST.data;
loData.objectTypeMany = [];
loData.objectKeyMany = [];
oSearchTypeAndKeySelectorFilter.setValue("");
oSearchTypeAndKeySelectorFilter.fireLiveChange({newValue:""});
// Applies the types
if (modelAppControl.getData().toggle.typeAndKey.group) { loData.objectTypeMany.push(C_TYPE_GROUP); }
if (modelAppControl.getData().toggle.typeAndKey.role) { loData.objectTypeMany.push(C_TYPE_ROLE); }
if (modelAppControl.getData().toggle.typeAndKey.user) { loData.objectTypeMany.push(C_TYPE_USER); }
let loTypesSelected = (loData.objectTypeMany.length) ? loData.objectTypeMany : [C_TYPE_GROUP, C_TYPE_ROLE, C_TYPE_USER];
// Applies the data keys
for (let loItem of oTableTypeAndKeySelector.getSelectedItems()) {
    let loModelData = loItem.getBindingContext("AppControl").getObject();
    if (loTypesSelected.includes(loModelData?.type) || ["New"].includes(loModelData.key)) {
        loData.objectKeyMany.push(loModelData.key);
    }
}
// Refreshes the selection screen
modelDataSelectionScreen.refresh();

oDiaTypeAndKeySelector.close();