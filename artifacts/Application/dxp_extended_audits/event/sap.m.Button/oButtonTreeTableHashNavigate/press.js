async function toExternal() {
    let context = oEvent.oSource.getBindingContext("DataArtifactsInTree");
    let data = context.getObject();

    const toExternal = {
        target: {
            semanticObject: "",
            action: "",
        },
        params: {
            id: data.objectKey,
            name: data.name,
        },
        query: {},
    };

    switch (data.objectType) {
        // case "Adaptive Framework":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "adaptivedesigner";
        //     break;

        // case "App":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "appdesigner";
        //     break;

        // case "Documentation":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "documentation";
        //     break;

        // case "Email Templates":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "emailtemplate";
        //     break;

        // case "API":
        //     toExternal.target.semanticObject = "connectivity";
        //     toExternal.target.action = "apidesigner";
        //     break;

        // case "Connectivity Group":
        //     toExternal.target.semanticObject = "connectivity";
        //     toExternal.target.action = "apigroup";
        //     break;

        // case "Certificates":
        //     toExternal.target.semanticObject = "connectivity";
        //     toExternal.target.action = "certificates";
        //     break;

        // case "Proxy Authentication":
        //     toExternal.target.semanticObject = "connectivity";
        //     toExternal.target.action = "apiauthentication";
        //     break;

        // case "Remote Systems":
        //     toExternal.target.semanticObject = "settings";
        //     toExternal.target.action = "systems";
        //     break;

        case C_TYPE_ROLE:
            toExternal.target.semanticObject = "security";
            toExternal.target.action = "role";
            break;

        // case "oData Source":
        //     toExternal.target.semanticObject = "connectivity";
        //     toExternal.target.action = "odatasource";
        //     break;

        // case "oData Mock Data":
        //     toExternal.target.semanticObject = "connectivity";
        //     toExternal.target.action = "odatamockdata";
        //     break;

        // case "Launchpad":
        //     toExternal.target.semanticObject = "run";
        //     toExternal.target.action = "launchpad";
        //     break;

        // case "Table":
        //     toExternal.target.semanticObject = "tools";
        //     toExternal.target.action = "tabledefinition";
        //     break;

        // case "Tile":
        //     toExternal.target.semanticObject = "run";
        //     toExternal.target.action = "tile";
        //     break;

        // case "Tile Group":
        //     toExternal.target.semanticObject = "run";
        //     toExternal.target.action = "group";
        //     break;

        // case "Rules Engine":
        //     toExternal.target.semanticObject = "tools";
        //     toExternal.target.action = "rulesengine";
        //     break;

        // case "Script Group":
        //     toExternal.target.semanticObject = "tools";
        //     toExternal.target.action = "scripteditor";
        //     break;

        // case "Script Class":
        //     toExternal.target.semanticObject = "tools";
        //     toExternal.target.action = "scripteditor";

        //     const script = await getScript(toExternal.params.id);
        //     toExternal.params.id = script.jsscriptGroup;
        //     toExternal.params.scriptid = script.id;
        //     break;

        // case "Theme":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "themedesigner";
        //     break;

        case C_TYPE_GROUP:
            toExternal.target.semanticObject = "security";
            toExternal.target.action = "department";
            break;

        case C_TYPE_USER:
            toExternal.target.semanticObject = "security";
            toExternal.target.action = "user";
            break;

        // case "Workflow Definition":
        //     toExternal.target.semanticObject = "workflow";
        //     toExternal.target.action = "definition";
        //     break;

        // case "Job":
        //     toExternal.target.semanticObject = "tools";
        //     toExternal.target.action = "scheduler";
        //     break;

        // case "PDF Designer":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "pdfdesigner";
        //     toExternal.params.name = data.application;
        //     break;

        // case "Connector":
        //     toExternal.target.semanticObject = "connectivity";
        //     toExternal.target.action = "connector";
        //     break;

        // case "Events":
        //     toExternal.target.semanticObject = "tools";
        //     toExternal.target.action = "events";
        //     break;

        // case "Media Library":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "media";
        //     break;

        // case "Code Snippets":
        //     toExternal.target.semanticObject = "development";
        //     toExternal.target.action = "jshelpers";
        //     break;

        // case "Approvers":
        //     toExternal.target.semanticObject = "workflow";
        //     toExternal.target.action = "approvers";
        //     break;

        // case "Task Action":
        //     toExternal.target.semanticObject = "workflow";
        //     toExternal.target.action = "taskaction";
        //     break;
    }

    if (toExternal.target.semanticObject && toExternal.target.action) {
        sap.n.HashNavigation.toExternal(toExternal);
    }
}
toExternal();