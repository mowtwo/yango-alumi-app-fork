<template>
  <view class="grid">
    <view class="simple" v-if="imgLen === 1">
      <image
        @click.stop="imgClickHandle(0)"
        class="img"
        :src="nimages[0]"
        mode="widthFix"
      ></image>
    </view>
    <view class="muilt" v-else-if="imgLen > 1">
      <view class="block" v-for="(item, index) in nimages" :key="index">
        <image
          @click.stop="imgClickHandle(index)"
          class="img"
          :src="item"
          mode="aspectFill"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default() {
        return [];
      },
    },
    canPreview: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      nimages: [],
      imgLen: 0,
    };
  },
  mounted() {
    this.nimages = this.images.slice(0, 3);
    this.imgLen = this.nimages.length;
  },
  watch: {
    images(newValue) {
      this.nimages = newValue.slice(0, 3);
      this.imgLen = this.nimages.length;
    },
  },
  methods: {
    imgClickHandle(current) {
      // console.log(current);
      if (this.canPreview) {
        uni.previewImage({
          current,
          urls: this.nimages,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.grid {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  .simple {
    width: calc(100% - 250rpx);
    overflow: hidden;
    border-radius: 10rpx;
    .img {
      width: 100%;
      background-color: #aaaaaa;
    }
  }
  .muilt {
    width: 90%;
    display: flex;
    .block {
      width: 30%;
      height: 230rpx;
      overflow: hidden;
      border-radius: 10rpx;
      .img {
        width: 100%;
        height: 100%;
        background-color: #aaaaaa;
      }
      &:not(:last-child) {
        margin-right: 10rpx;
      }
    }
  }
}
</style>