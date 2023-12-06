//
// Even if an error occurred, attempts to acquire the existing object
// console.log('@getAuditLogHistory-error:', xhr.status);
goArtifactHistoryAuditResponse = [];
goArtifactHistoryObjectResponse = {};
let options = {
    parameters: {
        "objectKey": goArtifactHistoryRequest.objectKey, // Required 
        "objectType": goArtifactHistoryRequest.objectType // Required 
    }
};

apigetArtifactAndRelations(options);
