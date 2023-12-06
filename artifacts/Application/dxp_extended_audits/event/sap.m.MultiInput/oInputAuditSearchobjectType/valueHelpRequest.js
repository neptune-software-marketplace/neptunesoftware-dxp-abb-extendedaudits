const loContext = oEvent.getSource().getBindingContext("DataSelectionScreen");
const loObject = loContext.getObject();
//
// Resets warning message.
modelAppControl.getData().messageStrip.typeAndKey.visible = false;
modelAppControl.refresh();
//
// Opens the dialog
oDiaTypeAndKeySelector.CUST = { data: loObject, action: 'valueHelpRequest', source: 'Type' };
oDiaTypeAndKeySelector.open();