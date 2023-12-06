const setBusyQueue = {}; 
function setBusy( pvState, poObject, pvDelay ) {
    const C_GLOBAL = '_';
    let lvObjName = (poObject instanceof sap.ui.core.Control) ? poObject.getId() : C_GLOBAL;
    if (!setBusyQueue[lvObjName]) {setBusyQueue[lvObjName] = 0;}
    let lvDelay = (isNaN(Number.parseInt(pvDelay)) || (pvDelay < 0)) ? 0 : Number.parseInt(pvDelay);
    let lvState = !!(pvState);
    if (poObject instanceof sap.ui.core.Control) {
        // act?
        if (
            (pvState && !setBusyQueue[lvObjName]) /* ...... setBusy=true AND first enqueue */
            ||
            ((!pvState) && (setBusyQueue[lvObjName]<=1)) /* setBusy=false AND last dequeue */
        ) {
            poObject.setBusyIndicatorDelay( lvDelay );
            poObject.setBusy( lvState );
        }
    }
    else if ( lvState ) {
        if (!setBusyQueue[lvObjName]) { /* setBusy=true AND first enqueue */
            sap.ui.core.BusyIndicator.show( lvDelay );
        }
    }
    else {
        if (setBusyQueue[lvObjName]<=1) { /* setBusy=false AND last enqueue */
            sap.ui.core.BusyIndicator.hide(); 
        }
    }
    // progress enqueue/dequeue
    setBusyQueue[lvObjName] = (lvState) ? setBusyQueue[lvObjName]+1 : setBusyQueue[lvObjName]-1;
}