// Re-apply all selections
oTableTypeAndKeySelector.removeSelections();
if (Array.isArray(this.CUST.data.objectKeyMany) && this.CUST.data.objectKeyMany.length) {
    for (let loItem of oTableTypeAndKeySelector.getItems()) {
        if (this.CUST.data.objectKeyMany.includes(loItem.getBindingContext("AppControl").getObject().key)) {
            loItem.setSelected(true);
        }
    }
}

// Re-apply the buttons' state
modelAppControl.getData().toggle.typeAndKey = {
    "group": false,
    "role": false,
    "user": false
}
if (Array.isArray(this.CUST.data.objectTypeMany) && this.CUST.data.objectTypeMany) {
    modelAppControl.getData().toggle.typeAndKey.group = this.CUST.data.objectTypeMany.includes(C_TYPE_GROUP);
    modelAppControl.getData().toggle.typeAndKey.role = this.CUST.data.objectTypeMany.includes(C_TYPE_ROLE);
    modelAppControl.getData().toggle.typeAndKey.user = this.CUST.data.objectTypeMany.includes(C_TYPE_USER);
}
modelAppControl.refresh();
