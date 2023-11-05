const C_TYPE_FOLDER = 'Folder';
const C_TYPE_GROUP = 'Department';
const C_TYPE_ROLE = 'Role';
const C_TYPE_USER = 'User';
function buildTreeTable( poArtifacts, poRelations, poTexts ) {
    modelDataPackageFltercrumbs.setData({relations:[]});
    if (!Array.isArray(poArtifacts)) {
        return []; //
    }
    let loRelations = {
        groupsAndRoles: (poRelations && poRelations.groupsAndRoles) ? poRelations.groupsAndRoles : {},
        groupsAndUsers: (poRelations && poRelations.groupsAndUsers) ? poRelations.groupsAndUsers : {},
        rolesAndUsers : (poRelations && poRelations.rolesAndUsers)  ? poRelations.rolesAndUsers  : {}
    };
    let loTexts = {
		group: (poTexts && poTexts.group) ? poTexts.group : 'Group',
		groups:(poTexts && poTexts.groups)? poTexts.groups: 'Groups',
		role:  (poTexts && poTexts.role)  ? poTexts.role  : 'Role',
		roles: (poTexts && poTexts.roles) ? poTexts.roles : 'Roles',
		user:  (poTexts && poTexts.user)  ? poTexts.user  : 'User',
		users: (poTexts && poTexts.users) ? poTexts.users : 'Users'
    }
    let loTableData = { children:[
        { "objectType": "folder", "objectKey": C_TYPE_GROUP, "name": loTexts.groups, children:[], filtercrumb: "0" },
        { "objectType": "folder", "objectKey": C_TYPE_ROLE , "name": loTexts.roles , children:[], filtercrumb: "1" },
        { "objectType": "folder", "objectKey": C_TYPE_USER , "name": loTexts.users , children:[], filtercrumb: "2" }
    ]};

    for (let loRoot of loTableData.children) {
        loRoot.children = $.extend(true, [], ModelData.Find(poArtifacts, "objectType", loRoot.objectKey));
        let lvCrumbIndex = 0;
        for (let loChild of loRoot.children) {
            loChild.parentKey = loRoot.objectKey
            loChild.root = loRoot.objectKey;
            loChild.filtercrumb = `${loRoot.filtercrumb}-${lvCrumbIndex++}`;
            loChild.children = buildNLevelChildren(loChild, poArtifacts, loRelations, loRoot.objectKey);
            if (loChild.package) {
                modelDataPackageFltercrumbs.getData().relations.push({
                    package: loChild.package,
                    filtercrumb: loChild.filtercrumb
                });
            }
        }
    }

    return loTableData;
}

function buildNLevelChildren(poNode, poArtifacts, poRelations, poRoot) {
    let loChildren = [];
    let lvCrumbIndex = 0;
    switch (poNode.objectType) {
        case C_TYPE_GROUP:
            if ([C_TYPE_USER,C_TYPE_GROUP].includes(poRoot)) {
                let loRelationsGroup = ModelData.Find(poRelations.groupsAndRoles, C_TYPE_GROUP, poNode.objectKey);
                for (let loRel of loRelationsGroup) {
                    let loChildFound = ModelData.FindFirst(poArtifacts, ["objectType", "objectKey"], [C_TYPE_ROLE, loRel[C_TYPE_ROLE]]);
                    if (typeof loChildFound === "object") {
                        loChildFound = $.extend(true, {}, loChildFound);
                        loChildFound.root=poRoot;
                        loChildFound.parentKey = poNode.objectKey;
                        loChildFound.filtercrumb = `${poNode.filtercrumb}-${lvCrumbIndex++}`;
                        loChildFound.children=[];
                        loChildren.push(loChildFound)
                        if (loChildFound.package) {
                            modelDataPackageFltercrumbs.getData().relations.push({
                                package: loChildFound.package,
                                filtercrumb: loChildFound.filtercrumb
                            });
                        }
                    }
                }
            }
            if ([C_TYPE_ROLE,C_TYPE_GROUP].includes(poRoot)) {
                let loRelationsGroup = ModelData.Find(poRelations.groupsAndUsers, C_TYPE_GROUP, poNode.objectKey);
                for (let loRel of loRelationsGroup) {
                    let loChildFound = ModelData.FindFirst(poArtifacts, ["objectType", "objectKey"], [C_TYPE_USER, loRel[C_TYPE_USER]]);
                    if (typeof loChildFound === "object") {
                        loChildFound = $.extend(true, {}, loChildFound);
                        loChildFound.root=poRoot;
                        loChildFound.parentKey = poNode.objectKey;
                        loChildFound.filtercrumb = `${poNode.filtercrumb}-${lvCrumbIndex++}`;
                        loChildFound.children=[];
                        loChildren.push(loChildFound)
                    }
                }
            }
            break;
        case C_TYPE_ROLE:
            if ([C_TYPE_ROLE].includes(poRoot)) {
                let loRelationsGroup = ModelData.Find(poRelations.groupsAndRoles, C_TYPE_ROLE, poNode.objectKey);
                for (let loRel of loRelationsGroup) {
                    let loChildFound = ModelData.FindFirst(poArtifacts, ["objectType", "objectKey"], [C_TYPE_GROUP, loRel[C_TYPE_GROUP]]);
                    if (typeof loChildFound === "object") {
                        loChildFound = $.extend(true, {}, loChildFound);
                        loChildFound.root=poRoot;
                        loChildFound.parentKey = poNode.objectKey;
                        loChildFound.filtercrumb = `${poNode.filtercrumb}-${lvCrumbIndex++}`;
                        loChildFound.children = buildNLevelChildren(loChildFound, poArtifacts, poRelations, poRoot)
                        loChildren.push(loChildFound)
                        if (loChildFound.package) {
                            modelDataPackageFltercrumbs.getData().relations.push({
                                package: loChildFound.package,
                                filtercrumb: loChildFound.filtercrumb
                            });
                        }
                    }
                }
            }
            if ([C_TYPE_ROLE].includes(poRoot)) {
                let loRelationsGroup = ModelData.Find(poRelations.rolesAndUsers, C_TYPE_ROLE, poNode.objectKey);
                for (let loRel of loRelationsGroup) {
                    let loChildFound = ModelData.FindFirst(poArtifacts, ["objectType", "objectKey"], [C_TYPE_USER, loRel[C_TYPE_USER]]);
                    if (typeof loChildFound === "object") {
                        loChildFound = $.extend(true, {}, loChildFound);
                        loChildFound.root=poRoot;
                        loChildFound.parentKey = poNode.objectKey;
                        loChildFound.filtercrumb = `${poNode.filtercrumb}-${lvCrumbIndex++}`;
                        loChildFound.children = [];
                        loChildren.push(loChildFound)
                    }
                }
            }
            break;
        case C_TYPE_USER:
            if ([C_TYPE_USER].includes(poRoot)) {
                let loRelationsGroup = ModelData.Find(poRelations.groupsAndUsers, C_TYPE_USER, poNode.objectKey);
                for (let loRel of loRelationsGroup) {
                    let loChildFound = ModelData.FindFirst(poArtifacts, ["objectType", "objectKey"], [C_TYPE_GROUP, loRel[C_TYPE_GROUP]]);
                    if (typeof loChildFound === "object") {
                        loChildFound = $.extend(true, {}, loChildFound);
                        loChildFound.root=poRoot;
                        loChildFound.parentKey = poNode.objectKey;
                        loChildFound.filtercrumb = `${poNode.filtercrumb}-${lvCrumbIndex++}`;
                        loChildFound.children = buildNLevelChildren(loChildFound, poArtifacts, poRelations, poRoot)
                        loChildren.push(loChildFound)
                        if (loChildFound.package) {
                            modelDataPackageFltercrumbs.getData().relations.push({
                                package: loChildFound.package,
                                filtercrumb: loChildFound.filtercrumb
                            });
                        }
                    }
                }
            }
            if ([C_TYPE_USER].includes(poRoot)) {
                let loRelationsGroup = ModelData.Find(poRelations.rolesAndUsers, C_TYPE_USER, poNode.objectKey);
                for (let loRel of loRelationsGroup) {
                    let loChildFound = ModelData.FindFirst(poArtifacts, ["objectType", "objectKey"], [C_TYPE_ROLE, loRel[C_TYPE_ROLE]]);
                    if (typeof loChildFound === "object") {
                        loChildFound = $.extend(true, {}, loChildFound);
                        loChildFound.root=poRoot;
                        loChildFound.parentKey = poNode.objectKey;
                        loChildFound.filtercrumb = `${poNode.filtercrumb}-${lvCrumbIndex++}`;
                        loChildFound.children = [];
                        loChildren.push(loChildFound)
                        if (loChildFound.package) {
                            modelDataPackageFltercrumbs.getData().relations.push({
                                package: loChildFound.package,
                                filtercrumb: loChildFound.filtercrumb
                            });
                        }
                    }
                }
            }
            break;
    }
    return loChildren;
} 