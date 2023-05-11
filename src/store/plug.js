export const plug = store => {
    // подписываемся на мутации Vuex store
        // подписываемся на мутации Vuex store
        store.subscribe((mutation, state) => {
            // сохраняем состояние Vuex store в браузерное хранилище
            localStorage.setItem('vuex-state', JSON.stringify(state))
        })

        // восстанавливаем состояние Vuex store из браузерного хранилища
        const state = JSON.parse(localStorage.getItem('vuex-state'))
        if (state) {
            store.replaceState(state)
        }
    }



