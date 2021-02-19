<template>
  <navigator :url="url" class="item">
    <view class="avator">
      <image mode="aspectFill" class="image" :src="avator" />
    </view>
    <view class="message">
      <view class="top">
        <view class="title">{{ title }}</view>
        <view class="time">{{ createdAt }}</view>
      </view>
      <view class="bottom">
        <view class="content">{{ content }}</view>
        <view class="slot">
          <slot></slot>
        </view>
      </view>
    </view>
  </navigator>
</template>

<script>
export default {
  props: {
    avator: String,
    url: String,
    title: String,
    content: String,
    createdAt: String,
  },
};
</script>

<style lang="scss" scoped>
@import "./item";
</style>