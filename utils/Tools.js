class Tools {
	/**
	 * 跳转页面
	 * 
	 * @example {type: 'pages', url: '/pages/index/index'}
	 * @example {type: 'webview', url: 'https://baidu.com'}
	 * @example {type: 'miniprogram', appid: 'wx45353453242', path: '/pages/index/index'}
	 * 
	 * @param {string} navigate 跳转参数 
	 * 
	 */
	static navigateUrl(navigate) {
		if (!navigate) return;
		switch (navigate.type) {
			case 'pages':
				let tabbarList = [
					'/pages/index/index',
					'/pages/courseTabbar/courseTabbar',
					'/pages/forum/forum',
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
				break;
			default:
				break;
		}
	}

	/**
	 * 获取当前请求发出的设备类型
	 */
	static getRequestType() {
		let type = 'other';
		// #ifdef MP-WEIXIN
		type = 'weixin';
		// #endif
		// #ifdef MP-QQ
		type = 'qq';
		// #endif

		return type;
	}

	/**
	 * 比较版本号
	 * @param {string} v1 第一个版本，类似于1.2.3
	 * @param {*} v2 第二个版本，类似于1.2.3
	 */
	static compareVersion(v1, v2) {
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

	/**
	 * 获取存储信息
	 * @param {string} key 需要获取缓存的key
	 * 
	 * @returns {string} value 缓存值
	 */
	static getStorage(key) {
		return new Promise((resolve, reject) => {
			if (!key) {
				reject('未传入需要读取的Key');
				return;
			}
			uni.getStorage({
				key: key,
				success: (res) => {
					resolve(res.data);
				},
				fail: (e) => {
					reject(e);
				}
			});
		});
	}

	/**
	 * 设置存储
	 * @param {string} key 需要设置缓存的key
	 * @param {string} value 缓存值
	 */
	static setStorage(key, value) {
		return new Promise((resolve, reject) => {
			if (!key) {
				reject('未传入需要设置的Key');
				return;
			}
			if (!value) {
				reject('未传入Key对应的值');
				return;
			}
			uni.setStorage({
				key: key,
				data: value,
				success: (res) => {
					resolve(res);
				},
				fail: (e) => {
					reject();
				}
			});
		});
	}

	/**
	 * 删除存储
	 * @param {string} key 需要删除的缓存key
	 */
	static removeStorage(key) {
		return new Promise((resolve, reject) => {
			if (!key) {
				reject('未传入需要移除的Key');
				return;
			}
			uni.removeStorage({
				key: key,
				success: (res) => {
					resolve(res);
				},
				fail: (e) => {
					reject(e);
				}
			});
		});
	}

	/**
	 * uni.getSetting Promise封装
	 */
	static getSetting() {
		return new Promise((resolve, reject) => {
			uni.getSetting({
				success(res) {
					resolve(res)
				},
				fail(e) {
					reject(e);
				}
			});
		});
	}

	/**
	 * uni.getSystemInfo Promise封装
	 */
	static getSystemInfo() {
		return new Promise((resolve, reject) => {
			uni.getSystemInfo({
				success: (res) => {
					resolve(res);
				},
				fail: (e) => {
					reject(e);
				}
			});
		});
	}

	static isObjectEquals(x, y) {
		let f1 = x instanceof Object;
		let f2 = y instanceof Object;
		if (!f1 || !f2) {
			return x === y
		}
		if (Object.keys(x).length !== Object.keys(y).length) {
			return false
		}
		for (let p in x) {
			let a = x[p] instanceof Object;
			let b = y[p] instanceof Object;
			if (a && b) {
				Tools.isObjectEquals(x[p], y[p])
			} else if (x[p] != y[p]) {
				return false;
			}
		}
		return true;
	}
}

export default Tools;
