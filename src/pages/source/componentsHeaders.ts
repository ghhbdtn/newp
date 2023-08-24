const headers = {
    administrationHeaders: [
        {text: "Ответственный пользователь", sortable: false, value: "user.fullName", class: "with-divider", cellClass: 'with-divider'},
        {text: "Название", align: "start", sortable: false, value: "name", class: "with-divider", cellClass: 'with-divider'},
        { text: "Тип договора", align: "start", sortable: false, value: 'type', class: "with-divider", cellClass: 'with-divider'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plannedDate", class: "with-divider", cellClass: 'with-divider'},
        { text: "Фактические сроки", align: "start", sortable: false, value:  "actualDate", class: "with-divider", cellClass: 'with-divider'},
        { text: "Сумма (руб.)", align: "start", sortable: false, value: "amount", class: "with-divider", cellClass: 'with-divider'},
        { text: "Действия", value: "actions", sortable: false},
    ],
    contractsHeaders: [
        {text: "Название", align: "start", sortable: false, value: "name",  class: "with-divider", cellClass: 'with-divider'},
        { text: "Тип договора", align: "start", sortable: false, value: 'type', class: "with-divider", cellClass: 'with-divider'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plannedDate", class: "with-divider", cellClass: 'with-divider'},
        { text: "Фактические сроки", align: "start", sortable: false, value:  "actualDate", class: "with-divider", cellClass: 'with-divider'},
        { text: "Сумма (руб.)", align: "start", sortable: false, value: "amount", class: "with-divider", cellClass: 'with-divider'},
    ],
    userHeaders: [
        {text: "ФИО", align: "start", value: "fullName", class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Имя пользователя", align: "start", value: 'login', class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Дата прекращения действия", align: "start", value: "terminationDate", class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Администратор", align: "start", value: "isAdmin", class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Действия", align: "start", value: "actions", class: "with-divider", cellClass: 'with-divider', sortable: false},
    ],
}

export {headers}
