const goManager = p9.manager;
const C_ALL = { where: {} };

const goAllGroups = await goManager.query(
    `SELECT 'Department' as "objectType", id as "objectKey",
            name, description, package, 
            (null) as locked, (null) as active,
            "createdAt", "createdBy", "updatedAt", "changedBy"
        FROM department`
);

const goAllRoles = await goManager.query(
    `SELECT 'Role' as "objectType", id as "objectKey",
            name, description, package, 
            (null) as locked, (null) as active,
            "createdAt", "createdBy", "updatedAt", "changedBy"
        FROM role`
);

const goAllUsers = await goManager.query(
    `SELECT 'User' as "objectType", id as "objectKey",
            username as name, name as description, (null) as package,
            locked, begins, ends, (null) as active,
            "createdAt", "createdBy", "updatedAt", "changedBy"
        FROM users`
);

const goAllUsersXRoles = await goManager.query(
    `SELECT role_users as "Role", users_roles as "User" FROM role_users__users_roles`
);

const goAllUsersXGroups = await goManager.query(
    `SELECT department_users as "Department", users_departments as "User"
       FROM department_users__users_departments`
);

const goAllRolesXGroups = await goManager.query(
    `SELECT department_roles as "Department", role_departments as "Role" FROM department_roles__role_departments`
);

//
// Calculates the begin and end date to determine if active or not
let goToday = new Date( new Date().toISOString().slice(0,10) );
for (let loRow of goAllUsers) {
    let loBeginDate = (loRow.begins)
                        ? loRow.begins
                        : new Date('1900-01-01');
    let loEndDate = (loRow.ends)
                        ? loRow.ends
                        : new Date('9999-12-31');
    loRow.active = ((loBeginDate.getTime() <= goToday.getTime()) && 
                    (goToday.getTime() <= loEndDate.getTime()))
                        ? true
                        : false;
}

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

complete();
