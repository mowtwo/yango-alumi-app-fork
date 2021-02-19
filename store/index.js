import Vue from 'vue'
import Vuex from 'vuex'
import RewardPoint from './reward-point'
import Setting from './setting'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {},
		updateToken: false,
		attentions: [],
		likes: [],
		watchs: [],
		moments: [],
		momentPage: 0,
		subMomentIndex: -1,
		shoulInitMomentPage: false,
		globalSetting: {}
	},
	mutations: {
		setGlobalSetting(state, payload) {
			state.globalSetting = payload.globalSetting
		},
		setCanUseAnonymous(state, payload) {
			state.globalSetting.can_use_anonymous = payload.anonymous
		},
		initMomentPage(state, payload) {
			state.attentions = []
			state.likes = []
			state.watchs = []
			state.moments = []
			state.momentPage = 0
			state.subMomentIndex = -1
		},
		setShouldInitMomentPage(state, payload) {
			state.shoulInitMomentPage = payload.shoulInitMomentPage
		},
		setUserInfo(state, payload) {
			if (payload.userInfo && typeof payload.userInfo === 'object') {
				if (payload.userInfo.identity_verify_at && typeof payload.userInfo.identity_verify_at === 'string') {
					payload.userInfo.identity_verify_at = payload.userInfo.identity_verify_at.replace(/-/g, '/')
				}
			}
			state.userInfo = payload.userInfo;
		},
		setUpdateToken(state, payload) {
			state.updateToken = payload.updateToken;
		},
		addLike(state, payload) {
			const { mid } = payload
			if (!state.likes.includes(mid)) {
				state.likes.push(mid)
			}
		},
		delLike(state, payload) {
			const { mid } = payload
			if (state.likes.includes(mid)) {
				const i = state.likes.indexOf(mid)
				state.likes.splice(i, 1)
			}
		},
		addAtt(state, payload) {
			const { uid } = payload
			if (!state.attentions.includes(uid)) {
				state.attentions.push(uid)
			}
		},
		delAtt(state, payload) {
			const { uid } = payload
			if (state.attentions.includes(uid)) {
				const i = state.attentions.indexOf(uid)
				state.attentions.splice(i, 1)
			}
		},
		addWatch(state, payload) {
			const { mid } = payload
			if (!state.watchs.includes(mid)) {
				state.watchs.push(mid)
			}
		},
		delWatch(state, payload) {
			const { mid } = payload
			if (state.watchs.includes(mid)) {
				const i = state.indexOf(mid)
				state.watchs.splice(i, 1)
			}
		},
		pushMoment(state, payload) {
			state.moments.push(...payload.moment)
		},
		delMoment(state, payload) {
			state.moments.splice(payload.index, 1)
		},
		incMomentPage(state) {
			state.momentPage++
		},
		clearMomentPage(state) {
			state.momentPage = 0
		},
		updateAllMoments(state) {
			state.moments.forEach(m => {
				const { id, uid } = m
				m.buttons[2].active = state.likes.includes(id)
				m.attentions = state.attentions.includes(uid)
			})
		},
		setSubMomentIndex(state, payload) {
			state.subMomentIndex = payload.subMomentIndex
		},
		getSubMomentIndexWithId(state, payload) {
			for (const index in state.moments) {
				const item = state.moments[index]
				if (item.id === payload.id) {
					return state.subMomentIndex = index
				}
			}
			return
		}
	},
	getters: {
		getUserInfo(state) {
			return state.userInfo;
		},
		getUpdateToken(state) {
			return state.updateToken;
		},
		getUid(state) {
			return state.userInfo.uid
		},
		getCanUseAnonymous(state) {
			return state.globalSetting.can_use_anonymous
		}
	},
	modules: {
		RewardPoint,
		Setting
	}
})
export default store;