//
// Constants
const APPVIEW = (this instanceof sap.ui.core.mvc.View)
                    ? this
                    : {
                        sId: '',
                        getId: () => APPVIEW.sId,
                        createId: (pvId) => String(pvId)
                    }
// Global variables
let goRelationsTexts = {};
let goMonacoEditor;

// console.log("Monaco:",monaco);