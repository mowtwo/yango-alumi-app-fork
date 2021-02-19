<template>
  <view class="funs">
    <color-title-container title="普通分组">
      <view class="list" v-if="showList">
        <navigator
          :url="`./info/info?id=${item.id}`" v-for="(item, index) of funs" :key="index">
          <header-line-container
            :uname="item.nickname"
            :avator="item.avatar"
            :avator-right-text="true ? '' : ''"
            :avator-right-active-text="true ? '' : ''"
            @hl-more-click="hlMoreClick(index, $event)"
          >
          </header-line-container>
        </navigator>
      </view>
      <view class="tip" v-else> 暂时没有人关注你哦！ </view>
    </color-title-container>
  </view>
</template>

<script>
import ColorTitleContainer from "@/components/mwcomponent/color-title-container";
import HeaderLineContainer from "@/components/mwcomponent/header-line-container";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    ColorTitleContainer,
    HeaderLineContainer,
  },
  data() {
    return {
      funs: [],
      limit: 20,
      page: 0,
    };
  },
  computed: {
    showList() {
      return this.funs.length > 0;
      //   return false;
    },
  },
  methods: {
    hlMoreClick() {},
    async getNewFuns() {
      const that = this;
      try {
        const funsRes = await this.request({
          url: `${this._config.nestServerUrl}/api/attention/funs?limit=${
            that.limit
          }&page=${that.page++}`,
          method: "GET",
        });
        const data = funsRes.data.data;
        const funs = data.funs;
        that.funs.push(...funs);
      } catch (err) {
        console.log(err);
        uni.showToast({
          title: "等等再刷新",
        });
      }
    },
  },
  async onLoad() {
    this.page = 0;
    await this.getNewFuns();
  },
  async onReachBottom() {
    await this.getNewFuns();
  },
};
</script>

<style lang="scss" scoped>
.tip {
  color: #babcc9;
  text-align: center;
}
</style>
