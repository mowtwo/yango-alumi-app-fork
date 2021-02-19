<template>
	<view v-if="formList.length > 0">
		<block v-for="(item, index) in formList" :key="index">
			<!-- 单选框 -->
			<block v-if="item.type == 'picker'">
				<view class="user-input">
					<text class="title" :class="item.title_small ? 'small' : ''">{{ item.title }}</text>
					<view class="content">
						<picker @change="_pickerChangeHandler(item, arguments)" :item="item.rangeIndex" :range="item.range" :range-key="item.rangeKey" :disabled="item.disabled" :mode="item.mode">
							<view class="select-content">
								{{ item.range[item.rangeIndex][item.rangeKey] || '请选择' }}
								<text class="cuIcon-unfold select-icon"></text>
							</view>
						</picker>
					</view>
				</view>
				<block v-if="item.range[item.rangeIndex] && item.range[item.rangeIndex].includes && item.range[item.rangeIndex].includes.length > 0">
					<register-form-b :rules.sync="item.range[item.rangeIndex].includes" @branch-update="branchUpdate"></register-form-b>
				</block>
			</block>
			<!-- 文本框 -->
			<view class="user-input" v-else-if="item.type == 'text'">
				<text class="title" :class="item.title_small ? 'small' : ''">{{ item.title }}</text>
				<input class="content" :placeholder="item.placeholder" :password="item.password" :disabled="item.disabled" v-model="item.value" :maxlength="item.maxlength" />
			</view>
		</block>
	</view>
</template>

<script>
	import RegisterFormB from './register_form_b.vue';
	export default {
		name: "register-form-a",
		props: {
			rules: {
				type: Array
			}
		},
		data() {
			return {
				formList: this.rules
			}
		},
		components: {
			'register-form-b': RegisterFormB
		},
		computed: {
		},
		watch: {
			rules: {
				handler(newValue, oldValue) {
					this.formList = newValue;
					this.$emit('update:rules', newValue);
				},
				immediate: false,
				deep: true
			},
		},
		async mounted() {
			// console.log('mounted', this.rules)
		},
		methods: {
			branchUpdate() {
				this.$emit('branch-update');
			},
			_pickerChangeHandler(item, args) {
				const data = args[0];
				if (item.range[item.rangeIndex] && item.range[item.rangeIndex].includes && item.range[item.rangeIndex].includes.length > 0) {
					this.$emit('branch-update');
				} else if (item.range[data.detail.value] && item.range[data.detail.value].includes && item.range[data.detail.value].includes.length > 0) {
					this.$emit('branch-update');
				}
				item.rangeIndex = data.detail.value;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './register_form';
</style>
