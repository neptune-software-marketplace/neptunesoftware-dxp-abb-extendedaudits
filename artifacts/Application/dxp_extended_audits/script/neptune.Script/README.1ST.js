/*
    SECTIONS:
        setBusy
        APIs
        oTreeData
        User status 

    setBusy
        Custom function in script 'Functions'
        Parameters:
            state: mandatory; true/false
            object: optional; whole screen if omited; or must be instanceof sap.ui.core.Control otherwise
            delay: optional; 0 is not specified or negative
        Enqueue/Dequeue
            Applied automatically
            It will enqueue the busy state for an object if state === true
            It will dequeue for same object otherwise
            First enqueue starts the busy state
            Last dequeue stops the busy state

    APIs
        GetArtifacts
            NOTE: all artifacts' and relations' fields where normalized for optimal usage. 
                  some fields are applicable everywhere (e.g.: 'name'), while others only on certain object types (e.g.: 'locked' to 'user')
            Response: { result: { artifacts: [], relations: {...} } }
                artifacts[]: { objectKey, objectType, name, description, ... }
                relations{}: { groupsAndRoles:[], groupsAndUsers:[], rolesAndUsers:[] }
                    groupsAndRoles[]: { group, role }
                    groupsAndUsers[]: { group, user }
                    rolesAndUsers[]: { role, user }
            objectType:
                'group'
                'role'
                'user'
            Mappings:
                WHEN artifacts[...].objectType EQ 'group'
                    artifacts[...].objectKey matches groupsAndRoles[...].group
                                                     groupsAndUsers[...].group
                WHEN artifacts[...].objectType EQ 'role'
                    artifacts[...].objectKey matches groupsAndRoles[...].role
                                                     rolesAndUsers[...].role
                WHEN artifacts[...].objectType EQ 'user'
                    artifacts[...].objectKey matches groupsAndUsers[...].user
                                                     rolesAndUsers[...].user
    oTreeData
        Children node is "children"
        Hard start of { children:[ 
                            { objectKey:'group', objectType: 'folder', ...},
                            { objectKey:'role', objectType: 'folder', ...},
                            { objectKey:'user', objectType: 'folder', ...} ]}
        'folder' is a hardcoded value and is self-explanatory
        All relevant level-1 nodes are generated from the artifacts with the following logic:
            artifact.objectType 'EQ' root.objectKey
        Level-1 children are generated based on the following rules:
            Child of node, must be in relation with node (see relations from APIs)
        Possible parent-child match-up is:
            [ GROUP folder ]
                group
                    role
                    user
            [ ROLE folder ]
                role
                    group
                        user
                    user
            [ USER folder ]
                user
                    group
                        role
                    role

    User status
        All users make use of the fields 'active' and 'locked'
        On the table, the following outputs are possible:
            '' ............... : not applicable (e.g.: group)
            'Active'           : The user is active and NOT locked
            'Inactive'         : The user is outside of a valid period
            'Locked'           : The user is active AND locked
            'Locked;Inactive'  : The user is inactive AND locked
*/