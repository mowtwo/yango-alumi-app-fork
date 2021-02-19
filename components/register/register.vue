<template>
	<view class="shadow-background" @touchmove.stop.prevent="_handelEvent" :class="common.show ? 'open' : 'close'" v-if="common.show || common.waitAnimation">
		<view class="card" :class="common.show ? 'open' : 'close'" @tap.native.stop="_handelEvent">
			<view class="card-title">
				<text v-if="!authGetUserInfo">您还未登录</text>
				<text v-else>您还未完成身份认证</text>
			</view>
			<view v-if="!authGetUserInfo">
				<image src="/static/components/register/login-icon.png" class="card-img"></image>
			</view>
			<view v-else>
				<image src="/static/components/register/verify-account.svg" class="card-img"></image>
			</view>
			<text class="card-tip">
				<text v-if="!authGetUserInfo">登录后，您可以访问校友圈的相关资源，了解学校最新消息</text>
				<text v-else>完成身份认证，您可以领取校友卡，参加相关课程等</text>
			</text>
			<view class="card-footer">
				<button class="card-button-left" @click="_cancel()">
					<text v-if="!authGetUserInfo">暂不登录</text>
					<text v-else>暂不认证</text>
				</button>
				<button class="card-button-right" open-type="getUserInfo" @getuserinfo="_bindGetUserInfo" v-if="!authGetUserInfo">立即登录</button>
				<button class="card-button-right" @click="_toBindAccount()" v-else>立即认证</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				common: {
					show: false,
					waitAnimation: false,
				},
				callBack: {
					cancel: null,
				},
				authGetUserInfo: false
			}
		},
		computed: {
			isShow() {
				return this.common.show;
			},
			userInfo() {
				return this.$store.getters.getUserInfo;
			}
		},
		watch: {
			isShow: function(val) {
				this.common.show = val;
				if (val === true) {
					// this._checkUserAccount();
				} else {
					this.common.waitAnimation = true;
					setTimeout(() => {
						this.common.waitAnimation = false;
					}, 290);
					this.common.show = false;
				}
			},
			userInfo: {
				handler(val) {
					if (val.haveUserInfo) {
						this.authGetUserInfo = true;
					} else {
						this.authGetUserInfo = false;
					}
					if (new Date(val.identity_verify_at).getTime() > 0 && val.haveUserInfo) {
						this.hide();
					}
				},
				immediate: true
			}
		},
		mounted: function() {
			uni.getSetting({
				success: (res) => {
					if (res.authSetting['scope.userInfo']) {
						if (this.userInfo.haveUserInfo) {
							this.authGetUserInfo = true;
						}
					}
				}
			});
		},
		methods: {
			show(config = {}) {
				this.callBack.cancel = config.cancel;
				this.common.show = true;
			},
			hide() {
				this.common.show = false;
			},
			_cancel() {
				if (this.common.show) {
					this.hide();
				}
				if (typeof this.callBack.cancel === 'function') {
					this.callBack.cancel();
				}
			},
			_toBindAccount() {
				uni.navigateTo({
					url: '/pages/register/register'
				});
			},
			// async _checkUserAccount() {
			// 	try {
			// 		let res = await this.request({
			// 			url: `${this._config.systemUrl}/auth/userInfo`,
			// 			method: 'GET'
			// 		});
			// 		// console.log(res.data);
			// 		if (res.data.status === 'success') {
			// 			if (!res.data.userInfo) {
			// 				res.data.userInfo = {};
			// 			}
			// 			this.$store.commit('setUserInfo', {
			// 				userInfo: res.data.userInfo
			// 			});
			// 			if (new Date(res.data.userInfo.identity_verify_at).getTime() > 0 && res.data.userInfo.haveUserInfo) {
			// 				this.hide();
			// 			}
			// 			if (!res.data.userInfo.haveUserInfo) {
			// 				this.authGetUserInfo = false;
			// 			} else {
			// 				this.authGetUserInfo = true;
			// 			}
			// 		} else {
			// 			let msg = this.parseResponse(res, this._checkUserAccount);
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: msg
			// 			});
			// 		}
			// 	} catch (e) {
			// 		uni.showToast({
			// 			icon: 'none',
			// 			title: '网络连接超时，请稍后再试'
			// 		});
			// 	}
			// },
			_toRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				});
			},
			async _bindGetUserInfo(res) {
				// console.log(res);
				if (res.detail.iv) {
					try {
						// 用户授权成功
						uni.showLoading({
							mask: true,
							title: '加载中'
						});
						let result = await this.request({
							url: `${this._config.systemUrl}/auth/users/info/oauth`,
							method: 'POST',
							data: {
								encryptedData: res.detail.encryptedData,
								iv: res.detail.iv
							}
						});
						uni.hideLoading();
						// console.log(result.data);
						if (result.data.status === 'success') {
							this.getUserInfoByToken();
							this.authGetUserInfo = true;
						} else {
							let msg = this.parseResponse(result, () => {
								this._bindGetUserInfo(res);
							});
							uni.showToast({
								icon: 'none',
								title: msg
							});
						}
					} catch (e) {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: '网络连接超时，请稍后再试'
						});
					}
				} else {
					// 用户取消授权
				}
			},
			_handelEvent() {
				return;
			}
		},
	}
</script>

<style scoped>
	.shadow-background {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 12000;
	}

	.shadow-background.open {
		animation: shadow-up 0.5s;
	}

	.shadow-background.close {
		animation: shadow-down 0.3s;
	}

	.card {
		width: 70vw;
		position: absolute;
		background-color: #FFFFFF;
		opacity: 1;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.card.open {
		animation: card-up 0.5s;
	}

	.card.close {
		animation: card-down 0.3s;
	}

	.card-title {
		margin: 44rpx 0 50rpx 0;
		font-size: 36rpx;
		color: #3f3f3f;
	}

	.card-img {
		height: 150rpx;
		width: 150rpx;
	}

	.card-tip {
		margin: 50rpx 50rpx 80rpx 50rpx;
		color: #666666;
		font-size: 26rpx;
		text-align: center;
	}

	.card-footer {
		display: flex;
		flex-direction: row;
		margin-bottom: 50rpx;
	}

	.card-button-left {
		margin-right: 20rpx;
		border: 2rpx solid var(--main-color);
		background-color: #FFFFFF;
		color: var(--main-color);
		border-radius: 34px;
		font-size: 26rpx;
	}

	.card-button-right {
		margin-left: 20rpx;
		background: var(--main-color);
		border-radius: 34rpx;
		color: #FFFFFF;
		font-size: 26rpx;
	}

	@keyframes card-up {
		from {
			transform: translateY(80vh);
		}

		to {
			transform: translateY(0);
		}
	}

	@keyframes card-down {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(80vh);
		}
	}

	@keyframes shadow-up {
		from {
			background-color: rgba(0, 0, 0, 0);
		}

		to {
			background-color: rgba(0, 0, 0, 0.3);
		}
	}

	@keyframes shadow-down {
		from {
			background-color: rgba(0, 0, 0, 0.3);
		}

		to {
			background-color: rgba(0, 0, 0, 0);
		}
	}
</style>
