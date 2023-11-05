// Uses the tokenUpdate to set the packages before the tokenChange event
// This only happens if the user directly delete a token without using the value help
let loRemovedTokens = oEvent.getParameter("removedTokens");
let loPackages = [];
for (let loToken of oInputHeaderPackageFilter.getTokens()) {
    if (loRemovedTokens.includes(loToken)) {continue;}
    loPackages.push(loToken.getKey());
}
sap.n.storage.setWorkspacePackages(loPackages);