let loAuditData = $.extend(true, [], modelDataAuditLogResponse.getData().result.audit);
for (let loRecord of loAuditData) {
    try {
        loRecord.content = JSON.parse(loRecord.content);
    }
    catch(e) {}
}
let lvFileContent = JSON.stringify(loAuditData, null, '\t');
let loBlob = new Blob([lvFileContent], {type: 'application/json'});

let loTempLink = document.createElement("a");
loTempLink.setAttribute('href', URL.createObjectURL(loBlob));
loTempLink.setAttribute('download', `auditResult.json`);
loTempLink.click();

URL.revokeObjectURL(loTempLink.href);