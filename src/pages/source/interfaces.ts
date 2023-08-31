interface Contract {
    id?: number,
    name: string,
    type: string,
    amount: number,
    plannedDate: string,
    actualDate: string,
    user?: User
}

interface Organization {
    id?: number,
    name: string,
    address: string,
    inn: string
}

interface User {
    id?: number,
    fullName: string,
    login: string,
    password?: string,
    terminationDate: string,
    newPassword?: string,
    isAdmin: boolean
}

interface Stage {
    id?: number,
    name: string,
    amount: number,
    plannedDate: string,
    actualDate: string,
    actualMaterialCosts: number,
    plannedMaterialCosts: number,
    actualSalaryExpenses: number,
    plannedSalaryExpenses: number
}

interface CounterContract {
    id?: number,
    name: string,
    type: string,
    amount: number,
    plannedDate: string,
    actualDate: string,
    organization: Organization
}

export {CounterContract, Contract, Organization, User, Stage}
