<template>
	<view class="body">
		<view class="custom-bar" :style="{'height': CustomBars + 'px', 'padding-top': StatusBars + 'px', 'background-color': displayNav ? 'var(--main-color)' : 'transparent'}">
			<view class="cuIcon-back" @tap="BackPage()"></view>
		</view>
		<view class="banner" id="nav">
			<image src="../../static/alumni-card-detail/banner.svg"></image>
			<view class="button" @tap="toCardPackage()">
				<text>卡包</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>

		<view class="card">
			<view class="item" v-if="userInfo && userInfo.realname">
				<view class="key">姓名</view>
				<view class="value">{{ userInfo.realname }}</view>
			</view>
			
			<view class="item" v-if="userInfo && userInfo.detail && userInfo.detail.college">
				<view class="key">学院</view>
				<view class="value">{{ userInfo.detail.college }}</view>
			</view>

			<view class="item" v-if="userInfo && userInfo.detail && userInfo.detail.grade && userInfo.detail.major && userInfo.detail.class">
				<view class="key">班级</view>
				<view class="value">{{ userInfo.detail.grade }}级{{ userInfo.detail.major }}{{ userInfo.detail.class }}班</view>
			</view>

			<view class="item">
				<view class="key" v-if="card_detail && card_detail.card_no">卡号</view>
				<view class="value">{{ card_detail.card_no }}</view>
			</view>

			<view class="item" v-if="userInfo && userInfo.stu_id">
				<view class="key">教务账号</view>
				<view class="value">{{ userInfo.stu_id }}</view>
			</view>

			<view class="item" v-if="card_detail && card_detail.created_at">
				<view class="key">领取时间</view>
				<view class="value">{{ card_detail.created_at }}</view>
			</view>

			<view class="qrcode" v-if="card_detail && card_detail.card_url">
				<tki-qrcode ref="qrcode" :val="card_detail.card_url" size="216" :onval="true" :loadMake="true" :showLoading="true" loadingText="正在加载"
				 class="qrcode-data" />
			</view>

			<view class="flourish-logo">
				<image src="/static/logo/flourish.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				StatusBars: this.StatusBar,
				CustomBars: this.CustomBar,
				windowHeights: this.windowHeight,
				displayNav: false,
				card_package_id: null,
				card_detail: {}
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.getUserInfo;
			}
		},
		async onLoad(e) {
			try {
				if (!e.card_package_id) {
					throw '未传入卡片ID';
				}
				this.card_package_id = e.card_package_id;
				uni.showLoading({
					title: '正在加载',
					mask: true
				});
				await this.getCardDetail();
				uni.hideLoading();
			} catch (e) {
				uni.showToast({
					icon: 'none',
					title: e,
					duration: 2000
				});
				setTimeout(() => {
					this.BackPage();
				}, 2000);
			}
			
		},
		onReady() {
			this.getMenuButton();
			setTimeout(() => {
				this.StatusBars = this.StatusBar;
				this.CustomBars = this.CustomBar;
				this.windowHeights = this.windowHeight;
			}, 0);
		},
		onPageScroll() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#nav').boundingClientRect(el => {
				if(!(el.top < this.windowHeights && el.top > this.CustomBars * -1)){
					// 不在可视范围内
					this.displayNav = true;
				} else {
					this.displayNav = false;
				}
			}).exec();
		},
		methods: {
			toCardPackage() {
				uni.redirectTo({
					url: '/pages/card_package/card_package'
				});
			},
			BackPage() {
				if (getCurrentPages().length < 2 && (typeof __wxConfig == 'object')) {
					let url = '/' + __wxConfig.pages[0]
					return uni.reLaunch({
						url: url
					});
				}
				uni.navigateBack({
					delta: 1
				});
			},
			async getCardDetail() {
				let res = await this.request({
					url: `${this._config.systemUrl}/cards/detail/${this.card_package_id}`,
					method: 'GET'
				});
				// console.log(res.data);
				if (res.data.status == 'success') {
					this.card_detail = res.data.card_detail;
				} else {
					let msg = this.parseResponse(res, async () => {
						await this.getCardDetail();
					});
					throw msg;
				}
			}
		}
	}
</script>

<style scoped>
	.body {
		background-color: #FFFFFF;
		min-height: 100vh;
		padding-bottom: 20rpx;
	}
	
	.custom-bar {
		width: 100vw;
		position: fixed;
		top: 0;
		z-index: 99;
		background-color: var(--main-color);
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.custom-bar > .cuIcon-back {
		padding-left: 30rpx;
		font-size: 40rpx;
		color: #FFFFFF;
	}

	.banner {
		width: 100vw;
		height: 430rpx;
		position: relative;
	}

	.banner>image {
		width: 100%;
		height: 100%;
	}

	.banner>.button {
		position: absolute;
		left: 50rpx;
		bottom: 58rpx;
		box-shadow: 0 3rpx 7rpx rgba(0, 0, 0, 0.15);
		background-color: #FE8B11;
		padding: 15rpx 32rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		font-weight: bold;
		letter-spacing: 2rpx;
		border-radius: 50rpx;
	}

	.banner>.button>.cuIcon-right {
		margin-left: 10rpx;
	}

	.card {
		margin: 42rpx 25rpx;
		background-color: #FFFFFF;
		box-shadow: 0 3rpx 40rpx rgba(0, 0, 0, 0.16);
		border-radius: 42rpx;
		padding: 64rpx 45rpx;
		padding-bottom: 34rpx;
	}

	.card>.item {
		background-color: #F8F9FB;
		margin-bottom: 35rpx;
		padding: 12rpx 26rpx;
		color: #414141;
		font-size: 30rpx;
		font-weight: 400;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.card>.item>.key {
		width: 30%;
	}

	.card>.item>.value {
		width: 70%;
	}

	.card>.qrcode {
		margin-top: 72rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.card>.qrcode>.qrcode-data {
		width: 216rpx;
		height: 216rpx;
	}

	.flourish-logo {
		margin-top: 20rpx;
		text-align: right;
	}

	.flourish-logo>image {
		width: 180rpx;
		height: 63rpx;
	}
</style>
