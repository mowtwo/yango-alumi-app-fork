<template>
	<view class="body">
		<view class="card">
			<view class="card-title">
				<image src="/static/qrcode/scan_icon.png" class="title-icon"></image>
				<text>我的身份码</text>
			</view>
			<view class="card-content">
				<!-- <view class="card-main">可实现签到\开门操作</view> -->
				<view class="card-qrcode">
					<tki-qrcode ref="qrcode" :val="content" :loadMake="true" :onval="true" size="500" displaySize="100%" unit="upx" :lv="0" :showLoading="false" />
				</view>
				<view class="card-tip">距离机器10CM扫描成功率更高</view>
				<!-- <view class="refresh-button" hover-class="refresh-button-hover" @tap="refreshQrcode">刷新二维码</view> -->
				<view class="refresh-time">上次刷新时间: <text>{{ toTimeString(last_refresh) }}</text></view>
			</view>
		</view>
		<view class="card" v-if="usageLog && usageLog.length > 0">
			<view class="card-title">
				<image src="/static/qrcode/log.svg" class="title-icon"></image>
				<text>使用记录</text>
			</view>
			<view class="card-content">
				<view class="row" v-for="(item, key) in usageLog" :key="key">
					<view class="time">{{ item.record_at }}</view>
					<view class="status">{{ item.msg }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				content: '',
				last_refresh: null,
				timer: null,
				usageTimer: null,
				usageLog: [],
				brightness: 0.5
			}
		},
		onUnload() {
			uni.setScreenBrightness({
				value: this.brightness,
				success: () => {
					console.log(`屏幕亮度已调整至${this.brightness}`);
				}
			});
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
			if (this.usageTimer) {
				clearInterval(this.usageTimer);
				this.usageTimer = null;
			}
		},
		onLoad() {
			uni.getScreenBrightness({
				success: (res) => {
					this.brightness = res.value;
					console.log(res)
				}
			});
		},
		async onShow() {
			uni.setScreenBrightness({
				value: 1,
				success: () => {
					console.log(`屏幕亮度已调整至1`);
				}
			});
			try {
				uni.showLoading({
					title: '正在加载',
					mask: true
				});
				await this.getQrcode();
				await this.getUsageLog();
				uni.hideLoading();
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					title: e,
					icon: 'none',
					duration: 2000
				});
			}
			this.timer = setInterval(async () => {
				try {
					await this.getQrcode();
				} catch (e) {
					uni.showToast({
						title: e,
						icon: 'none',
						duration: 2000
					});
				}
			}, 15000);
			
			this.usageTimer = setInterval(async () => {
				try {
					await this.getUsageLog();
				} catch (e) {
					uni.showToast({
						title: e,
						icon: 'none',
						duration: 2000
					});
				}
			}, 3000);
		},
		onHide() {
			uni.setScreenBrightness({
				value: this.brightness,
				success: () => {
					console.log(`屏幕亮度已调整至${this.brightness}`);
				}
			});
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
			if (this.usageTimer) {
				clearInterval(this.usageTimer);
				this.usageTimer = null;
			}
		},
		methods: {
			async refreshQrcode() {
				try {
					if (this.last_refresh + 5 > Math.round(new Date().getTime() / 1000)) {
						throw '操作太快啦，请稍后再试';
					}
					uni.showLoading({
						title: '正在加载',
						mask: true
					});
					await this.getQrcode();
				} catch (e) {
					uni.hideLoading();
					uni.showToast({
						title: e,
						icon: 'none',
						duration: 2000
					});
				}
			},
			async getQrcode() {
				try {
					const res = await this.request({
						url: `${this._config.systemUrl}/auth/qrcode/gen`,
						method: 'GET'
					});
					console.log('[getQrcode]', res.data);
					if (res.data.status === 'success') {
						this.content = res.data.content;
						this.last_refresh = Math.round(new Date().getTime() / 1000);
					} else {
						let msg = this.parseResponse(res, async () => {
							await this.getQrcode();
						});
						throw msg;
					}
				} catch (e) {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: e,
						duration: 3000
					});
				}
			},
			toTimeString(time) {
				time = time * 1000;
				time += (8 * 1000 * 60 * 60);
				return new Date(time).toISOString().replace(/T/g, ' ').replace(/.000Z/, '');
			},
			async getUsageLog() {
				try{
					const res = await this.request({
						method: 'GET',
						url: `${this._config.systemUrl}/auth/identity_code/usage/log`
					});
					if (res.data && res.data.usage_log && typeof res.data.usage_log === 'object') {
						this.usageLog = res.data.usage_log;
					}
				}catch(e){
					uni.showToast({
						icon: 'none',
						title: e,
						duration: 3000
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.tki-qrcode {
		width: 100%;
		height: 100%;
		image {
			width: 100% !important;
			height: 100% !important;
		}
	}
</style>

<style scoped>
	.body {
		min-height: 100vh;
		background-color: #38DDA3;
		padding: 10rpx 0;
	}

	.card {
		background-color: #FFFFFF;
		margin: 30rpx;
		border-radius: 29rpx;
	}

	.card-title {
		border-bottom: 1rpx solid #E5E5E5;
		padding: 24rpx 40rpx;
		color: #666666;
		font-size: 36rpx;
		font-weight: 400;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.title-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 20rpx;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12rpx;
	}

	.card-content>.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 12rpx 40rpx;
		width: 100%;
	}

	.card-content>.row>.time {
		color: #939393;
		font-size: 29rpx;
		width: 70%;
	}

	.card-content>.row>.status {
		color: #38DDA3;
		font-size: 29rpx;
		width: 30%;
		text-align: right;
	}

	.card-content>.row>.status.error {
		color: #FD1111;
	}

	.card-main {
		margin-top: 80rpx;
		color: #c3c3c3;
		font-size: 32rpx;
		font-weight: bold;
	}

	.card-qrcode {
		margin-top: 110rpx;
		width: 300rpx;
		height: 300rpx;
	}

	.card-tip {
		margin-top: 90rpx;
		color: #d5d5d5;
		font-size: 32rpx;
		font-weight: 400;
	}

	.refresh-button {
		margin-top: 80rpx;
		background-color: #38DDA3;
		color: #FFFFFF;
		padding: 24rpx 170rpx;
		border-radius: 48rpx;
	}

	.refresh-time {
		padding-bottom: 20rpx;
		margin-top: 32rpx;
		color: #38DDA3;
		font-size: 29rpx;
		font-weight: 400;
	}

	.refresh-time>text {
		margin-left: 20rpx;
	}

	.refresh-button-hover {
		background-color: #1770c2 !important;
	}
</style>
