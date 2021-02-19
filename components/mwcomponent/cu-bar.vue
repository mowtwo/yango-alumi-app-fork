<template>
  <view
    class="custom-bar"
    :style="{
      opacity: opacity,
    }"
  >
    {{ title }}
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    opacity: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes change-opacity {
  0% {
    opacity: 0;
  }
}
.custom-bar {
  // animation: change-opacity 0.3s 0s linear 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 100%;
  width: 100vw;
}
</style>