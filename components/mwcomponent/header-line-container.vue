<template>
  <view class="container">
    <view class="header">
      <header-line
        :uname="uname"
        :avator="avator"
        :right-text="avatorRightText"
        :right-active-text="avatorRightActiveText"
        :right-active="avatorRightActive"
        :default-avator-color="defaultAvatorColor"
        :avator-border-color="avatorBorderColor"
        @click="hlClickHandle"
        @avator-click="hlAvatorClickHandle"
        @uname-click="hlUnameClickHandle"
        @more-click="hlMoreClickHandle"
      >
        <view class="tags">
          <template v-for="(item, index) in tags">
            <view v-if="isStringTag(item)" class="tag" :key="index">
              {{ item }}
            </view>
            <view
              v-else-if="isCapsuleTag(item)"
              class="tag capsule"
              :key="index"
              :style="{
                backgroundColor: item.capsuleColor,
                color: item.textColor ? item.textColor : '#ffffff',
              }"
            >
              {{ item.text }}
            </view>
            <view
              v-else-if="isColorItemTag(item)"
              class="tag"
              :style="{
                color: item.color,
              }"
              :key="index"
            >
              {{ item.text }}
            </view>
          </template>
        </view>
      </header-line>
    </view>
    <view class="body">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import HeaderLine from "@/components/mwcomponent/header-line";
export default {
  components: {
    HeaderLine,
  },
  props: {
    // header-line 属性
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    uname: {
      type: String,
    },
    avator: {
      type: String,
    },
    avatorRightText: {
      type: String,
      default: "",
    },
    avatorRightActiveText: String,
    avatorRightActive: {
      type: Boolean,
      default: false,
    },
    defaultAvatorColor: {
      type: String,
      default: "#31D7A3",
    },
    avatorBorderColor: {
      type: String,
      default: "#31D7A3",
    },
  },
  methods: {
    isStringTag(item) {
      return typeof item === "string";
    },
    isColorItemTag(item) {
      if (typeof item === "object") {
        return "color" in item;
      }
      return false;
    },
    isCapsuleTag(item) {
      if (typeof item === "object") {
        return "capsuleColor" in item;
      }
      return false;
    },
    //绑定所有事件
    hlClickHandle(options) {
      this.$emit("hl-click", options);
    },
    hlAvatorClickHandle(options) {
      this.$emit("hl-avator-click", options);
    },
    hlUnameClickHandle(options) {
      this.$emit("hl-uname-click", options);
    },
    hlMoreClickHandle(options) {
      this.$emit("hl-more-click", options);
    },
    //tag
    tagClickHandle(fn, item, index) {
      // console.log("click tag");
      if (typeof fn === "function") {
        fn(item, index);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0 30rpx;
  .tags {
    display: flex;
    flex-flow: nowrap row;
    align-items: center;
    // justify-content: center;
    .tag {
      font-size: 20rpx;
      color: #babcc9;
      font-weight: bold;
      &:not(:last-child)::after {
        content: "|";
        color: #babcc9;
      }
      &.capsule {
        display: inline-block;
        padding: 3rpx 10rpx;
        border-radius: 9999rem;
        margin: 0 8rpx;
        &:not(:last-child)::after {
          content: "";
        }
        // color: #ffa928;
      }
    }
  }
}
.body {
  padding: 0 30rpx;
  margin-top: 22rpx;
}
</style>