function compareObjects(poOldObject, poNewObject) {
  const added = {};
  const deleted = {};
  const modified = {};

  function compareProperties(poOldObject, poNewObject, pvPath = '') {
    for (const lvKey in poNewObject) {
      const lvNewPath = pvPath ? `${pvPath}/${lvKey}` : `/${lvKey}`;

      if (Array.isArray(poNewObject[lvKey]) && Array.isArray(poOldObject[lvKey])) {
        let lvCounter = 0;
        for (let loNewChild of poNewObject[lvKey]) {
          let lvCounterPath = `${lvNewPath}/${lvCounter}`;
          let lvFoundIndex = -1;
          for (let lvOldIndex in poOldObject[lvKey]) {
            if (loNewChild.id === poOldObject[lvKey][lvOldIndex].id) {
              lvFoundIndex = lvOldIndex;
              break;
            }
          } // for::lvOldIndex
          if (lvFoundIndex < 0) {
            added[lvCounterPath] = loNewChild;
          } else {
            modified[lvCounterPath] = compareObjects(poOldObject[lvKey][lvFoundIndex], loNewChild);
            // modified[lvCounterPath] = compareProperties(poOldObject[lvKey][lvFoundIndex], loNewChild, lvCounterPath);
          }
          lvCounter++;
        } // for::loNewChild
      } else if (!poOldObject.hasOwnProperty(lvKey)) {
        added[lvNewPath] = poNewObject[lvKey];
      } else if (typeof poOldObject[lvKey] !== typeof poNewObject[lvKey]) {
        modified[lvNewPath] = {
          from: poOldObject[lvKey],
          to: poNewObject[lvKey]
        };
      } else if (typeof poNewObject[lvKey] === 'object' && poNewObject[lvKey] !== null) {
        compareProperties(poOldObject[lvKey], poNewObject[lvKey], lvNewPath);
      } else if (poOldObject[lvKey] !== poNewObject[lvKey]) {
        modified[lvNewPath] = {
          from: poOldObject[lvKey],
          to: poNewObject[lvKey]
        };
      }
    }

    for (const lvKey in poOldObject) {
      const lvNewPath = pvPath ? `${pvPath}/${lvKey}` : `/${lvKey}`;

      if (Array.isArray(poOldObject[lvKey]) && Array.isArray(poNewObject[lvKey])) {
        lvCounter = 0;
        for (let loOldChild of poOldObject[lvKey]) {
          let lvCounterPath = `${lvNewPath}/${lvCounter}`;
          let lvFoundId = false;
          for (let loNewChild of poNewObject[lvKey]) {
            if (loOldChild.id === loNewChild.id) {
              lvFoundId = true;
              break;
            }
          } // for::loNewChild
          if (!lvFoundId) {
            deleted[lvCounterPath] = loOldChild;
          }
          lvCounter++;
        } // for::loOldChild
      } else if (!poNewObject.hasOwnProperty(lvKey)) {
        deleted[lvNewPath] = poOldObject[lvKey];
      }
    }
  }

  compareProperties(poOldObject, poNewObject);

  return {
    added,
    deleted,
    modified
  };
}