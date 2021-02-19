<template>
  <view class="sign">
    <view class="title">
      <image
        class="image"
        mode="aspectFit"
        src="@/static/my/point/sign/banner_date.png"
      />
    </view>
    <view class="show-result">
      <ss-calendar></ss-calendar>
    </view>
  </view>
</template>

<script>
import ssCalendar from "@/components/ss-calendar/ss-calendar.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("RewardPoint");
export default {
  components: { ssCalendar },
  computed: {
    ...mapState(["signed"]),
  },
  methods: {
    ...mapMutations({ signIt: "signIt", updatePoint: "update" }),
  },
  async onShow() {
    if (!this.signed) {
      const signRes = await this.request({
        url: `${this._config.nestServerUrl}/api/point/sign`,
        method: "POST",
      });
      this.signIt();
      const data = signRes.data.data;
      const newPoint = data.signResult;
      if (newPoint) {
        const point = newPoint.point;
        this.updatePoint({ point });
      }
    } else {
      uni.showToast({
        title: "已经签过了",
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.sign {
  .title {
    // display: inline-block;
    width: 100vw;
    height: 430rpx;
    background-color: #31d7a3;
    overflow: hidden;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    .image {
      width: 100%;
      height: 100%;
    }
  }
  .show-result {
    width: calc(100% - 40rpx);
    margin: 0 auto;
    position: relative;
    margin-top: -100rpx;
  }
}
</style>