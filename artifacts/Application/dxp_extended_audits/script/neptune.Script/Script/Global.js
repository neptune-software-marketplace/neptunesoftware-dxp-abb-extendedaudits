//
// Constants
const APPVIEW = (this instanceof sap.ui.core.mvc.View)
                    ? this
                    : {
                        sId: '',
                        getId: () => APPVIEW.sId,
                        createId: (pvId) => String(pvId)
                    }

const C_ACTION_ACTICITY = "Activity";
const C_ACTION_CREATE   = "Create";
const C_ACTION_DELETE   = "Delete";
const C_ACTION_SAVE     = "Save";

const C_TYPE_FOLDER = 'Folder';
const C_TYPE_GROUP  = 'Department';
const C_TYPE_ROLE   = 'Role';
const C_TYPE_USER   = 'User';

// Global variables
let goRelationsTexts = {};
let goMonacoEditor;

// console.log("Monaco:",monaco);