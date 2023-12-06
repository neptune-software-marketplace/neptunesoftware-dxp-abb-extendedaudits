//
console.error(...Array.from(arguments));
let loData = (typeof this.data === "object") 
                ? loData
                : (typeof this.data === "string")
                    ? JSON.parse(this.data)
                    : this.data;
if (loData && loData.sourceKey) {
    //
    // Cleans up the orphan cross-ref markup in the text
    ArtifactHistoryCrossReference.applyData(loData.sourceKey, []);
} 
setBusy( false, oTabDetailPages );