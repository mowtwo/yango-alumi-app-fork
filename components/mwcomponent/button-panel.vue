<template>
  <view class="panel"> 
    <view class="group">
      <view class="button" v-for="(item,index) in buttons" :key="index" @click="buttonClickHandle(index,!!item.active)">
        <image class="icon" v-if="!!item.icon"  :src="!!item.active?(!!item.activeIcon?item.activeIcon:item.icon):item.icon" mode="widthFix"></image>
        <view class="value" :style="{
          color:!!item.active?(!!item.activeColor?item.activeColor:'#2BD199'):item.color
        }">
          {{item.value}}
        </view>
      </view>
    </view>
    <view class="slot">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    buttons: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    buttonClickHandle(index, active) {
      this.$emit("buttons-click", {
        index,
        active,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row nowrap;
  height: 80rpx;
  // background-color: #ffffff;
  .group {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: left;
    flex-flow: row nowrap;
    .button {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      &:not(:first-child) {
        margin-left: 80rpx;
      }
      .icon {
        width: 38rpx;
      }
      .value {
        font-size: 24rpx;
        font-weight: bold;
        color: #999999;
        margin-left: 12rpx;
      }
    }
  }
}
</style>