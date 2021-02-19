<template>
	<view class="shuke-toast" :class="common.show ? 'open' : 'close'" v-if="common.show || common.waitAnimation"
	 @touchmove.stop.prevent="_handelEvent" @tap.native.stop="_shadowClick">
		<view class="shuke-toast-card" :class="common.show ? 'open' : 'close'" @tap.native.stop="_handelEvent">
			<view class="shuke-toast-icon">
				<image :src="`/static/components/shuke-toast/${icon.trim()}-icon.svg`"></image>
			</view>
			<view class="shuke-toast-title" v-if="title">{{ title }}</view>
			<view class="shuke-toast-tip" v-if="tip">{{ tip }}</view>
			<view class="shuke-toast-button" hover-class="shuke-toast-button-hover" hover-stop-propagation="true" v-if="button.text" :style="button.color ? `background-color: ${button.color}` : null" @tap.native.stop="_confirmToast()">{{ button.text }}</view>
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
				title: null,
				tip: null,
				icon: 'success',
				timeout: 0,
				button: {
					text: '我知道了',
					color: null
				},
				callBack: {
					confirm: null
				}
			};
		},
		computed: {
			isShowToast() {
				return this.common.show;
			}
		},
		watch: {
			isShowToast: function(val) {
				this.common.show = val;
				if (val === true) {
					this.common.waitAnimation = false;
					if (this.timeout && this.timeout > 0) {
						setTimeout(() => {
							this._confirmToast();
						}, this.timeout);
					}
				} else {
					this.common.waitAnimation = true;
					setTimeout(() => {
						this.common.waitAnimation = false;
					}, 290);
					this.common.show = false;
				}
			}
		},
		methods: {
			show(config = {}) {
				this.title = config.title || null;
				this.tip = config.tip || null;
				this.icon = config.icon || 'success';
				this.timeout = parseInt(config.timeout) || 0;
				if (!config.button) config.button = {};
				this.button.text = config.button.text || '我知道了';
				this.button.color = config.button.color || null;
				this.callBack.confirm = config.confirm;
				this.common.show = true;
			},
			hide() {
				this.common.show = false;
			},
			_confirmToast() {
				if (this.common.show) {
					this.hide();
					if (typeof this.callBack.confirm === 'function') {
						this.callBack.confirm();
					}
				}
			},
			_shadowClick() {
				this._confirmToast();
			},
			_handelEvent() {
				return;
			}
		}
	}
</script>

<style scoped>
	.shuke-toast {
		position: fixed;
		top: 0;
		bottom: 0;
		min-height: 100vh;
		width: 100vw;
		z-index: 9999;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.shuke-toast.open {
		animation: shadow-up 0.5s;
	}

	.shuke-toast.close {
		animation: shadow-down 0.3s;
	}

	.shuke-toast-card.open {
		animation: shuke-toast-up 0.5s;
	}

	.shuke-toast-card.close {
		animation: shuke-toast-down 0.3s;
	}

	.shuke-toast-card {
		margin-top: -100rpx;
		width: 480rpx;
		background-color: #FFFFFF;
		border-radius: 14px;
		box-shadow: 0px 20px 40px rgba(28, 23, 47, 0.2);
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding: 188rpx 40rpx 72rpx 40rpx;
	}
	
	.shuke-toast-icon {
		width: 325rpx;
		height: 326rpx;
		position: absolute;
		top: -118rpx;
	}
	
	.shuke-toast-icon > image {
		width: 100%;
		height: 100%;
	}
	
	.shuke-toast-title {
		padding: 0 20rpx;
		text-align: center;
		color: var(--main-color);
		font-size: 34rpx;
	}
	
	.shuke-toast-tip {
		text-align: center;
		margin-top: 16rpx;
		color: #666666;
		font-size: 26rpx;
	}
	
	.shuke-toast-button {
		margin-top: 40rpx;
		width: 400rpx;
		text-align: center;
		color: #FFFFFF;
		background-color: var(--main-color);
		padding: 15rpx 40rpx;
		font-size: 32rpx;
		border-radius: 22px;
	}


	@keyframes shuke-toast-up {
		from {
			transform: translateY(80vh);
		}

		to {
			transform: translateY(0);
		}
	}

	@keyframes shuke-toast-down {
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

	.shuke-toast-button-hover {
		background-color: #28b085 !important;
	}
</style>
