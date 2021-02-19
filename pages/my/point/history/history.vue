<template>
  <view class="history">
    <view class="list">
      <view class="item" v-for="(item, index) of list" :key="index">
        <view class="time"> {{ parseDateToStr(item.createdAt) }} </view>
        <view class="content">
          <view class="mod"> {{ item.updateModContent }} </view>
          <view class="point"
            >{{ updateModMap[item.updateMod] }}{{ item.point }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      limit: 30,
      page: 0,
      updateModMap: ["+", "-"],
      list: [
        {
          createAt: "2020-10-30 15:22:10",
          updateModContent: "每日签到",
          updateMod: 0,
          point: 15,
        },
      ],
    };
  },
  async onShow() {
    const historyRes = await this.request({
      url: `${this._config.nestServerUrl}/api/point/history?limit=${
        this.limit
      }&page=${this.page++}`,
      method: "GET",
    });
    const data = historyRes.data.data;
    // console.log(historyRes.data.data);
    this.list = data.historyList;
  },
};
</script>

<style lang="scss" scoped>
.history {
  .list {
    padding: 30rpx;
    .item {
      width: 100%;
      height: 186rpx;
      background-color: #fff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      display: flex;
      flex-flow: nowrap column;
      justify-content: center;
      padding: 24rpx;
      .time {
        color: #bababa;
        font-size: 20rpx;
        margin-bottom: 21rpx;
      }
      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .mod {
          font-size: 32rpx;
        }
        .point {
          font-size: 28rpx;
          color: #999999;
        }
      }
    }
  }
}
</style>