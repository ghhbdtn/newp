import {Store} from 'vuex';

export const plug = (store: Store<any>) => {
    // подписываемся на мутации Vuex store
    store.subscribe((mutation, state) => {
        // сохраняем состояние Vuex store в браузерное хранилище
        localStorage.setItem('vuex-state', JSON.stringify(state));
    });

    // восстанавливаем состояние Vuex store из браузерного хранилища
    const storedState = localStorage.getItem('vuex-state');
    if (storedState) {
        const state = JSON.parse(storedState);
        store.replaceState(state);
    }
};





