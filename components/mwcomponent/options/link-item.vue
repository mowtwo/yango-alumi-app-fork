<template>
  <view class="item url" @click="linkTo">
    <view class="padding-container">
      <view class="title">
        {{ title }}
      </view>
      <view class="description"> {{ description }} </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    url: String,
    title: String,
    description: String,
  },
  methods: {
    linkTo() {
      if (this.url) {
        uni.navigateTo({
          url: this.url,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./item";
:not(:last-child) {
  .item {
    .padding-container {
      border-bottom: rgb(230, 230, 230) solid 1rpx;
    }
  }
}
</style>
