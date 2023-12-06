if (oEvent.getParameter("type") !== 'removed') { return; }
let loOldTypes = oEvent.getSource().getTokens().map(poToken => poToken.getKey());
let loDelTypes = oEvent.getParameter("removedTokens").map(poToken => poToken.getKey()); // always 1 token deleted

this.getBindingContext("DataSelectionScreen").getObject().objectTypeMany = loOldTypes.filter((poKey) => !loDelTypes.includes(poKey));
modelDataSelectionScreen.refresh();

let loObject = this.getBindingContext("DataSelectionScreen").getObject();
let loInvalidKeys = loObject.objectKeyMany.filter( poKey => 
    ModelData.FindFirst(modelAppControl.getData().keys, ["key", "type"], [poKey, loDelTypes[0]]) );
if (loInvalidKeys) {
    //
    // Opens the dialog
    oDiaTypeAndKeySelector.CUST = { data: loObject, action: 'tokenUpdate', source: 'Type', previousTypeMany: loOldTypes };
    oDiaTypeAndKeySelector.open();
}
