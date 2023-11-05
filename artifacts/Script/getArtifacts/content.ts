const goManager = p9.manager;
const C_ALL = { where: {} };

const goAllGroups = await goManager.query(
    `SELECT 'Department' as "objectType", id as "objectKey",
            name, description, package, 
            (null) as locked, (null) as active,
            "createdAt", "createdBy", "updatedAt", "changedBy"
        FROM department`);
const goAllRoles = await goManager.query(
    `SELECT 'Role' as "objectType", id as "objectKey",
            name, description, package, 
            (null) as locked, (null) as active,
            "createdAt", "createdBy", "updatedAt", "changedBy"
        FROM role`);
// const goAllUsers = await goManager.find('users', C_ALL);
const goAllUsers = await goManager.query(
    `SELECT 'User' as "objectType", id as "objectKey",
            username as name, name as description, (null) as package,
            locked,array_to_string(ARRAY['BD:'||begins, 'ED:'||ends], ';') as active,
            "createdAt", "createdBy", "updatedAt", "changedBy"
        FROM users`);
const goAllUsersXRoles = await goManager.query(
    `SELECT role_users as "Role", users_roles as "User" FROM role_users__users_roles`);
const goAllUsersXGroups = await goManager.query(
    `SELECT department_users as "Department", users_departments as "User"
       FROM department_users__users_departments`);
const goAllRolesXGroups = await goManager.query(
    `SELECT department_roles as "Department", role_departments as "Role" FROM department_roles__role_departments`);

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
let goToday = new Date( new Date().toISOString().slice(0,10) );
for (let lvRow of goAllUsers) {
    if ((typeof lvRow.active !== "string") || (lvRow.active.trim() === '')) {
        lvRow.active = true;
        continue;
    }
    const lcRegExBegin = /BD:(.*?)(;|$)/;
    const lcRegExEnd = /ED:(.*?)(;|$)/;
    let loBeginDate = (lvRow.active.match(lcRegExBegin))
                        ? new Date(lvRow.active.match(lcRegExBegin)[0].slice(3,13))
                        : new Date('1900-01-01');
    let loEndDate = (lvRow.active.match(lcRegExEnd))
                        ? new Date(lvRow.active.match(lcRegExEnd)[0].slice(3,13))
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

complete( );