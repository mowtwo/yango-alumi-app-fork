<template>
  <view class="item url" @click="btnClick">
    <view class="container">
      <view
        class="title"
        :style="{
          color: color,
        }"
      >
        {{ title }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    color: {
      type: String,
      default: "#000",
    },
  },
  methods: {
    btnClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./item";
.item {
  padding: 0;
}
</style>