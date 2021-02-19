<template>
  <view class="block">
    <image class="image" src="@/static/global/img_empty.svg" mode="aspectFit" />
    <view class="big-title">
      <text class="text">{{ title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "空的项目",
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  width: 100%;
  padding: 0 180rpx;
  .image {
    width: 100%;
  }
  .big-title {
    font-size: 45rpx;
    font-weight: bold;
    color: #a8a8a8;
    text-align: center;
  }
}
</style>