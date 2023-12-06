if (!goMonacoEditor) {
    When.promise(()=>{return ((oHtmlJsonDisplay.getDomRef() && 1) || 0)})
        .then(() => {
            // debugger;
            if (monaco) {
                goMonacoEditor = monaco.editor.create(oHtmlJsonDisplay.getDomRef(), {
                    scrollbar: {
                        vertical: "visible",
                        horizontal: "visible"
                    },
                    automaticLayout: true,
                    codeLens: true,
                    language: 'json',
                    lineNumbers: true,
                    readOnly: true
                });
                const loJsonCode = JSON.stringify(JSON.parse(oDiaJsonDisplay.CUST.data), null, '\t');
                goMonacoEditor.setValue(loJsonCode);
                // const loJsonCode = {a:10,b:{a:12}};
                // const loModelUri = monaco.Uri.parse("json://grid/settings.json");
                // const loJsonModel = monaco.editor.createModel(JSON.stringify(loJsonCode, null, '\t'), "json", loModelUri);
                // goMonacoEditor.setModel(loJsonModel);

            }
        });
}
else {
    const loJsonCode = JSON.stringify(JSON.parse(oDiaJsonDisplay.CUST.data), null, '\t');
    goMonacoEditor.setValue(loJsonCode);
}
