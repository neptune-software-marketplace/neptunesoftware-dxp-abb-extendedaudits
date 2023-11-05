let loFrom = oEvent.getParameter("from");
let loTo = oEvent.getParameter("to");

let loContext = oEvent.getSource().getBindingContext("DataSelectionScreen");
let loData = loContext.getObject();
if (loFrom) {
    loData.beginDate = `${loFrom.getFullYear()}-${`0${loFrom.getMonth()+1}`.slice(-2)}-${`0${loFrom.getDate()}`.slice(-2)}`;
}
else {
    delete(loData.beginDate);
}
if (loTo) {
    loData.endDate = `${loTo.getFullYear()}-${`0${loTo.getMonth()+1}`.slice(-2)}-${`0${loTo.getDate()}`.slice(-2)}`;
}
else {
    delete(loData.endDate);
}