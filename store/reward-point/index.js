export default {
    namespaced: true,
    state: {
        point: 0,
        signed: false
    },
    mutations: {
        update(state, payload) {
            state.point = payload.point
        },
        signIt(state) {
            if (!state.signed) {
                state.signed = true;
            }
        }
    }
}