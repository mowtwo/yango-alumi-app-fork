<template>
  <view
    :class="[
      'bar',
      {
        reserve: colorReserve,
      },
    ]"
  >
    <view :class="['tabs', `align-${align}`]">
      <view
        :class="[
          'tab',
          {
            active: curIndex === index,
          },
        ]"
        v-for="(item, index) in tabs"
        :key="index"
        @click="tabClickHandle"
        :data-index="index"
      >
        {{ item }}
      </view>
    </view>
    <view
      class="line"
      :style="{
        width: tabDomProperties[curIndex].width + 'px',
        left: tabDomProperties[curIndex].left + 'px',
      }"
    >
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      },
      validtor(val) {
        return val.every((i) => typeof i === "string" || typeof i === "number");
      },
    },
    colorReserve: Boolean,
    align: {
      type: String,
      default: "center",
      validtor(val) {
        return ["left", "center", "right"].includes(val);
      },
    },
  },
  data() {
    return {
      curIndex: 0,
      tabDomProperties: Array(this.tabs.length).fill({
        width: 0,
        left: 0,
      }),
    };
  },
  methods: {
    tabClickHandle(e) {
      const that = this;
      const index = e.target.dataset.index;
      that.curIndex = index;
      this.$emit("change", {
        index,
        text: that.tabs[index],
      });
    },
    switchTab(index) {
      this.curIndex = index;
    },
  },
  mounted() {
    const that = this;
    const query = uni.createSelectorQuery().in(that);
    query
      .selectAll(".tab")
      .boundingClientRect((res) => {
        //动态获取组件内所有tab的宽度和左偏移量
        that.tabDomProperties = res.map(({ //抽取单独的属性
          left, width }) => ({
          left,
          width,
        }));
      })
      .exec();
  },
};
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 84rpx;
  background-color: #ffffff;
  border-bottom: #ededee solid 2rpx;
  position: relative;

  &.reserve {
    background-color: #1bbc9b;

    .tabs {
      .tab {
        color: #ffffff;
        opacity: 0.9;

        &.active {
          color: #ffffff;
          opacity: 1;
        }
      }
    }

    .line {
      border-bottom: #ffffff solid 4rpx;
    }
  }

  .tabs {
    height: 100%;
    display: flex;
    align-items: center;

    &.align {
      &-center {
        justify-content: space-around;
      }

      &-left {
        justify-content: flex-start;
        margin-left: 30rpx;

        .tab {
          margin-right: 80rpx;
        }
      }

      &-right {
        justify-content: flex-end;
        margin-left: 30rpx;

        .tab {
          margin-left: 80rpx;
        }
      }
    }

    font-size: 28rpx;

    .tab {
      color: #999999;

      &.active {
        font-weight: bold;
        color: #1bbc9b;
      }
    }
  }

  .line {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    border-bottom: #1bbc9b solid 4rpx;
    width: 140rpx;
    height: 100%;
    transition: all 0.3s;
  }
}
</style>
