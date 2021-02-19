<template>
  <view class="header">
    <view class="left">
      <view
        class="avator"
        :style="{
          borderColor: avatorBorderColor,
        }"
        @click="avatorClickHandle(avator)"
      >
        <image
          v-if="avator"
          class="avator-el"
          :src="avator"
          mode="widthFix"
        ></image>
        <view
          v-else
          class="avator-el avator-default"
          :style="{
            backgroundColor: defaultAvatorColor,
          }"
        ></view>
      </view>
      <view class="info">
        <view class="name" @click="nameClickHandle(uname)">
          {{ uname ? uname : "未知的用户名" }}
        </view>
        <view class="more">
          <slot></slot>
        </view>
      </view>
    </view>
    <view class="right" v-if="rightText&&rightText != ''">
      <view
        class="more"
        :style="{
          color: rightActive ? rightActiveTextColor : rightTextColor,
        }"
        @click="moreClickHandle(rightActive)"
      >
        {{ rightActive ? nrightActiveText : rightText }}
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 用户姓名和头像组件
 */
export default {
  props: {
    uname: {
      //用户名
      type: String,
    },
    avator: {
      //头像
      type: String,
    },
    rightText: {
      //右侧更多显示的文本
      type: String,
      default: "",
    },
    rightTextColor: {
      type: String,
      default: " #ff713b",
    },
    rightActiveTextColor: {
      type: String,
      default: "#BABCC9",
    },
    rightActiveText: String, //右侧更多文本被激活时候显示的文本
    rightActive: {
      //右侧更多文本激活状态
      type: Boolean,
      default: false,
    },
    defaultAvatorColor: {
      //头像没有图片时默认背景色
      type: String,
      default: "#31D7A3",
    },
    avatorBorderColor: {
      //头像边框颜色
      type: String,
      default: "#31D7A3",
    },
  },
  data() {
    return {
      nrightActiveText: "",
    };
  },
  mounted() {
    // console.log(this.rightActiveText);
    this.nrightActiveText = !!this.rightActiveText
      ? this.rightActiveText
      : this.rightText;
  },
  watch: {
    rightActiveText(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.nrightActiveText = !!this.rightActiveText
          ? this.rightActiveText
          : this.rightText;
      }
    },
  },
  methods: {
    avatorClickHandle(imgSrc) {
      this.$emit("click", {
        target: "avator",
        imgSrc,
      });
      this.$emit("avator-click", {
        imgSrc,
      });
    },
    nameClickHandle(uname) {
      this.$emit("click", {
        target: "uname",
        uname,
      });
      this.$emit("uname-click", {
        uname,
      });
    },
    moreClickHandle(active) {
      this.$emit("click", {
        target: "more",
        active,
      });
      this.$emit("more-click", {
        active,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  flex-flow: nowrap row;

  .left {
    display: flex;
    align-items: center;

    .avator {
      width: 69rpx;
      height: 69rpx;
      overflow: hidden;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      border-width: 1rpx;
      border-style: solid;
      box-sizing: border-box;

      &-el {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      margin-left: 15rpx;

      .name {
        font-size: 30rpx;
        color: #333333;
      }
    }
  }

  .right {
    margin-left: auto;
    font-size: 28rpx;
    color: #ff713b;
    font-weight: bold;
  }
}
</style>