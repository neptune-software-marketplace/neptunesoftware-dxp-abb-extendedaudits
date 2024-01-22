//
PageDetailHistory.handleGetArtifactsAndRelations({
    success: false, 
    code: xhr.status, 
    message: (xhr?.responseJSON?.error) ? xhr.responseJSON.error : xhr.statusText
});