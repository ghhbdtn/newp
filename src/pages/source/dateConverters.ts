function stringToDate(plannedDate: string, actualDate: string|null) :{
    plannedStartDate: string,
    plannedEndDate: string,
    actualStartDate: string,
    actualEndDate: string}{

    const planDate = plannedDate.split("-");
    const factDate = actualDate == null ? "" : actualDate.split("-");
    const plannedStartDate = planDate[0].replace(" ", "");
    const plannedEndDate = planDate[1].replace(" ", "");
    const actualStartDate = factDate[0] == null ? "" : factDate[0].replace(" ", "");
    const actualEndDate = factDate[1] == null ? "" : factDate[1].replace(" ", "");

    return {plannedStartDate: plannedStartDate,
        plannedEndDate: plannedEndDate,
        actualStartDate: actualStartDate,
        actualEndDate: actualEndDate}
}

function dateToString(plannedStartDate: string, plannedEndDate: string, actualStartDate: string, actualEndDate: string)
    :{plannedDate: string, actualDate: string}{
    const plannedDate = plannedStartDate + ' - ' + plannedEndDate;
    const actualDate = (actualStartDate == null ? "" : actualStartDate) + ' - ' +
        (actualEndDate == null ? "" : actualEndDate);
    return {plannedDate: plannedDate, actualDate: actualDate}
}
export {stringToDate, dateToString}
