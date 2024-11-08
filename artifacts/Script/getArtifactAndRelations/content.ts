let loData = (req?.query) ? req?.query : {};

/* DEBUG * / 
// loData = { objectKey: '5206a9e9-8fd9-41f6-a45e-b5b2a582e535', objectType: 'Department' };
// loData = { objectKey: '3594aa7c-786c-4359-b81b-f4d57e6e55af', objectType: 'Role' };
// loData = { objectKey: 'cd42ee7a-2f6a-4cfc-860b-e62350d99f4f', objectType: 'User' };
/* */

if (!(loData?.objectType && loData.objectKey)) {
    result.statusCode = 404;
    result.data = { error: "Artifact not found!" };
    complete()
    return;
}

// Remove schema prefixes from table names for SQLite compatibility
loData._entity = (loData?.objectType === "Department") 
                    ? 'department'
                    : (loData?.objectType === "Role")
                        ? 'role'
                        : 'users';

const loRelations = (loData?.objectType === "Department")
                        ? { roles: true, users: true }
                        : (loData?.objectType === "Role")
                            ? { departments: true, users: true, acl: true }
                            : { departments: true, roles: true };

const loArtifact = await p9.manager.findOne(loData._entity, {
    where: { id: loData.objectKey },
    relations: loRelations
});

if (!loArtifact) {
    result.statusCode = 404;
    result.data = { error: "Artifact not found!" };
    complete()
    return;
}

result.data = {
    result: {
        detail: loArtifact
    }
};

complete();
