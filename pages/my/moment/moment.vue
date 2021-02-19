<template>
  <view class="moment">
    <color-title-container title="全部动态">
      <view class="body">
        <view class="item" v-for="(item, index) of moments" :key="index">
          <navigator
            :url="`../../moment/detail/detail?id=${item.id}`"
            class="title"
          >
            <text>
              {{
                item.title === ""
                  ? item.content === ""
                    ? "分享动态"
                    : item.content
                  : item.title
              }}
            </text>
          </navigator>
          <view
            class="del"
            hover-class="button"
            @click.stop="delClickHandle(index, item.id)"
          >
            删除
          </view>
        </view>
      </view>
    </color-title-container>
  </view>
</template>

<script>
import ColorTitleContainer from "@/components/mwcomponent/color-title-container";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  components: {
    ColorTitleContainer,
  },
  data() {
    return {
      limit: 20,
      page: 0,
      moments: [],
    };
  },
  async onShow() {
    console.log('shoul',this.shoulInitMomentPage)
    if (this.shoulInitMomentPage) {
      console.log('re-request')
      // this.limit = 0
      this.page = 0;
      this.moments = [];
      await this.getNewMoment();
    }
  },
  async onReady() {
    await this.getNewMoment();
  },
  async onReachBottom() {
    const that = this;
    await that.getNewMoment();
  },
  computed: {
    ...mapGetters(["getUid"]),
    ...mapState(["shoulInitMomentPage"]),
  },
  methods: {
    ...mapMutations(["setShouldInitMomentPage"]),
    async getNewMoment() {
      const momentsRes = await this.request({
        url: `${this._config.nestServerUrl}/api/moment/my?limit=${
          this.limit
        }&page=${this.page++}`,
        method: "GET",
      });
      this.moments.push(...momentsRes.data);
    },
    delClickHandle(index, id) {
      const that = this;
      uni.showModal({
        title: "是否删除",
        content: "删除后无法恢复",
        async success(res) {
          if (res.confirm) {
            const delId = await that.request({
              url: `${that._config.nestServerUrl}/api/moment/delete`,
              method: "POST",
              data: {
                id,
              },
            });
            that.setShouldInitMomentPage({ shoulInitMomentPage: true });
            that.moments.splice(index, 1);
          }
        },
      });
    },
  },
};
</script>

<style>
page {
  background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
.moment {
  margin-top: 20rpx;
  padding-bottom: 50rpx;
  .item {
    display: flex;

    .title {
      flex: 1;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 30rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      // justify-content: center;
      //   font-weight: bold;
    }
    .del {
      padding: 10rpx 30rpx;
      color: #ff583b;
      display: flex;
      align-items: center;
      justify-content: center;
      &.button {
        opacity: 0.6;
        background-color: rgba($color: #000000, $alpha: 0.05);
      }
    }
  }
}
</style>