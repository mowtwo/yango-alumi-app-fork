<template>
	<view class="body">
		<view class="main">
			<view class="card-area" v-if="cardData.myCardList.length > 0">
				<view class="title">
					<view class="title-point"></view>
					<view class="text">已获得的卡</view>
				</view>
				<view>
					<view class="card-content" v-for="(item, index) in cardData.myCardList" :key="index" @tap="toCardDetail(item)">
						<image :src="item.cover_img"></image>
						<view class="card-no" :style="item.style" v-if="item.card_no">编号：{{ item.card_no }}</view>
					</view>
				</view>
			</view>

			<view class="card-area" v-if="cardData.leftCards.length > 0">
				<view class="title">
					<view class="title-point"></view>
					<view class="text">未领取的卡</view>
				</view>
				<view>
					<view class="card-content" v-for="(item, index) in cardData.leftCards" :key="index">
						<image :src="item.cover_img"></image>
						<view class="card-shadow">
							<view class="card-receive-button" hover-class="card-receive-button-hover" @tap="receiveCard(item.card_id)">领取</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<toast ref="toast"></toast>
	</view>
</template>

<script>
	import toast from '@/components/shuke-toast/shuke-toast.vue';
	export default {
		components: {
			toast
		},
		data() {
			return {
				cardData: {
					myCardList: [],
					leftCards: []
				}
			}
		},
		async onLoad() {
			try {
				uni.showLoading({
					title: '正在加载',
					mask: true
				});
				await this.getCardData();
				uni.hideLoading();
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					icon: 'none',
					duration: 2000,
					title: e
				});
			}
		},
		async onPullDownRefresh() {
			try {
				await this.getCardData();
				uni.stopPullDownRefresh();
			} catch (e) {
				uni.stopPullDownRefresh();
				uni.showToast({
					icon: 'none',
					duration: 2000,
					title: e
				});
			}
		},
		methods: {
			toCardDetail(item) {
				switch (item.type) {
					case 'alumni':
						{
							uni.navigateTo({
								url: `/pages/alumni_card_detail/alumni_card_detail?card_package_id=${item.card_package_id}`
							});
						}
						break;
					default:
						{
							uni.showToast({
								icon: 'none',
								title: '未知的卡片类型'
							});
						}
				}
			},
			async receiveCard(card_id) {
				try {
					if (!card_id) {
						throw '卡片ID为空';
					}
					let res = await this.request({
						url: `${this._config.systemUrl}/cards/package/add/${card_id}`,
						method: 'POST'
					});
					// console.log(res.data);
					if (res.data.status == 'success') {
						this.$refs.toast.show({
							icon: 'success',
							title: '卡片领取成功',
							timeout: 5000,
							confirm: () => {
								uni.startPullDownRefresh({});
							}
						});
					} else {
						let msg = this.parseResponse(res, async () => {
							await this.receiveCard(card_id);
						});
						throw msg;
					}
				} catch (e) {
					this.$refs.toast.show({
						icon: 'error',
						title: '出现错误',
						tip: e
					});
				}

			},
			async getCardData() {
				let res = await this.request({
					url: `${this._config.systemUrl}/cards/package/list`,
					method: 'GET'
				});
				// console.log(res.data);
				if (res.data.status == 'success') {
					this.cardData.myCardList = res.data.myCardList;
					this.cardData.leftCards = res.data.leftCards;
				} else {
					let msg = this.parseResponse(res, async () => {
						await this.getCardData();
					});
					throw msg;
				}
			}
		}
	}
</script>

<style>
	.body {
		background-color: #FFFFFF;
		min-height: 100vh;
	}

	.main {
		padding: 30rpx 15rpx;
	}

	.title {
		margin-left: 15rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.title>.title-point {
		width: 10rpx;
		height: 33rpx;
		background-color: var(--main-color);
		border-radius: 6rpx;
	}

	.card-area {
		margin-bottom: 20rpx;
	}

	.title>.text {
		margin-left: 10rpx;
		color: #282828;
		font-size: 36rpx;
		font-weight: bold;
	}

	.card-content {
		position: relative;
		width: 720rpx;
		height: 418rpx;
	}

	.card-no {
		position: absolute;
		top: 34rpx;
		right: 48rpx;
		color: #5E3148;
		font-size: 21rpx;
		font-weight: bold;
	}

	.card-shadow {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 20;
		background-color: rgba(0, 0, 0, 0.7);
		margin: 15rpx;
		border-radius: 42rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.card-shadow>.card-receive-button {
		padding: 15rpx 88rpx;
		background-color: var(--main-color);
		color: #FFFFFF;
		font-size: 32rpx;
		box-shadow: 0 3rpx 26rpx rgba(0, 0, 0, 0.16);
		border-radius: 44rpx;
		z-index: 30;
	}

	.card-content>image {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.card-receive-button-hover {
		background-color: #28b085 !important;
	}
</style>
