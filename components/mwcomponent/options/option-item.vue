<template>
  <view class="item">
    <view class="padding-container">
      <view class="title">
        {{ title }}
      </view>
      <view class="switch">
        <switch
          :checked="checked"
          :disabled="disabled"
          @change="swChange"
        ></switch>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    checked: Boolean,
    disabled: Boolean,
    optionKey: String,
  },
  methods: {
    swChange() {
      this.$emit("change", {
        value: !this.checked,
        key: this.optionKey,
        name: this.title,
      });
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