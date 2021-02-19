<template>
	<view class="info">
		<view class="render-view">
			<navigator class="header" hover-class="none">
				<view class="avatar">
					<image :src="userInfo.avatar" v-if="userInfo.avatar"></image>
					<image src="/static/my/default-avatar.svg" v-else></image>
				</view>
				<view class="content">
					<view class="userinfo">
						<view class="name">
							<block>
								<text v-if="userInfo.haveUserInfo">{{
			            userInfo.nickname || userInfo.realname
			          }}</text>
								<text v-else>暂未登录</text>
							</block>
							<block>
								<view class="verify-icon" v-if="
			              userInfo.identity_verify_at &&
			              new Date(userInfo.identity_verify_at).getTime() > 0
			            ">已实名认证</view>
								<view class="verify-icon no-verify" v-else>未实名认证</view>
							</block>
						</view>
						<view class="describe">{{ userInfo.detail.describe || "" }}</view>
					</view>
				</view>
			</navigator>
			<view class="card">
				<view class="card-item" v-for="(value, key) in fullInfo" :key="key">
					<text class="title">{{ value.title }}</text>
					<text class="value">{{ value.value }}</text>
				</view>
			</view>
			<view slot="body-pre">
				<view class="tools">
					<!-- <navigator class="button">编辑资料</navigator> -->
				</view>
			</view>
			<view class="action-count">
				<color-title-container title="动态数据">
					<view class="card count">
						<view class="block read-count">
							<view class="title">动态被阅读数</view>
							<view class="value">{{
						browseCount.todayCount > 999
						  ? `999+`
						  : browseCount.todayCount || "--"
					  }}</view>
							<view class="proportion">较昨日：{{ getTrend(browseCount)
						}}{{ getPropertion(browseCount) || '未知' }}</view>
						</view>
						<view class="block liked-count">
							<view class="title">动态被赞数</view>
							<view class="value">{{
						likedCount.todayCount > 999
						  ? `999+`
						  : likedCount.todayCount || "--"
					  }}</view>
							<view class="proportion">较昨日：{{ getTrend(likedCount)
						}}{{ getPropertion(likedCount) || '未知' }}</view>
						</view>
					</view>
				</color-title-container>
			</view>
		</view>
	</view>
</template>

<script>
	import CuBar from "@/components/mwcomponent/cu-bar.vue";
	import {
		mapState
	} from "vuex";
	import ColorTitleContainer from "@/components/mwcomponent/color-title-container.vue";
	export default {
		components: {
			CuBar,
			ColorTitleContainer,
		},
		computed: {
			...mapState(["userInfo"]),
		},
		data() {
			return {
				StatusBars: this.StatusBar,
				CustomBars: this.CustomBar,
				title: "Mowtwo",
				showBar: false,
				barOpactity: 0,
				maxScrollTop: 80,
				browseCount: {},
				likedCount: {},
				fullInfo: []
			};
		},
		async onLoad() {
			await this.getUserFullInfo();
			const browseCountRes = await this.request({
				url: `${this._config.nestServerUrl}/api/moment/browse-count`,
				method: "GET",
			});
			const browseCountData = browseCountRes.data.data;
			this.browseCount = browseCountData.countResult;

			const likedCountRes = await this.request({
				url: `${this._config.nestServerUrl}/api/moment/browse-count`,
				method: "GET",
			});
			const likedCountData = likedCountRes.data.data;
			this.likedCount = likedCountData.countResult;
		},
		methods: {
			backClick() {
				uni.navigateBack({
					delta: -1,
				});
			},
			async getUserFullInfo() {
				try {
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					const res = await this.request({
						method: 'GET',
						url: `${this._config.systemUrl}/auth/users/fullinfo`,
					});
					uni.hideLoading();
					if (res.data.status === 'success') {
						this.fullInfo = res.data.data;
					} else {
						let msg = this.parseResponse(res, async () => {
							await this.getUserFullInfo();
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
			getTrend({
				todayCount,
				yestodayCount
			}) {
				const p = todayCount - yestodayCount;
				if (!todayCount || !yestodayCount) {
					return "";
				}
				if (p < 0) {
					return "下降";
				} else if (p > 0) {
					return "上升";
				} else {
					return "";
				}
			},
			getPropertion({
				todayCount,
				yestodayCount
			}) {
				const n = Math.abs(todayCount - yestodayCount);
				if (!n) {
					return "";
				}
				const r = ((n / yestodayCount) * 100).toFixed(2);
				if (!r) {
					return "--";
				}
				return `${r}%`;
			},
			notInTopHandle() {
				this.showBar = true;
			},
			inTopHandle() {
				this.showBar = false;
			},
			scrollHandle({
				detail: {
					scrollLeft,
					scrollTop,
					scrollHeight,
					scrollWidth,
					deltaX,
					deltaY,
				},
			}) {
				// console.log(scrollTop);
				let opacity = scrollTop / this.maxScrollTop;
				if (opacity > 1) {
					opacity = 1;
				}
				if (opacity <= 0.1) {
					opacity = 0;
				}
				this.barOpactity = opacity;
			},
		},
	};
</script>

<style>
	page {
		background-color: #F8F8F8;
	}
</style>

<style lang="scss" scoped>
	.header {
		padding: 50rpx 60rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.header>.avatar {
		height: 100rpx;
		width: 100rpx;
		border-radius: 50%;
	}

	.header>.avatar>image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.header>.content {
		padding-left: 24rpx;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.header>.content>.userinfo {}

	.header>.content>.userinfo>.name {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.header>.content>.userinfo>.name>.verify-icon {
		margin-left: 12rpx;
		display: inline-block;
		padding: 6rpx 18rpx;
		background: linear-gradient(180deg,
			rgba(246, 213, 164, 1) 0%,
			rgba(223, 180, 107, 1) 100%);
		border-radius: 19rpx;
		color: #ffffff;
		font-size: 16rpx;
	}

	.header>.content>.userinfo>.name>.verify-icon.no-verify {
		background: linear-gradient(180deg,
			rgba(186, 188, 201, 1) 0%,
			rgba(136, 136, 136, 1) 100%);
	}

	.header>.content>.userinfo>.name>text {
		color: #3b424c;
		font-size: 30rpx;
		letter-spacing: 1rpx;
		font-weight: bold;
	}

	.header>.content>.userinfo>.describe {
		margin-top: 12rpx;
		color: #bababa;
		font-weight: bold;
		font-size: 24rpx;
	}

	.header>.content>.icon {
		flex: 1;
		text-align: right;
	}

	.header>.content>.icon>.cuIcon-right {
		font-size: 40rpx;
		color: #666666;
	}

	.card {
		margin: 30rpx;
		display: flex;
		flex-direction: column;
		box-shadow: 0 3rpx 21rpx rgba(186, 186, 186, 0.17);
		background-color: #FFFFFF;
		border-radius: 5rpx;
		padding: 30rpx 40rpx;
		margin-top: 0;
		
		&.count {
			flex-direction: row;
			padding: 30rpx 0;
		}

		&-item {
			padding: 20rpx 0;
			font-size: 28rpx;
			font-weight: bold;
			display: flex;

			>.title {
				color: #92919C;
				width: 30%;
			}

			>.value {
				color: #333333;
				width: 70%;
				text-align: right;
			}
		}
	}

	.info {
		.cu-bar {
			position: fixed;
			z-index: 9999999;
			top: 0;
			left: 0;

			.back {
				position: absolute;
				left: 30rpx;
				display: flex;
				align-items: center;
				z-index: 99999999;

				.icon {
					transform: rotate(-180deg);
					padding: 10rpx 5rpx;
					font-size: 34rpx;
					color: #ffffff;

					&:active {
						background-color: rgba($color: #000000, $alpha: 0.1);
						opacity: 0.6;
					}
				}
			}
		}

		.render-view {
			.tools {
				display: flex;
				justify-content: flex-end;

				.button {
					background-color: #31d7a3;
					color: #ffffff;
					font-size: 30rpx;
					margin: 20rpx;
					padding: 10rpx 20rpx;
					border-radius: 200rpx;
				}
			}

			.action-count {
				.container {
					display: flex;
					flex-flow: nowrap row;
					align-items: center;
					justify-content: space-around;
					padding: 50rpx;

					.block {
						width: 100%;
						display: flex;
						box-sizing: border-box;
						flex-flow: nowrap column;
						align-items: center;
						justify-content: center;

						&:not(:last-child) {
							border-right: #eee solid 1rpx;
						}

						.title {
							color: #5f5f5f;
							font-size: 28rpx;
						}

						.value {
							color: #141414;
							font-weight: bold;
							font-size: 40rpx;
							margin-top: 10rpx;
						}

						.proportion {
							color: #a5a5a5;
							font-size: 24rpx;
							margin-top: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
