<template>
  <view
    class="panel"
    :style="{
      background: `linear-gradient(180deg,${background[0]} 0%,${
        background[1] ? background[1] : background[0]
      } 100%)`,
    }"
    @click="clickHandle"
  >
    <view class="html" v-if="html">
      <rich-text class="html-render" :nodes="html"> </rich-text>
    </view>
  </view>
</template>

<script>
export default {
  props: { 
    html: String,
    background: {
      type: Array,
      default() {
        return ["#ffcf17", "#ffae1f"];
      },
    },
  },
  methods: {
    clickHandle() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
  width: 258rpx;
  height: 170rpx;
  border-radius: 10rpx;
  // background-color: green;
  // background: linear-gradient(180deg, #ffcf17 0%, #ffae1f 100%);
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-image: url("@/static/components/mwcomponent/flush.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }

  .html {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>