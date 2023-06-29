import {User} from "@/pages/source/interfaces";

function setFilters (filterValues: { user?: User; name: string; type: string; plannedStartDate: string; plannedEndDate: string; actualStartDate: string; actualEndDate: string; maxAmount: number; minAmount: number }): {}[]
    {
    const arr = [] as {}[];
    for(const filter in filterValues) {
        switch (filter) {
            case 'user':
                if (filterValues.user != null && filterValues.user.id != null && filterValues.user.id !== -1) {
                    const userFilter = {
                        key: 'USER',
                        targetEntity: "CONTRACT",
                        operator: "EQUAL",
                        value: filterValues.user.id
                    }
                    arr.push(userFilter)
                }
                break;
            case 'name':
                if (filterValues.name !== null && filterValues.name !== "") {
                    const nameFilter = {
                        key: 'NAME',
                        targetEntity: "CONTRACT",
                        operator: "LIKE",
                        value: filterValues.name
                    }
                    arr.push(nameFilter)
                }
                break;
            case 'type':
                if (filterValues.type != null && filterValues.type !== "") {
                    const typeFilter = {
                        key: 'TYPE',
                        targetEntity: "CONTRACT",
                        operator: "EQUAL",
                        value: filterValues.type
                    }
                    arr.push(typeFilter)
                }
                break;
            case 'plannedStartDate':
                if (filterValues.plannedStartDate != null && filterValues.plannedStartDate !== "") {
                    const plannedDateFilter = {
                        key: 'PLANNED_START_DATE',
                        targetEntity: "CONTRACT",
                        operator: "GREATER",
                        value: filterValues.plannedStartDate.split("-").reverse().join("-")
                    }
                    arr.push(plannedDateFilter)
                }
                break;
            case 'plannedEndDate':
                if (filterValues.plannedEndDate != null && filterValues.plannedEndDate !== "") {
                    const plannedDateFilter = {
                        key: 'PLANNED_END_DATE',
                        targetEntity: "CONTRACT",
                        operator: "LESS",
                        value: filterValues.plannedEndDate.split("-").reverse().join("-")
                    }
                    arr.push(plannedDateFilter)
                }
                break;
            case 'actualStartDate':
                if (filterValues.actualStartDate != null && filterValues.actualStartDate !== "") {
                    const actualDateFilter = {
                        key: 'ACTUAL_START_DATE',
                        targetEntity: "CONTRACT",
                        operator: "GREATER",
                        value: filterValues.actualStartDate.split("-").reverse().join("-")
                    }
                    arr.push(actualDateFilter)
                }
                break;
            case 'actualEndDate':
                if (filterValues.actualEndDate != null && filterValues.actualEndDate !== "") {
                    const actualDateFilter = {
                        key: 'ACTUAL_END_DATE',
                        targetEntity: "CONTRACT",
                        operator: "LESS",
                        value: filterValues.actualEndDate.split("-").reverse().join("-")
                    }
                    arr.push(actualDateFilter)
                }
                break;
            case 'maxAmount':
                if (filterValues.maxAmount != null && filterValues.maxAmount.toString() !== "" && filterValues.maxAmount !== 0) {
                    const amountFilter = {
                        key: 'AMOUNT',
                        targetEntity: "CONTRACT",
                        operator: "LESS",
                        value: filterValues.maxAmount + 1
                    }
                    arr.push(amountFilter)
                }
                break;
            case 'minAmount':
                if (filterValues.minAmount != null && filterValues.minAmount.toString() !== "" && filterValues.minAmount !== 0) {
                    const amountFilter = {
                        key: 'AMOUNT',
                        targetEntity: "CONTRACT",
                        operator: "GREATER",
                        value: filterValues.minAmount - 1
                    }
                    arr.push(amountFilter)
                }
                break;
        }
    }
    return arr;
}

function setOrganizationsFilters (filterValues: {name: string; address: string; inn: number }): {}[]
{
    const arr = [] as {}[];
    for (const filter in filterValues) {
        switch (filter) {
            case 'name':
                if (filterValues.name != null && filterValues.name !== "") {
                    const nameFilter = {
                        key: 'NAME',
                        targetEntity: "COUNTERPARTY_ORGANIZATION",
                        operator: "LIKE",
                        value: filterValues.name
                    }
                    arr.push(nameFilter)
                }
                break;
            case 'address':
                if (filterValues.address != null && filterValues.address !== "") {
                    const addressFilter = {
                        key: 'ADDRESS',
                        targetEntity: "COUNTERPARTY_ORGANIZATION",
                        operator: "LIKE",
                        value: filterValues.address
                    }
                    arr.push(addressFilter)
                }
                break;
            case 'inn':
                if (filterValues.inn != null && filterValues.inn != 0 && filterValues.inn.toString() !== "") {
                    const innFilter = {
                        key: 'INN',
                        targetEntity: "COUNTERPARTY_ORGANIZATION",
                        operator: "EQUAL",
                        value: filterValues.inn
                    }
                    arr.push(innFilter)
                }
                break;
        }
    }
    return arr;
}

function setUsersFilters (filterValues: {fullName: string; login: string}): {}[]
{
    const arr = [] as {}[];
    for (const filter in filterValues) {
        switch (filter) {
            case 'fullName':
                if (filterValues.fullName != null && filterValues.fullName !== "") {
                    const nameFilter = {
                        key: 'FULL_NAME',
                        targetEntity: "USER",
                        operator: "LIKE",
                        value: filterValues.fullName
                    }
                    arr.push(nameFilter)
                }
                break;
            case 'login':
                if (filterValues.login != null && filterValues.login !== "") {
                    const loginFilter = {
                        key: 'LOGIN',
                        targetEntity: "USER",
                        operator: "LIKE",
                        value: filterValues.login
                    }
                    arr.push(loginFilter)
                }
                break;
        }
    }
    return arr;
}

export {setFilters, setOrganizationsFilters, setUsersFilters};
