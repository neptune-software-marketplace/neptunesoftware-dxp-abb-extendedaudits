//
goArtifactHistoryObjectResponse = {};
pageDetailHistoryRefresh();
// console.log('@getArtifactsAndRelation-error:', xhr.status);
// console.log("Artifact audit history response:", goArtifactHistoryAuditResponse);
// console.log("Artifact object response:", goArtifactHistoryObjectResponse);
setBusy( false, oPageDetailHistory );
window.CUST = {goArtifactHistoryRequest, goArtifactHistoryAuditResponse, goArtifactHistoryObjectResponse};
