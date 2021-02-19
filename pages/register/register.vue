<template>
	<view class="body">
		<view class="main">
			<view class="have-verify" v-if="step == 3">
				<image src="/static/register/verify-account.svg" class="have-verify-icon"></image>
				<view class="have-verify-title">身份认证成功</view>
				<view class="have-verify-content">
					<view class="text" v-if="userInfo && userInfo.realname">姓名: {{ userInfo.realname }}</view>
					<view class="text" v-if="userInfo && userInfo.stu_id">教务账号: {{ userInfo.stu_id }}</view>
					<view class="text" v-if="userInfo && userInfo.detail && userInfo.detail.college">学院: {{ userInfo.detail.college }}</view>
					<view class="text" v-if="userInfo && userInfo.detail && userInfo.detail.grade && userInfo.detail.major && userInfo.detail.class">班级:
						{{ userInfo.detail.grade }}级{{ userInfo.detail.major }}{{ userInfo.detail.class }}班</view>
					<view class="text" v-if="userInfo && userInfo.detail && userInfo.detail.enter_school_at">入学时间: {{ userInfo.detail.enter_school_at }}</view>
					<view class="text" v-if="userInfo && userInfo.phone">手机号码: {{ userInfo.phone }}</view>
					<view class="text" v-if="userInfo && userInfo.detail && userInfo.detail.idcard_num">身份证号: {{ userInfo.detail.idcard_num }}</view>
				</view>
			</view>
			<block v-else>
				<view class="step-bar">
					<view class="step-group left">
						<view class="step" :class="step === 1 ? 'active' : ''">1</view>
						<view class="step-name">账号注册</view>
					</view>
					<view class="step-line"></view>
					<view class="step-group right">
						<view class="step" :class="step === 2 ? 'active' : ''">2</view>
						<view class="step-name">实名认证</view>
					</view>
				</view>
				<view class="split-area"></view>

				<view v-if="step === 1">
					<view class="card-head">
						<view class="card-text">微信授权</view>
					</view>
					<view class="operate-area">
						<view class="card-userinfo">
							<view class="card-avatar">
								<open-data type="userAvatarUrl"></open-data>
							</view>
							<view class="card-nickname">
								<open-data type="userNickName"></open-data>
							</view>
						</view>

						<view class="button" hover-class="button-default-hover">
							<text>使用微信授权手机号</text>
							<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="allowLaw"></button>
							<button @tap="showNeedAllowLaw" v-else></button>
						</view>
						<view class="law">
							<view @tap="setLawStatus">
								<image src="/static/register/squarecheck.svg" class="icon" v-if="allowLaw"></image>
								<text class="icon cuIcon-square" v-else></text>
							</view>
							<view class="content">
								<text @tap="setLawStatus">阅读并同意以下协议</text>
								<text class="click" @tap="toTos" :hover-stop-propagation="true">《服务条款》</text>
							</view>
						</view>
					</view>
				</view>
				<block v-else-if="step === 2">
					<view class="form-area">
						<block v-if="rules && rules.length > 0">
							<register-form :rules.sync="rules" @branch-update="branchUpdate"></register-form>
							<register-form :rules.sync="extra_fields"></register-form>
						</block>
						<view class="rule-loading" v-else>加载中</view>
					</view>
					<button class="button" @tap="submitForm" hover-class="button-default-hover" v-if="schoolIndex != -1 && rules && rules.length > 0">完成认证</button>
				</block>
			</block>
		</view>

		<view class="footer">
			<image src="/static/global/general-footer.svg" mode="scaleToFill" class="footer-img"></image>
		</view>
		<register ref="register"></register>
	</view>
</template>

<script>
	import register from '@/components/register/register.vue';
	import RegisterForm from '@/components/register/register_form_a.vue';
	export default {
		components: {
			register,
			'register-form': RegisterForm
		},
		data() {
			return {
				step: 1,
				allowLaw: true,
				rules: [],
				extra_fields: []
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.getUserInfo;
			}
		},
		watch: {
			userInfo: {
				handler(val) {
					console.log('data', val);
					if (new Date(val.identity_verify_at).getTime() > 0 && val.havePhone) {
						this.step = 3;
					} else {
						if (val.havePhone) {
							this.step = 2;
							this.getRules();
						} else {
							this.step = 1;
						}
					}
					if (val.haveUserInfo === false) {
						setTimeout(() => {
							this.$refs.register.show({
								cancel: () => {
									uni.reLaunch({
										url: '/pages/index/index'
									});
								}
							});
						}, 200);
					} else {
						setTimeout(() => {
							this.$refs.register.hide();
						}, 100);
					}
				},
				immediate: true
			}
		},
		methods: {
			branchUpdate() {
				this.extra_fields = [];
			},
			toTos() {
				this.navigateUrl({
					type: 'webview',
					url: `${this._config.staticUrl}/law/tos.html`
				});
			},
			showNeedAllowLaw() {
				uni.showModal({
					content: '你需要阅读并同意相关协议才可继续',
					confirmText: '阅读协议',
					success: ({confirm, cancel}) => {
						if (confirm) {
							this.toTos();
							this.allowLaw = true;
						}
					}
				})
			},
			skipRegister() {
				uni.reLaunch({
					url: '/pages/index/index?userCancel=true'
				});
			},
			setLawStatus() {
				this.allowLaw = !this.allowLaw;
			},
			async getRules() {
				try {
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					let res = await this.request({
						url: `${this._config.systemUrl}/auth/register/rule`,
						method: 'GET'
					});
					uni.hideLoading();
					console.log(res.data);
					this.rules = res.data.rules;
				} catch (e) {
					uni.hideLoading();
					uni.showToast({
						title: e,
						icon: 'none',
						duration: 1500
					});
				}
			},
			async submitForm() {
				try {
					if (!this.rules || this.rules.length == 0) {
						throw '无法获取到注册规则';
					}
					const formData = this.parseRules(this.rules);
					if (this.extra_fields && typeof this.extra_fields === 'object' && this.extra_fields.length > 0) {
						Object.assign(formData, this.parseRules(this.extra_fields));
					}
					uni.showLoading({
						title: '正在处理',
						mask: true
					});
					const res = await this.request({
						method: 'POST',
						url: `${this._config.systemUrl}/auth/identity/verify`,
						data: formData
					});
					uni.hideLoading();
					if (res.data.status === 'success') {
						if (res.data.code == 201) {
							if (res.data.msg) {
								uni.showToast({
									icon: 'none',
									title: res.data.msg,
									duration: 3000
								});
							}
							if (res.data.extra_fields && typeof res.data.extra_fields === 'object') {
								this.extra_fields = res.data.extra_fields;
							} else {
								this.extra_fields = [];
							}
						} else if (res.data.code == 200) {
							uni.showLoading({
								title: '正在更新',
								mask: true
							});
							await this.getUserInfoByToken();
							uni.hideLoading();
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}
					} else {
						let msg = this.parseResponse(res, () => {
							this.submitForm();
						});
						uni.showToast({
							title: msg,
							icon: "none",
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: e
					})
				}
			},
			parseRules(rules) {
				if (typeof rules != 'object') {
					throw '规则数据格式错误';
				}
				const formData = {};
				for (let item of rules) {
					switch (item.type) {
						case 'picker':
							{
								if (!item.range) continue;
								if (!item.key) continue;
								// 用户还未进行选择
								if ((!item.rangeIndex && item.rangeIndex != 0) || item.rangeIndex < 0) {
									// 此项必选
									if (item.verify && item.verify.required) {
										throw `您还未选择 [${item.title}] 字段`;
									} else {
										formData[item.key] = '';
									}
								} else {
									formData[item.key] = item.range[item.rangeIndex].value;
									// 如果这个选择器包含子选项，那么递归解析
									if (item.range[item.rangeIndex].includes) {
										Object.assign(formData, this.parseRules(item.range[item.rangeIndex].includes));
									}
								}
							}
							break;
						case 'text':
							{
								if (item.verify) {
									// 验证是否必填
									if (item.verify.required) {
										if (!item.value) {
											throw `您还未填写 [${item.title}] 字段`;
										}
									}
									// 如果有正则验证，就进行正则验证
									if (item.verify.regexp && item.verify.regexp.rule) {
										const re = new RegExp(item.verify.regexp.rule);
										if (!re.test(item.value)) {
											if (item.verify.regexp.tip) {
												throw `[${item.title}]字段验证错误: ${item.verify.regexp.tip}`;
											}
											throw `[${item.title}]字段验证失败`;
										}
									}
								}
								formData[item.key] = item.value;
							}
							break;
					}
				}
				return formData;
			},
			async getPhoneNumber(data) {
				try {
					if (!data.detail.iv) {
						throw '手机号获取失败';
					}
					let res = await this.request({
						method: 'POST',
						url: `${this._config.systemUrl}/auth/register/phone/tencent`,
						data: {
							encryptedData: data.detail.encryptedData,
							iv: data.detail.iv,
						}
					});
					console.log(res.data);
					if (res.data.status == 'success') {
						if (!res.data.userInfo) {
							res.data.userInfo = {};
						}
						this.$store.commit('setUserInfo', {
							userInfo: res.data.userInfo
						});
					} else {
						let msg = this.parseResponse(res, () => {
							this.getPhoneNumber(data);
						});
						uni.showToast({
							title: msg,
							icon: "none"
						});
					}
				} catch (e) {
					uni.showToast({
						title: e,
						icon: "none",
						duration: 2000
					});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.body {
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.main {
		z-index: 1;
		position: relative;
		background-color: #FFFFFF;
	}

	.have-verify {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.have-verify-icon {
		height: 250rpx;
		width: 250rpx;
		margin-top: 150rpx;
	}

	.have-verify-title {
		color: var(--main-color);
		font-size: 34rpx;
		font-weight: 500;
	}

	.have-verify-content {
		margin-top: 30rpx;
		font-size: 26rpx;
		color: #666666;
	}

	.step-bar {
		position: relative;
		width: 100vw;
		padding: 4vh 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.split-area {
		background-color: #EBF2F5;
		height: 20rpx;
		width: 100vw;
	}

	.step-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 99;
	}

	.step-group.left {
		margin-left: 20vw;
	}

	.step-group.right {
		margin-right: 20vw;
	}

	.step {
		height: 60rpx;
		width: 60rpx;
		color: #666666;
		border-radius: 50%;
		border: #EAEDEA solid 4rpx;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		justify-content: center;
	}

	.step.active {
		color: #FFFFFF;
		background-color: var(--main-color);
		border: 0;
	}

	.step-name {
		color: #666666;
		font-size: 28rpx;
		margin-top: 2vh;
		font-weight: bold;
	}

	.step-line {
		position: absolute;
		top: calc(4vh + 30rpx);
		left: 28vw;
		width: 44vw;
		height: 4rpx;
		background-color: #EAEDEA;
		z-index: 10;
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

	.card-head {
		height: 112rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-bottom: #D3DFEF solid 2rpx;
		margin-bottom: 40rpx;
	}

	.card-text {
		height: 100%;
		color: var(--main-color);
		font-size: 28rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: var(--main-color) solid 5rpx;
	}

	.operate-area {
		margin: 0 50rpx 40rpx 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.card-userinfo {
		margin: 50rpx 0;
	}

	.card-avatar {
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

	.button {
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		width: 650rpx;
		height: 100rpx;
		background-color: var(--main-color);
		border-radius: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 34rpx;
		position: relative;
	}

	.button.white {
		background-color: #ececec;
		color: #393939;
	}

	.button>button {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	}
	
	.form-area {
		margin: 0 50rpx 40rpx 50rpx;
		display: flex;
		flex-direction: column;
		&.userinfo {
			align-items: center;
		}
	}

	.user-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 110rpx;
		width: 100%;
		border-bottom: #F2F2F2 solid 2rpx;
	}

	.user-input .title {
		width: 30%;
		color: #4D4D4D;
		font-size: 30rpx;
		font-weight: 400;
	}

	.user-input .title.small {
		font-size: 28rpx;
	}

	.user-input .content {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.user-input-placeholder {
		color: #B3B3B3;
		font-size: 30rpx;
	}

	.select-icon {
		flex: 1;
		text-align: right;
	}

	.select-content {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.content picker {
		width: 100%;
	}

	.have-verify-content>.text {
		margin-bottom: 10rpx;
	}

	.button-default-hover {
		background-color: #31bd96 !important;
	}

	.button-white-hover {
		background-color: #e1e1e1 !important;
	}
	
	.law {
		display: flex;
		align-items: center;
		margin-top: 12rpx;
		color: #666666;
		font-size: 26rpx;
		width: 100%;
	}
	
	.law > view > image {
		width: 26rpx;
		height: 26rpx;
	}
	
	.law .icon {
		margin-left: 8rpx;
		margin-right: 12rpx;
	}
	
	.law .click {
		color: #1F8EFA;
	}
	
	.rule-loading {
		padding: 50rpx 0;
	}
</style>
