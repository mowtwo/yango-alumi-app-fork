<template>
	<view>
		<block v-if="webUrl">
			<web-view :src="webUrl"></web-view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webUrl: null,
			}
		},
		onLoad(e) {
			let url = decodeURIComponent(e.url);
			if (!e.url) {
				uni.navigateBack({
					delta: 1
				});
				return;
			}
			this.webUrl = url;
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
