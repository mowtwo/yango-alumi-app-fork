<template>
  <view class="follow">
    <color-title-container title="普通分组">
      <view class="list" v-if="showList">
        <navigator
          :url="`./info/info?id=${item.id}`"
          v-for="(item, index) of follows"
          :key="index"
        >
          <header-line-container
            :uname="item.nickname"
            :avator="item.avatar"
            :avator-right-active="item.att"
            avator-right-text="关注"
            avator-right-active-text="取消关注"
            @hl-more-click="hlMoreClick(index, $event)"
          >
          </header-line-container>
        </navigator>
      </view>
      <view class="tip" v-else> 暂时没有关注任何人哦！ </view>
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
      follows: [],
      limit: 20,
      page: 0,
    };
  },
  computed: {
    ...mapState(["attentions"]),
    showList() {
      return this.follows.length > 0;
      //   return false;
    },
  },
  methods: {
    ...mapMutations(["delAtt", "addAtt"]),
    async hlMoreClick(index, options) {
      const temp = this.follows;
      const aid = temp[index].id;
      const resId = await this.request({
        url: `${this._config.nestServerUrl}/api/users/set-attention`,
        method: "POST",
        data: {
          aid,
          att: !options.active,
        },
      });
      if (options.active) {
        this.delAtt({ uid: aid });
      } else {
        this.addAtt({ uid: aid });
      }
      temp[index].att = !options.active;
      this.follows = temp;
    },
    async getNewFollow() {
      const that = this;
      try {
        const followRes = await this.request({
          url: `${this._config.nestServerUrl}/api/attention/follow?limit=${
            that.limit
          }&page=${that.page++}`,
          method: "GET",
        });
        const data = followRes.data.data;
        const follows = data.follows;
        that.follows.push(
          ...follows.map((obj) => {
            obj.att = true;
            return obj;
          })
        );
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
    await this.getNewFollow();
  },
  async onReachBottom() {
    await this.getNewFollow();
  },
};
</script>

<style lang="scss" scoped>
.tip {
  color: #babcc9;
  text-align: center;
}
</style>
