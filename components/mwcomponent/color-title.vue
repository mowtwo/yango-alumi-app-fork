<template>
  <view class="color-title">
    <view class="left-title">
      <view
        class="border"
        :style="{
          backgroundColor: bColor,
        }"
      ></view
      >{{ title }}
    </view>
    <view
      class="right-more"
      hover-class="navigator"
      v-if="more"
      @click="navHandle"
    >
      {{ more }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    bColor: {
      type: String,
      default: "#39D8B0",
    },
    tColor: {
      type: String,
      default: "#282828",
    },
    title: {
      type: String,
      default: "",
    },
    more: String,
  },
  methods: {
    navHandle() {
      this.$emit("navigatorClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.color-title {
  width: 100%;
  display: flex;
  align-items: center;

  .left-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #282828;
    line-height: 36rpx;
    display: flex;
    align-items: center;
    justify-content: left;
    .border {
      height: 33rpx;
      width: 10rpx;
      border-radius: 9999rem;
      margin-right: 5rpx;
    }
  }
  .right-more {
    font-size: 24rpx;
    font-weight: bold;
    color: #687087;
    margin-left: auto;
    padding: 5rpx 10rpx;
    border-radius: 5rpx;
    &.navigator {
      background-color: rgba($color: #000000, $alpha: 0.1);
      opacity: 0.6;
      display: inline-block;
    }
  }
}
</style>
