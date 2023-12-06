/*
    SECTIONS:
        setBusy
        APIs
        oTreeData
        User status 
        ArtifactPropagation

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

    ArtifactPropagation
        SEE: resource folder "ArtifactPropagationEventHandlers"
        
        When selecting an artifact, it is possible to open on the right side a history page, where the history of the changes to that
        artifact can be seen.

        The intention is to enhance this tool with more functionalities for information/interaction with artifacts in the future, 
        therefore the idea of tabbed pages was created. A future functionality will occupy its own tab in the right side.

        But as each new functionility is created, more than one set of data will be necessary, and all pages need to be notified
        when a new artifact is selected.

        The ArtifactPropagation, will send that information to all the pages that subscribe to it.

        Every page needs to execute ArtifactPropagation.subscribe( pvPageId, pfOnSelectArtifact ):
            Parameters:
                pvPageId: id (string) of the page subscribing
                pfOnSelectArtifact: handler (function) for the event on the page subscribing
                    On this event function the "poData" parameter is passed with the basic artifact information 
                    (the same from the row in the Tree Table).
            NOTE: repeating a subscription for the same pageId, will overwrite the handler function

            Inside handler, the page is responsible to use poData to refresh its contents

            use setBusy( true/false, page ) to individually give a busy state information without locking the other pages.
                REMEMBER: setBusy uses a enqueue/dequeue system, so make sure to setBusy:false for each setBusy:true done on 
                          the same object.
        
*/