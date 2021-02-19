<template>
  <view class="container">
    <view class="title">
      <color-title
        :title="title"
        :more="more"
        @navigator-click="navHandle"
      />
    </view>
    <view class="block">
        <slot></slot>
    </view>
  </view>
</template>

<script>
import ColorTitle from "@/components/mwcomponent/color-title";
export default {
  components: {
    ColorTitle,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    more: {
      type: String,
      default: "",
    },
  },
  methods: {
    navHandle() {
      this.$emit("navigatorClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding: 24rpx 30rpx;
}
.block {
    padding: 20rpx 0;
}
</style>