<template>
	<view class="body">
		<view class="navbar-top">
			<image src="/static/login/banner.svg" mode="scaleToFill" class="navbar-img"></image>
		</view>
		<view class="content">
			<view class="card">
				<view class="card-title">登录</view>
				<view class="card-userinfo">
					<view class="card-avatar">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<view class="card-nickname">
						<open-data type="userNickName"></open-data>
					</view>
				</view>
			</view>
			
			<view class="login-button" :class="isLoading ? 'disable loading' : ''" @click="reTry()">
				<text v-if="isLoading">正在登录</text>
				<text v-else-if="loginSuccess">登录成功</text>
				<text v-else>登录失败，点击重试</text>
			</view>
		</view>
		<view class="footer">
			<image src="/static/global/general-footer.svg" mode="scaleToFill" class="footer-img"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoading: false,
				loginSuccess: false,
			}
		},
		async onLoad() {
			await this.login();
		},
		methods: {
			async login() {
				if (this.isLoading || this.loginSuccess) return;
				this.isLoading = true;
				this.loginSuccess = false;
				try {
					let res = await this.codeLogin();
					console.log(res);
					this.isLoading = false;
					if (res.status != 'success') {
						throw res.msg;
					}
					this.loginSuccess = true;
					// 登录成功
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}, 500);
				} catch (e) {
					uni.showToast({
						title: e,
						icon: "none",
						duration: 3000
					});
				}
			},
			async reTry() {
				await this.login();
			},
		},
	}
</script>

<style scoped>
	.body {
		background-color: #F9F9F9;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.navbar-top {
		position: fixed;
		top: 0;
		height: 380rpx;
		width: 100vw;
	}
	.navbar-img {
		height: 100%;
		width: 100%;
	}
	.content {
		position: absolute;
		top: 0;
	}
	.card {
		width: 650rpx;
		background-color: #FFFFFF;
		margin-top: 264rpx;
		border-radius: 10px;
		box-shadow: 0rpx 46rpx 140rpx rgba(0,0,0,0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.card-title {
		color: #3E4A59;
		margin: 38rpx 0 0 50rpx;
		font-size: 48rpx;
		align-self: flex-start;
	}
	.card-userinfo {
		margin: 50rpx 0;
	}
	.card-avatar {
		position: relative;
		height: 140rpx;
		width: 140rpx;
		clip-path: circle(70rpx at center);
	}
	.card-nickname {
		font-size: 30rpx;
		color: #333333;
		margin-top: 20rpx;
		text-align: center;
	}
	.login-button {
		margin-top: 50rpx;
		width: 650rpx;
		height: 100rpx;
		background-color: #1F8EFA;
		border-radius: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 34rpx;
	}
	.login-button.disable {
		background-color: #8B8B8B;
	}
	.login-button text {
		margin-left: 10rpx;
	}
	.loading::before {
		font-family: "cuIcon";
		content: "\E67A";
		animation: cuIcon-spin 1.5s infinite linear;
	}
	
	.footer {
		height: 100%;
		width: 100%;
	}
	.footer-img {
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 261rpx;
	}
</style>
