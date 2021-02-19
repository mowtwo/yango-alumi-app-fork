<template>
  <view class="input">
    <input
      class="el"
      :placeholder="placeholder"
      @input="changeIt"
      v-model="value"
      :maxlength="maxlength"
    />
    <cover-view
      class="clear-button"
      v-if="value !== '' && clear"
      @click="clearValue"
      >取消</cover-view
    >
  </view>
</template>

<script>
export default {
  props: {
    placeholder: String,
    throttle: {
      type: Boolean,
      default: false,
    },
    throttleDuration: {
      type: Number,
      default: 200,
    },
    clear: {
      type: Boolean,
      default: true,
    },
    maxlength: {
      type: Number,
      default: 20,
    },
    currentValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      throttleTimer: -1,
      value: "",
    };
  },
  methods: {
    clearValue() {
      // console.log("clear");
      this.value = "";
      this.$emit("clear");
    },
    changeIt({ detail: { value } }) {
      if (this.throttle) {
        clearTimeout(this.throttleTimer);
        this.throttleTimer = setTimeout(() => {
          this.$emit("change", {
            value,
          });
        }, this.throttleDuration);
      } else {
        this.$emit("change", {
          value,
        });
      }
    },
  },
  watch: {
    currentValue(n, o) {
      // console.log(o,n)
      if (n !== "") {
        this.value = n;
        this.$emit("change", {
          value: this.value,
        });
      }
    },
  },
  mounted() {
    if (this.currentValue !== "") {
      this.value = this.currentValue;
      this.$emit("change", {
        value: this.value,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.input {
  $bgColor: #31d7a3;
  width: 100vw;
  background-color: $bgColor;
  padding: 30rpx 40rpx;
  position: relative;
  .el {
    background-color: #ffffff;
    font-size: 30rpx;
    border-radius: 200rpx;
    padding: 0rpx 70rpx 0rpx 40rpx;
    height: 50rpx;
  }
  .clear-button {
    $size: 36rpx;
    color: #ffffff;
    background-color: #575757;
    opacity: 0.6;
    font-size: $size - 10rpx;
    overflow: hidden;
    display: inline-block;
    padding: 5rpx 8rpx;
    border-radius: 200rpx;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 50rpx;
  }
}
</style>
