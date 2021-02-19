import Vue from 'vue';
import App from './App';
import store from './store';
import dayjs from 'dayjs';
import "dayjs/locale/zh-cn";
import Tools from './utils/Tools.js';
// 引入预置全局页面组件
import BusinessView from "@/pages/business-view/business-view.vue";
Vue.component('business-view', BusinessView);

// console.log(dayjs)
dayjs.locale('zh-cn');

Vue.mixin({
	methods: {
		delEmojiContent(content) {
			const emojiRegex =
				/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
			return content.replace(emojiRegex, "[emoji]")
		},
		/**
		 * @param {Date} date 
		 */
		parseDateToStr(date) {
			const info = uni.getSystemInfoSync()
			// console.log(info)
			const d = new Date(date)
			const dayFromString = dayjs(date)
			// console.log(dayFromString.format('YYYY-MM-DD HH:mm:ss'))
			// console.log(d)
			// console.log(d.toLocaleDateString())
			const result = dayFromString.format('YYYY-MM-DD HH:mm:ss')
			// if (/iOS/.test(info.system)) {
			// 	result = [d.toLocaleDateString().replace(/\//g, '-'), d.toLocaleTimeString()].join(' ')
			// } else {
			// 	// console.log(d.toLocaleString())
			// 	result = d.toISOString().slice(0, 19).replace('T', ' ')
			// }
			// // console.log(result)
			return result
		},
		awaitUS(us = 1000) {
			return new Promise(resolve => {
				const timer = setTimeout(() => {
					clearTimeout(timer)
					resolve(true)
				}, us)
			})
		},
		/**
		 * 生成url的query
		 * @param {string|Array<string>|{[key:string]:string|number}} query 
		 */
		genUrlQuery(query) {
			if (!query) {
				return ''
			}
			if (typeof query === 'object') {
				if (Array.isArray(query)) {
					return query.join('&')
				}
				return Object.keys(query).map(k => {
					return [k, query[k]].join('=')
				}).join('&')
			}
			return query
		},
		/**
		 * 生成带query带url
		 * @param {string} url 
		 * @param {string} query 
		 */
		genUrlWithQuery(url, query) {
			return [url, this.genUrlQuery(query || '')].join('?')
		}
	}
})

Vue.prototype.$store = store

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.config.systemUrl = 'https://apis.huashuedu.cn';
// Vue.config.systemUrl = 'https://apis-dev.huashuedu.cn';
// Vue.config.nestServerUrl = 'https://apis-dev.huashuedu.cn/nest'
Vue.config.nestServerUrl = 'https://apis.huashuedu.cn/nest'
// Vue.config.nestServerUrl = 'http://mydev.mowtwo.com:3000/nest'

Vue.config.staticUrl = 'https://alumni-static.huashuedu.cn';

Vue.prototype._config = Vue.config;

// 请求类型
// #ifdef MP-WEIXIN
Vue.prototype.request_type = 'weixin';
// #endif
// #ifdef MP-QQ
Vue.prototype.request_type = 'qq';
// #endif
// #ifndef MP-WEIXIN || MP-QQ
Vue.prototype.request_type = 'other';
// #endif

// 版本号
Vue.prototype.version = 1.0;

Vue.prototype.request = function(options = {}) {
	const userOptions = {
		...options
	};
	if (!options.header) {
		options.header = {};
	}
	let header = Object.assign(options.header, {
		Authorization: 'Bearer ' + uni.getStorageSync('token'),
		'app-source': Vue.prototype.request_type,
		'app-version': Vue.prototype.version
	});
	return new Promise((resolve, reject) => {
		uni.request(Object.assign(options, {
			header: header,
			success: (res) => {
				if (userOptions.success && typeof userOptions.success === 'function') {
					userOptions.success(res);
				}
				resolve(res);
			},
			fail: (res) => {
				if (userOptions.fail && typeof userOptions.fail === 'function') {
					userOptions.fail(res);
				}
				reject(`网络连接超时，请稍后再试`);
			},
			complete: (res) => {
				if (userOptions.complete && typeof userOptions.complete === 'function') {
					userOptions.complete(res);
				}
			}
		}));
	});
}

Vue.prototype.parseResponse = function(res, callback) {
	switch (res.data.code) {
		case 401:
			Vue.prototype.getUserInfoByToken(true).then((res) => {
				if (typeof callback !== 'function') {
					let pages = getCurrentPages();
					let page = pages[pages.length - 1];
					page.onLoad()
				} else {
					callback();
				}
			}).catch(e => {
				uni.navigateTo({
					url: '/pages/index/index'
				});
			});
			return "正在登录...";
			break;
		case 402:
			Vue.prototype.getUserInfoByToken(true).then((res) => {
				if (typeof callback !== 'function') {
					let pages = getCurrentPages();
					let page = pages[pages.length - 1];
					page.onLoad()
				} else {
					callback();
				}
			}).catch(e => {
				uni.navigateTo({
					url: '/pages/index/index'
				});
			});
			break;
		case 405:
			//跳转绑定页面
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/register/register'
				})
			}, 1000);
			return res.data.msg;
			break;
		case 300:
			return res.data.msg;
			break;
		default:
			return "未知错误，请稍后再试: " + (res.data.code || '');
			break;
	}
}

Vue.prototype.scanQrcode = function() {
	uni.scanCode({
		success(res) {
			let url = res.result.split('/');
			url = url.filter(e => e);
			// if (url[1] == 'qr.shukeapp.net') {
			// 	switch (url[2]) {
			// 		default:
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: '二维码无效'
			// 			});
			// 			break;
			// 	}
			// }
		}
	});
}
Vue.prototype.navigateUrl = function(navigate) {
	if (!navigate) return;
	switch (navigate.type) {
		case 'pages':
			let tabbarList = [
				'/pages/index/index',
				'/pages/my/my',
			];
			if (tabbarList.indexOf(navigate.url) != -1) {
				uni.switchTab({
					url: navigate.url
				});
			} else {
				uni.navigateTo({
					url: navigate.url
				});
			}
			break;
		case 'webview':
			uni.navigateTo({
				url: '/pages/webview/webview?url=' + encodeURIComponent(navigate.url)
			});
			break;
		case 'miniprogram':
			if (navigate.appid && navigate.path) {
				uni.navigateToMiniProgram({
					appId: navigate.appid,
					path: navigate.path
				});
			}
		default:
			break;
	}
}

Vue.prototype.getMenuButton = function() {
	if ((!Vue.prototype.StatusBar) || (!Vue.prototype.CustomBar) || Vue.prototype.StatusBar <= 0 || Vue.prototype.CustomBar <=
		0) {
		uni.getSystemInfo({
			success: function(e) {
				// 状态栏
				Vue.prototype.StatusBar = e.statusBarHeight;
				// 安全区域
				Vue.prototype.safeAreaBottom = 0;
				if (e.screenHeight / e.screenWidth >= 1.8 && e.platform == 'ios') {
					Vue.prototype.safeAreaBottom = 34;
				}
				try {
					Vue.prototype.windowHeight = e.windowHeight;
					// #ifndef MP
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif

					// #ifdef MP-QQ
					let customHeight = qq.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = customHeight;
					Vue.prototype.CustomBar = customHeight.bottom + customHeight.top - e.statusBarHeight;
					// #endif   

					// #ifdef MP-ALIPAY
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				} catch (err) {
					console.log(err);
				} finally {
					// #ifdef MP-WEIXIN || MP-QQ
					if ((!Vue.prototype.CustomBar) || (Vue.prototype.CustomBar + e.statusBarHeight <= 0)) {
						Vue.prototype.Custom = {
							height: 32,
							left: uni.upx2px(730) - 87,
							right: uni.upx2px(730),
							width: 87
						}
						if (e.platform == 'ios') {
							if (Vue.prototype.safeAreaBottom) {
								Vue.prototype.Custom.top = 50;
								Vue.prototype.Custom.bottom = 82;
							} else {
								Vue.prototype.Custom.top = 26;
								Vue.prototype.Custom.bottom = 58;
							}
						} else {
							if (e.screenHeight / e.screenWidth >= 1.8) {
								Vue.prototype.Custom.top = 38;
								Vue.prototype.Custom.bottom = 70;
							} else {
								Vue.prototype.Custom.top = 28;
								Vue.prototype.Custom.bottom = 60;
							}
						}
						Vue.prototype.CustomBar = Vue.prototype.Custom.bottom + Vue.prototype.Custom.top - e.statusBarHeight;
					}
					// #endif
				}
			}
		});
	}
}

Vue.prototype.compareVersion = function(v1, v2) {
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)

	while (v1.length < len) {
		v1.push('0')
	}
	while (v2.length < len) {
		v2.push('0')
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i])
		const num2 = parseInt(v2[i])
		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}
	return 0;
}


Vue.prototype.getUserInfoByToken = async function(force = false) {
	try {
		if (!force && Vue.prototype.$store.getters.getUpdateToken) {
			return;
		}
		Vue.prototype.$store.commit('setUpdateToken', {
			updateToken: true
		});
		let getUserInfo;
		if (!force) {
			getUserInfo = await _getUserInfo();
		}
		if (force || getUserInfo.status != 'success') {
			await tencentLogin();
			let getData = await _getUserInfo();
			if (getData.status != 'success') {
				throw '登录失败';
			}
		}
		console.log('login success');
	} catch (e) {
		uni.reLaunch({
			url: '/pages/login/login'
		});
		console.log(e);
	} finally {
		Vue.prototype.$store.commit('setUpdateToken', {
			updateToken: false
		});
	}
}

Vue.prototype.codeLogin = async function() {
	try {
		await tencentLogin();
		let getData = await _getUserInfo();
		return {
			status: 'success'
		}
	} catch (e) {
		return {
			status: 'error',
			msg: e
		}
	}
}

function _getUserInfo() {
	return new Promise(async (resolve, reject) => {
		try {
			let token = uni.getStorageSync('token');
			if (token) {
				//存在token,检验token是否有效
				let res = await Vue.prototype.request({
					url: `${Vue.prototype._config.systemUrl}/auth/users/info`,
					method: 'GET'
				});
				console.log(res.data);
				if (res.data.status === 'success') {
					// token有效, 检测本地是否过期
					uni.checkSession({
						success() {
							Vue.prototype.$store.commit('setUserInfo', {
								userInfo: res.data.userInfo
							});
							uni.setStorage({
								key: 'userInfo',
								data: JSON.stringify(res.data.userInfo)
							});
							resolve(res.data);
						},
						fail() {
							//这边判断微信的登录态是否失效，如果失效，重新登陆
							resolve({
								status: 'error'
							});
						}
					});
				} else {
					// token无效,那么重新获取
					resolve({
						status: 'error'
					});
				}
			} else {
				resolve({
					status: 'error',
				});
			}
		} catch (e) {
			console.log(e);
			resolve({
				status: 'error'
			});
		}
	});
}

function tencentLogin() {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: Vue.prototype.request_type,
			success: (loginData) => {
				uni.request({
					url: `${Vue.prototype._config.systemUrl}/auth/mp/login`,
					method: 'POST',
					header: {
						'app-source': Vue.prototype.request_type,
						'app-version': Vue.prototype.version
					},
					data: {
						code: loginData.code,
					},
					success: (res) => {
						console.log(res.data);
						if (res.data.status == 'success') {
							//本地储存token
							uni.setStorageSync('token', res.data.token);
							resolve(res.data);
						} else {
							if (res.data.code && res.data.code < 500) {
								reject(res.data.msg);
							} else {
								reject('服务器出错了，请稍后再试');
							}
						}
					},
					fail: (e) => {
						console.log(e);
						reject('网络连接超时,请稍后再试');
					}
				});
			},
			fail: (e) => {
				reject(e);
				console.log(e);
			}
		});
	})
}

const app = new Vue({
	store,
	...App
})
app.$mount()
