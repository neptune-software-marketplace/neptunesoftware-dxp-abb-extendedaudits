const ArtifactPropagation = {};
(function() {
    // Private data
    const ArtifactPropagationSubscriptions = new Map();
    // Methods
    $.extend( true, ArtifactPropagation, {
        signal: function(poData) {
            // console.debug("signalled:", poData);
            const loKeys = Array.from(ArtifactPropagationSubscriptions.keys());
            for (let lvKey of loKeys) {
                //
                // Executes the event handler
                ArtifactPropagationSubscriptions.get(lvKey)( poData );
            }
        },
        subscribe: function( pvPageId, pfOnSelectArtifact ) {
            ArtifactPropagationSubscriptions.set(pvPageId, pfOnSelectArtifact);
        }
    })
})()