<template>
  <view class="view">
    <view class="mask" @click="closeClick"></view>
    <view class="container">
      <view class="panel">
        <view class="button close" @click="closeClick">关闭</view>
      </view>
      <scroll-view class="scroll" :scroll-y="true">
        <slot></slot>
      </scroll-view>
      <view class="addSecondComment">
        <view class="input">
          <input
            class="input-el"
            type="text"
            v-model="newComment"
            :placeholder="
              bottomInputPlaceholder ? bottomInputPlaceholder : '评论'
            "
            cursor-spacing="50"
            :focus="bottomInputFocus"
          />
        </view>
        <button
          type="primary"
          class="submit"
          size="mini"
          :disabled="newComment === ''"
          @click="addComment"
        >
          回复
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    bottomInputPlaceholder: String,
    bottomInputFocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newComment: "",
    };
  },
  methods: {
    closeClick() {
      this.$emit("close-click");
    },
    addComment() {
      this.$emit("submit", {
        comment: this.newComment,
      });
      this.newComment = "";
    },
  },
  mounted() {
    this.$emit("show");
  },
  beforeDestroy() {
    this.$emit("hide");
  },
};
</script>

<style lang="scss" scoped>
@keyframes bottom-to-top {
  0% {
    transform: translateY(100%);
  }
}

@keyframes top-to-bottom {
  100% {
    transform: translateY(100%);
  }
}
.view {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba($color: #000000, $alpha: 0.4);
  }
  .container {
    position: relative;
    overflow: hidden;
    &.cancel {
      animation: top-to-bottom 0.3s 0s ease 1;
    }
    animation: bottom-to-top 0.3s 0s ease 1;
    width: 100%;
    height: calc(100% - 60rpx);
    background-color: #ffffff;
    position: absolute;
    bottom: 0;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;

    $panelHeight: 60rpx;
    .panel {
      display: flex;
      height: $panelHeight;
      background-color: #ffffff;
      align-items: center;
      .button {
        color: #0d8059;
        display: inline-block;
        padding: 10rpx 15rpx;
        margin-left: 20rpx;
        &:active {
          background-color: rgba($color: #000000, $alpha: 0.1);
          opacity: 0.6;
        }
      }
    }
    .scroll {
      height: calc(100% - #{$panelHeight});
      width: 100%;
      padding-bottom: 200rpx;
    }
    .addSecondComment {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100vw;
      padding: 30rpx 23rpx;
      background-color: #ffffff;
      border-top: #dddddd solid 1rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .input {
        flex: 1;
        height: 65rpx;
        background-color: #f5f5f5;
        overflow: hidden;
        border-radius: 200rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 28rpx;

        &-el {
          width: 100%;
          height: 100%;
        }
      }

      .submit {
        margin-left: 30rpx;
      }
    }
  }
}
</style>