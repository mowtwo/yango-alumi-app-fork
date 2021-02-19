<template>
  <view class="capsule" :style="mStyle">
    <view class="list" :style="{ top: `-${index * 60}rpx` }">
      <view
        v-for="(item, index) in list"
        :key="index"
        @click="clickHandle(item.url)"
      >
        <template v-if="item.html">
          <view class="render html">
            <rich-text :nodes="item.html"></rich-text>
          </view>
        </template>
        <template v-else>
          <view class="render normal">
            <view class="title">
              {{ item.title }}
            </view>
            <view class="merge-word">
              {{ mergeWord }}
            </view>
            <view class="content">
              {{ item.content }}
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    mStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    mergeWord: {
      type: String,
      default: "|",
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      timer: -1,
      index: 0,
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      this.nextItem();
    }, this.duration);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    nextItem() {
      this.index++;
      if (this.index >= this.list.length) {
        this.index = 0;
      }
      this.$emit("change", {
        index: this.index,
        item: this.list[this.index],
      });
    },
    clickHandle(url) {
      // console.log(url)
      if (url) {
        // console.log('link')
        uni.navigateTo({
          url: url,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.capsule {
  position: relative;
  display: block;
  width: 100%;
  height: 60rpx;
  background-color: #f3f3f3;
  border-radius: 9999rem;
  overflow: hidden;
  padding: 0 30rpx;

  .list {
    position: absolute;
    transition: all 0.3s ease;
  }

  .render {
    height: 60rpx;
    display: flex;
    align-items: center;
    &.normal {
      .title,
      .merge-word {
        font-size: 28rpx;
      }
      .content {
        font-size: 24rpx;
      }
    }
  }
}
</style>