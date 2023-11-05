var goManager = p9.manager;
var C_ALL = { where: {} };
var goAllGroups = await goManager.query("SELECT 'Department' as \"objectType\", id as \"objectKey\",\n            name, description, package, \n            (null) as locked, (null) as active,\n            \"createdAt\", \"createdBy\", \"updatedAt\", \"changedBy\"\n        FROM department");
var goAllRoles = await goManager.query("SELECT 'Role' as \"objectType\", id as \"objectKey\",\n            name, description, package, \n            (null) as locked, (null) as active,\n            \"createdAt\", \"createdBy\", \"updatedAt\", \"changedBy\"\n        FROM role");
// const goAllUsers = await goManager.find('users', C_ALL);
var goAllUsers = await goManager.query("SELECT 'User' as \"objectType\", id as \"objectKey\",\n            username as name, name as description, (null) as package,\n            locked,array_to_string(ARRAY['BD:'||begins, 'ED:'||ends], ';') as active,\n            \"createdAt\", \"createdBy\", \"updatedAt\", \"changedBy\"\n        FROM users");
var goAllUsersXRoles = await goManager.query("SELECT role_users as \"Role\", users_roles as \"User\" FROM role_users__users_roles");
var goAllUsersXGroups = await goManager.query("SELECT department_users as \"Department\", users_departments as \"User\"\n       FROM department_users__users_departments");
var goAllRolesXGroups = await goManager.query("SELECT department_roles as \"Department\", role_departments as \"Role\" FROM department_roles__role_departments");
/*
console.log('Total groups:', (goAllGroups) ? goAllGroups.length : 0);
console.log('Total roles:', (goAllRoles) ? goAllRoles.length : 0);
console.log('Total users:', (goAllUsers) ? goAllUsers.length : 0);


console.log('Total users x roles:', (goAllUsersXRoles) ? goAllUsersXRoles.length : 0);
console.log('Total users x groups:', (goAllUsersXGroups) ? goAllUsersXGroups.length : 0);
console.log('Total roles x groups:', (goAllRolesXGroups) ? goAllRolesXGroups.length : 0);
*/
//
// Calculates the begin and end date to determine if active or not
var goToday = new Date(new Date().toISOString().slice(0, 10));
for (var _i = 0, goAllUsers_1 = goAllUsers; _i < goAllUsers_1.length; _i++) {
    var lvRow = goAllUsers_1[_i];
    if ((typeof lvRow.active !== "string") || (lvRow.active.trim() === '')) {
        lvRow.active = true;
        continue;
    }
    var lcRegExBegin = /BD:(.*?)(;|$)/;
    var lcRegExEnd = /ED:(.*?)(;|$)/;
    var loBeginDate = (lvRow.active.match(lcRegExBegin))
        ? new Date(lvRow.active.match(lcRegExBegin)[0].slice(3, 13))
        : new Date('1900-01-01');
    var loEndDate = (lvRow.active.match(lcRegExEnd))
        ? new Date(lvRow.active.match(lcRegExEnd)[0].slice(3, 13))
        : new Date('9999-12-31');
    lvRow.active = ((loBeginDate.getTime() <= goToday.getTime()) &&
        (goToday.getTime() <= loEndDate.getTime()))
        ? true
        : false;
}
/*
console.log('users x roles:', (goAllUsersXRoles));
console.log('users x groups:', (goAllUsersXGroups));
console.log('roles x groups:', (goAllRolesXGroups));
*/
result.data = {
    result: {
        artifacts: goAllGroups.concat(goAllRoles).concat(goAllUsers),
        relations: {
            groupsAndRoles: goAllRolesXGroups,
            groupsAndUsers: goAllUsersXGroups,
            rolesAndUsers: goAllUsersXRoles
        }
    }
};
/*
log.debug("v20231010.1");
log.debug( result.data );
*/
/*
console.log(result.data.result);
console.log(result.data.result.relations);
*/
complete();
