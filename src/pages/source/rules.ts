const rules = {
    required: (value: String|Number) => !!value || "Обязательное поле",
    minLength: (value: String) =>
        value.length >= 6 || "Минимальная длина логина - 6",
    number: (v: string) => !v ||/^\d+$/.test(v) || 'Должно быть числом',
    planData: (v: string) => /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] (0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/.test(v)
        || "Формат: ДД.ММ.ГГГГ - ДД.ММ.ГГГГ",
    factData: (v: string) => !v || "" || /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] (0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/.test(v)
        || /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] $/.test(v) ||
        "Формат: 'ДД.ММ.ГГГГ - ДД.ММ.ГГГГ', или 'ДД.ММ.ГГГГ - ', или пустое поле",
    password: (v: string) => !v || /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(v) ||
        "Пароль должен быть не менее 6 символов, включать хотя бы одну прописную букву, цифру и хотя бы один специальный символ (!,#,$,%,&,?)",
    date: (v: string) => !v || /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/.test(v)
        || "Формат: ДД.ММ.ГГГГ",
    inn: (v: string) => !v ||/^\d{10}$/.test(v) || 'Длина ИНН должна равняться 10 цифрам',
    requiredOrganization: (value: any) => !!value && value.id !== -1 ||"Обязательное поле"
}

export {rules}
