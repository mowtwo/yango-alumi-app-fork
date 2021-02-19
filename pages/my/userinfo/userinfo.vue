<template>
	<view class="body">
		<register ref="register"></register>
		<view class="header">
			<view class="header-image">
				<image src="/static/my/userinfo/header-icon.svg"></image>
			</view>
			<view class="header-content">
				我的身份信息
			</view>
		</view>
		<view class="card" v-if="userinfo.length > 0">
			<view class="card-content">
				<block v-for="(value, key) in userinfo" :key="key">
					<view class="row" v-if="value.title && value.value">
						<text class="title">{{ value.title }}</text>
						<text class="value">{{ value.value }}</text>
					</view>
				</block>
			</view>
		</view>
		<view class="button-group">
			<navigator class="item" hover-class="button-default-hover" url="/pages/my/userinfo/qrcode">
				<text class="icon cuIcon-qrcode"></text>
				<text>身份码</text>
			</navigator>
			<view class="item" hover-class="button-default-hover" @tap="clearIdentity">
				<text class="icon cuIcon-link"></text>
				<text>解绑身份</text>
			</view>
		</view>

		<view class="footer">
			<view class="footer-image">
				<image src="/static/login-footer.svg"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: []
			};
		},
		computed: {
			globalUserInfo() {
				return this.$store.getters.getUserInfo;
			}
		},
		async onLoad() {
			try {
				this.setDefaultUserInfo();
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				await this.getUserInfo();
				uni.hideLoading();
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					icon: 'none',
					title: `出错了: ${e}`
				});
			}
		},
		async onPullDownRefresh() {
			try {
				await this.getUserInfo();
			} catch (e) {
				uni.showToast({
					icon: 'none',
					title: `出错了: ${e}`
				});
			} finally {
				uni.stopPullDownRefresh();
			}
		},
		methods: {
			async getUserInfo() {
				try {
					const res = await this.request({
						method: 'GET',
						url: `${this._config.systemUrl}/auth/users/fullinfo`
					});
					console.log(res.data);
					if (res.data.data && typeof res.data.data === 'object') {
						this.userinfo = res.data.data;
					}
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: e,
						duration: 3000
					});
				}
			},
			setUserInfo(title, value) {
				if (!title) return;
				if (!value) return;
				const keyIndex = this.userinfo.findIndex(o => o.title == title);
				if (keyIndex == -1) {
					this.userinfo.push({
						title: title,
						value: value
					});
				} else {
					this.userinfo[keyIndex].value = value;
				}
			},
			clearUserInfo() {
				this.userinfo = [];
			},
			clearIdentity() {
				uni.showModal({
					title: '您确定要解绑身份信息吗',
					success: async (status) => {
						try {
							if (!status.confirm) return;
							await Request({
								method: 'POST',
								url: `${this._config.systemUrl}/auth/identity/clear`,
							});
							await this.getUserInfoByToken();
							uni.showToast({
								icon: 'none',
								title: '解绑成功'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}, 1500);
						} catch (e) {
							uni.showToast({
								icon: 'none',
								title: `出错了: ${e}`
							});
						}
					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '网络连接失败，请稍后再试',
							duration: 1500
						});
					}
				});
			},
			setDefaultUserInfo() {
				if (!this.globalUserInfo || typeof this.globalUserInfo !== 'object') return;
				this.setUserInfo('学校', this.globalUserInfo.school_name);
				this.setUserInfo('姓名', this.globalUserInfo.realname);
				if (this.globalUserInfo.external_type && this.globalUserInfo.external_id) {
					let external_type_name = '';
					switch (this.globalUserInfo.external_type) {
						case 'EDU_SYSTEM_STUDENT':
							external_type_name = '学号';
							break;
						case 'EDU_SYSTEM_TEACHER':
							external_type_name = '教务账号';
							break;
						default:
							external_type_name = '工号';
							break;
					}
					this.setUserInfo(external_type_name, this.globalUserInfo.external_id);
				}
				this.setUserInfo('手机号码', this.globalUserInfo.phone);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.body {
		min-height: 100vh;
		background-color: #ffffff;
		padding-bottom: 146rpx;
		position: relative;
	}

	.header {
		background-color: #38DDA3;
		padding: 50rpx;
		padding-bottom: 68rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&-image {
			width: 300rpx;
			height: 210rpx;

			>image {
				width: 100%;
				height: 100%;
			}
		}

		&-content {
			margin-top: 20rpx;
			font-size: 30rpx;
			color: #FFFFFF;
			font-weight: 500;
			letter-spacing: 4rpx;
		}
	}

	.card {
		position: relative;
		margin: 25rpx;
		margin-top: -30rpx;
		background-color: #FFFFFF;
		box-shadow: 0 3rpx 40rpx rgba(0, 0, 0, 0.16);
		border-radius: 34rpx;

		&-content {
			padding: 64rpx 46rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			>.row {
				width: 100%;
				background-color: #F8F9FB;
				padding: 12rpx 26rpx;
				color: #414141;
				font-size: 30rpx;
				font-weight: 400;
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 35rpx;

				&:last-child {
					margin-bottom: 0;
				}

				>.title {
					width: 30%;
				}

				>.value {
					width: 70%;
				}
			}
		}
	}

	.button-group {
		position: relative;
		z-index: 20;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 100rpx;

		margin: 35rpx {
			top: 60rpx;
		}

		>.item {
			background-color: #38DDA3;
			border-radius: 50rpx;
			margin: 20rpx;
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			font-size: 30rpx;
			font-weight: 400;
			padding: 24rpx 20rpx;

			>.icon {
				margin-right: 6rpx;
			}

			&:first-child {
				margin-left: 0;
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}

	.footer {
		position: absolute;
		bottom: 0;
		z-index: 1;

		&-image {
			width: 100vw;
			height: 264rpx;

			>image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
