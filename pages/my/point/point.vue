<template>
  <view class="point">
    <view class="head">
      <view class="show"
        >拥有积分：<text class="number">{{
          point > 999999 ? "999999+" : point
        }}</text
        >分</view
      >
      <navigator url="./history/history" class="get-more">积分历史</navigator>
    </view>
    <color-title-container title="日常任务">
      <option-group>
        <link-item
          title="每日签到+30"
          :description="signed ? '已签到' : '未签到'"
          url="./sign"
        ></link-item>
      </option-group>
    </color-title-container>
    <color-title-container title="特别任务"> </color-title-container>
  </view>
</template>

<script>
import colorTitleContainer from "@/components/mwcomponent/color-title-container.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("RewardPoint");
import LinkItem from "@/components/mwcomponent/options/link-item.vue";
import OptionGroup from "@/components/mwcomponent/options/option-group.vue";
export default {
  components: { colorTitleContainer, LinkItem, OptionGroup },
  computed: {
    ...mapState(["point", "signed"]),
  },
  methods: {
    ...mapMutations({
      updatePoint: "update",
    }),
  },
  async onShow() {
    const that = this;
    //获取最新的积分数
    const pointRes = await this.request({
      url: `${this._config.nestServerUrl}/api/point/point`,
      method: "GET",
    });
    const pointData = pointRes.data.data;
    const point = pointData.point;
    that.updatePoint({ point });
  },
};
</script>

<style lang="scss" scoped>
.point {
  .head {
    background-color: #31d7a3;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 0;
    .show {
      font-size: 30rpx;
      margin-left: 25rpx;
      .number {
        font-size: 50rpx;
      }
    }
    .get-more {
      font-size: 30rpx;
      margin-right: 25rpx;
    }
  }
}
</style>