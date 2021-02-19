<template>
  <view class="group">
    <slot></slot>
  </view>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.group {
  background-color: #fff;
  width: 100%;
}

:not(:last-child) {
  .group {
    margin-bottom: 10rpx;
  }
}
</style>