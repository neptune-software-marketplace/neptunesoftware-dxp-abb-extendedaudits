if (oEvent.getParameter("type") !== 'removed') { return; }
let loOldKeys = oEvent.getSource().getTokens().map(poToken => poToken.getKey());
let loDelKeys = oEvent.getParameter("removedTokens").map(poToken => poToken.getKey());
this.getBindingContext("DataSelectionScreen").getObject().objectKeyMany = loOldKeys.filter((poKey) => !loDelKeys.includes(poKey));
modelDataSelectionScreen.refresh();
