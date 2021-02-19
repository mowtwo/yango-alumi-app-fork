import Vue from 'vue';
import Tools from './Tools';

/**
 * 认证类
 */
class Auth {
    constructor() {

    }

    // static async login() {
    //     switch (Vue.prototype.request_type) {
    //         case 'weixin':
    //         case 'wechat':
    //             {
    //                 let getToken;
    //                 // 尝试获取缓存中的Token
    //                 try {
				// 		await Auth._uniCheckSession();
    //                     getToken = await Tools.getStorage('token');
    //                 } catch (error) {}
    //                 if (getToken) {
				// 		console.log('[login]', '开始验证缓存token是否有效');
    //                     // 缓存里有Token，通过获取用户信息来验证Token是否有效
    //                     await Auth.getUserInfo();
    //                     console.log('[login]', 'Token验证成功');
    //                 } else {
    //                     // 缓存里没Token，直接去使用codeLogin登录
    //                     const getToken = await Auth._codeLogin('weixin');
    //                     if (!getToken || !getToken.token) {
    //                         throw '[login] 获取Token失败';
    //                     }
    //                     await Tools.setStorage('token', getToken.token);
    //                     console.log('[login]', `Token ${getToken.token} 获取成功`);
				// 		Vue.prototype.$store.commit('setUnlock', {
				// 			item: 'getUserInfo'
				// 		});
    //                     await Auth.getUserInfo();
    //                 }
    //             }
    //             break;
    //         default:
    //             {

    //             }
    //             break;
    //     }
    // }

  //   /**
  //    * 获取用户信息，并更新Vuex中的数据
  //    */
  //   static async getUserInfo() {
		// try {
		// 	const getLock = Vue.prototype.$store.getters.getLock;
		// 	if (getLock && getLock.getUserInfo) {
		// 		console.log('[getUserInfo] 请求已上锁，跳过本次请求')
		// 		return;
		// 	}
		// 	Vue.prototype.$store.commit('setLock', {
		// 		item: 'getUserInfo'
		// 	});
		// 	const res = await Request({
		// 	    url: `${Vue.prototype.systemURL}/auth/users/info`,
		// 	    method: 'GET',
		// 		retry: false,
		// 		redirect_login: false
		// 	});
		// 	console.log('[getUserInfo]', res.data);
		// 	if (!res.data || typeof res.data !== 'object') {
		// 	    res.data = {};
		// 	}
		// 	const userInfo = Auth._computedUserInfo(res.data.data);
		// 	if (Object.keys(userInfo).length > 0) {
		// 		Vue.prototype.$store.commit('setUserInfo', {
		// 		    userInfo: userInfo
		// 		});
		// 	}
		// 	// 将用户信息保存进缓存
		// 	// Tools.setStorage('userInfo', userInfo);
		// 	return res.data;
		// } catch (e) {
		// 	throw e;
		// } finally {
		// 	Vue.prototype.$store.commit('setUnlock', {
		// 		item: 'getUserInfo'
		// 	});
		// }
  //   }

  //   static _computedUserInfo(val = {}) {
		// if (Object.keys(val).length == 0) {
		// 	return val;
		// }
  //       if (val.uid && parseInt(val.uid)) {
  //           val.is_register = true;
  //       }
  //       if (val.have_user_info) {
  //           val.have_user_info = true;
  //       } else {
  //           val.have_user_info = false;
  //       }
  //       val.show_register_modal = false;
  //       if (val.identity_verify_at && new Date(val.identity_verify_at.replace(/-/g, '/')).getTime() > 0 && val.is_register && val.have_user_info) {
  //           val.show_register_modal = false;
  //       } else if (Object.keys(val).length > 0) {
  //           val.show_register_modal = true;
  //       }
		// if (val.external_type == 'EDU_SYSTEM_TEACHER') {
		// 	val.isTeacherAccount = true;
		// } else {
		// 	val.isTeacherAccount = false;
		// }
  //       return val;
  //   }

    static async autoUpdateUserInfo() {
        try {
            const getSetting = await Tools.getSetting();
            // 未授权，则不更新
            if (!getSetting.authSetting['scope.userInfo']) {
                throw '用户未授权获取用户信息';
            }
            const userInfo = await Auth._uniGetUserInfo({
                withCredentials: true
            });
            const res = await Vue.prototype.request({
                url: `${Vue.config.systemUrl}/auth/users/info/oauth`,
                method: 'POST',
                data: {
                    encryptedData: userInfo.encryptedData,
                    iv: userInfo.iv
                }
            });
            console.log('[autoUpdateUserInfo]', res.data);
        } catch (error) {
            console.error('[autoUpdateUserInfo]', error);
        }
    }

    /**
     * uni.getUserInfo Promise封装
     * @param {object} options 设置项，详见 https://uniapp.dcloud.io/api/plugins/login?id=getuserinfo
     */
    static _uniGetUserInfo(options = {}) {
        return new Promise((resolve, reject) => {
            uni.getUserInfo(Object.assign({
                success(res) {
                    resolve(res);
                },
                fail(e) {
                    reject(e);
                }
            }, options));
        });
    }

    // /**
    //  * 小程序code登录
    //  */
    // static async _codeLogin(provider) {
    //     const codeData = await Auth._oauthLogin(provider);
    //     const res = await Request({
    //         url: `${Vue.prototype.systemURL}/auth/mp/login`,
    //         method: 'POST',
    //         withAuthHeader: false,
    //         header: {
    //             'app-source': Vue.prototype.request_type,
    //             'app-version': Vue.prototype.version
    //         },
    //         data: {
    //             code: codeData.code,
    //         }
    //     });

    //     return res.data;
    // }

	// // static _uniCheckSession() {
	// // 	return new Promise((resolve, reject) => {
	// // 		uni.checkSession({
	// // 			success: () => {
	// // 				console.log('[Auth]', 'session key 未过期');
	// // 				resolve();
	// // 			},
	// // 			fail: () => {
	// // 				console.log('[Auth]', 'session key 已过期');
	// // 				reject();
	// // 			}
	// // 		})
	// // 	});
	// // }
 //    /**
 //     * 第三方OAuth登录
 //     * @param {string} provider 服务提供商
 //     */
 //    static _oauthLogin(provider) {
 //        if (!provider) {
 //            reject('未传入服务提供商');
 //            return;
 //        }
 //        return new Promise((resolve, reject) => {
 //            uni.login({
 //                provider: provider,
 //                success: (res) => {
 //                    resolve(res);
 //                },
 //                fail: (e) => {
 //                    reject(`第三方登录时出错: ${e}`);
 //                }
 //            });
 //        });
 //    }
}

export default Auth;