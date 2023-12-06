//
if ((oDiaTypeAndKeySelector.CUST.action === 'tokenUpdate') && oDiaTypeAndKeySelector.CUST.previousTypeMany) {
    //
    // Only resets the Type
    oDiaTypeAndKeySelector.CUST.data.objectTypeMany = oDiaTypeAndKeySelector.CUST.previousTypeMany;
    modelDataSelectionScreen.refresh();

}
delete (oDiaTypeAndKeySelector.CUST.previousTypeMany);
oDiaTypeAndKeySelector.close();

