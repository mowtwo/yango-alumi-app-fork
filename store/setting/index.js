export default {
    namespaced: true,
    state: {
        setting: [],
        url: 'https://apis.huashuedu.cn/nest/api/setting'
    },
    mutations: {
        push(state, payload) {
            // console.log(payload)
            const { key, value, name } = payload
            state.setting.push({
                key, value,
                name: name ? name : key
            })
        },
        update(state, payload) {
            const { key, value, name } = payload
            const keys = state.setting.map(({ key }) => key)
            const index = keys.indexOf(key)
            if (index >= 0) {
                state.setting[index] = {
                    key,
                    value,
                    name
                }
            } else {
                state.setting.push({
                    key, value,
                    name: name ? name : key
                })
            }
        }
    }
}