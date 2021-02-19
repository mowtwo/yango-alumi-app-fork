<template>
  <view class="moment">
    <!-- <view class="menu">
      <navigator
        :url="item.url"
        v-for="(item, index) in menu"
        :key="index"
        class="item"
      >
        <image class="icon" :src="item.icon" mode="aspectFit"></image>
        <view class="text">
          {{ item.text }}
        </view>
      </navigator>
    </view> -->
    <view class="hot-circle">
      <color-title-container title="热门话题">
        <view class="body">
          <scroll-view :scroll-x="true" class="panels">
            <template v-if="panels.length > 0">
              <navigator
                v-for="(item, index) in panels"
                :key="index"
                class="panel"
                :url="`./for_tag/for_tag?id=${item.id}&name=${item.name}`"
              >
                <color-panel :background="item.background" :html="item.html" />
              </navigator>
            </template>
            <view
              :style="{
                fontSize: '26rpx',
                color: '#aaa',
                paddingLeft: '30rpx',
              }"
              v-else
            >
              今日暂无热门话题
            </view>
          </scroll-view>
          <view class="news">
            <scroll-capsule :list="list" />
          </view>
        </view>
      </color-title-container>
    </view>

    <view class="hot-article">
      <color-title-container title="最新动态">
        <view class="move-nav">
          <move-nav :tabs="mTabs" @change="tabChange"></move-nav>
        </view>
        <template v-if="showEmptyBlock">
          <view class="empty-block">
            <empty-block title="还没有动态"></empty-block>
          </view>
        </template>
        <template v-else>
          <view class="body">
            <view class="item" v-for="(item, index) of moments" :key="index">
              <header-line-container
                :uname="`${item.isAnonymous ? '匿名' : item.user.nickname}${
                  item.isMe ? '(我)' : ''
                }`"
                :avator="item.isAnonymous ? anonymousHeader : item.user.avatar"
                :avator-right-active="isAttention(item.uid)"
                :avator-right-text="
                  item.isMe ? '删除' : item.isAnonymous ? '' : '关注'
                "
                :avator-right-active-text="item.isMe ? '' : '取消关注'"
                @hl-more-click="hlMoreClick(index, $event)"
                :tags="
                  item.user.showRealName &&
                  !item.isAnonymous &&
                  item.user.realname
                    ? ['实名认证：' + item.user.realname]
                    : []
                "
              >
                <view class="article">
                  <navigator
                    class="text"
                    :url="`./detail/detail?id=${item.id}`"
                    @click="
                      setSubMomentIndex({
                        subMomentIndex: index,
                      })
                    "
                  >
                    <view class="title">
                      {{ item.title || "发布了一个动态" }}
                    </view>
                    <view class="content">
                      <text class="wrap">
                        <text v-if="item.tags.length > 0" class="tags">{{
                          item.tags.map((v) => `#${v}`).join(" ")
                        }}</text>
                        {{ item.content }}
                      </text>
                    </view>

                    <view class="images" v-if="item.imgs.length > 0">
                      <trip-img-grid :images="item.imgs" />
                    </view>

                    <view class="videos" v-if="item.videos.length > 0">
                      <video :src="item.videos[0]" controls @click.stop></video>
                    </view>
                  </navigator>
                  <view class="ctrl">
                    <button-panel
                      :buttons="item.buttons"
                      @buttons-click="btnsClick(index, $event)"
                    >
                      <view class="created-at">
                        {{ parseDateToStr(item.createdAt) }}
                      </view>
                    </button-panel>
                  </view>
                </view>
              </header-line-container>
            </view>
          </view>
        </template>
      </color-title-container>
    </view>
    <view class="loading"> {{ loading ? "正在加载更多..." : "暂无更多" }}</view>

    <template v-if="authUserCanUse">
      <view class="new">
        <view class="mask" v-if="showSelectNewType" @click="hideMask">
          <view class="button" @click.stop="navNew('video')"> 视频 </view>
          <view class="button" @click.stop="navNew('new')"> 图文 </view>
        </view>
        <view class="button" @click="selectNewType" v-if="!showSelectNewType">
          发布
        </view>
      </view>
    </template>
    <template v-else>
      <view class="new">
        <view class="button" @click="authAgain">{{ "立即认证" }}</view>
      </view>
    </template>
    <register ref="register"></register>
  </view>
</template>

<script>
import ColorTitleContainer from "@/components/mwcomponent/color-title-container";
import ColorPanel from "@/components/mwcomponent/color-panel";
import ScrollCapsule from "@/components/mwcomponent/scroll-capsule";
import HeaderLineContainer from "@/components/mwcomponent/header-line-container";
import TripImgGrid from "@/components/mwcomponent/trip-img-grid";
import ButtonPanel from "@/components/mwcomponent/button-panel";
import { mapState, mapMutations } from "vuex";
import { timeGap } from "@/utils/timeGap";
import EmptyBlock from "@/components/mwcomponent/empty-block.vue";
import MoveNav from "@/components/mwcomponent/move-nav.vue";
import register from "@/components/register/register.vue";
export default {
  components: {
    ColorTitleContainer,
    ColorPanel,
    ScrollCapsule,
    HeaderLineContainer,
    TripImgGrid,
    ButtonPanel,
    EmptyBlock,
    MoveNav,
    register,
  },
  data() {
    return {
      authUserCanUse: true,
      momentTypes: [
        {
          key: "all",
          value: "推荐",
        },
        {
          key: "attention",
          value: "关注",
        },
      ],
      nowMomentTypeIndex: 0,
      likeTimer: -1,
      attTimer: -1,
      anonymousHeader: require("@/static/moment/anonymous.jpg"),
      loading: false,
      showSelectNewType: false,
      page: 0,
      limit: 8,
      buttonIcons: {
        liked: require("@/static/moment/liked.png"),
        unLike: require("@/static/moment/unlike.png"),
        message: require("@/static/moment/message.png"),
        browse: require("@/static/moment/look.png"),
      },
      buttons: [
        {
          icon: require("@/static/moment/look.png"),
          value: 520,
        },
        {
          icon: require("@/static/moment/message.png"),
          value: 343,
        },
        {
          icon: require("@/static/moment/unlike.png"),
          value: 123,
          active: true,
          activeIcon: require("@/static/moment/liked.png"),
        },
      ],
      images: [
        "http://172.20.10.3:8000/images/img.mowtest.png",
        "http://172.20.10.3:8000/images/img.mowtest.png",
        "http://172.20.10.3:8000/images/img.mowtest.png",
      ],
      tags: [
        "2019级新生",
        {
          text: "VIP",
          capsuleColor: "red",
          textColor: "#ffa928",
        },
        {
          text: "金牌合伙人",
          color: "#CE9178",
        },
      ],
      menu: [
        {
          icon: require("@/static/moment/ic_circle_follow.png"),
          text: "我的关注",
        },
        {
          icon: require("@/static/moment/ic_circle_lost.png"),
          text: "失物招领",
        },
        {
          icon: require("@/static/moment/ic_circle_notice.png"),
          text: "跳蚤市场",
        },
        {
          icon: require("@/static/moment/ic_circle_store.png"),
          text: "校园喜报",
        },
      ],
      panels: [],
      panelsModel: [
        {
          background: ["#FFCF17", "#FFAE1F"],
          html: (title, value) => `
            <div style="color:#fff;">
              <div style="font-size:14px">#${title}</div>
              <div style="font-size:14px"><div style="font-size:21px;display:inline-block;">${value}</div>人在讨论中</div>
            </div>
          `,
        },
        {
          background: ["#629EF7", "#326BF5"],
          html: (title, value) => `
            <div style="color:#fff;">
              <div style="font-size:14px">#${title}</div>
              <div style="font-size:14px"><div style="font-size:21px;display:inline-block;">${value}</div>人在讨论中</div>
            </div>
          `,
        },
        {
          background: ["#EF9158", "#EF955F"],
          html: (title, value) => `
            <div style="color:#fff;">
              <div style="font-size:14px">#${title}</div>
              <div style="font-size:14px"><div style="font-size:21px;display:inline-block;">${value}</div>人在讨论中</div>
            </div>
          `,
        },
        {
          background: ["#2BD199", "#01A35A"],
          html: (title, value) => `
            <div style="color:#fff;">
              <div style="font-size:14px">#${title}</div>
              <div style="font-size:14px"><div style="font-size:21px;display:inline-block;">${value}</div>人在讨论中</div>
            </div>
          `,
        },
        {
          background: ["#8E75FF", "#2300c3"],
          html: (title, value) => `
            <div style="color:#fff;">
              <div style="font-size:14px">#${title}</div>
              <div style="font-size:14px"><div style="font-size:21px;display:inline-block;">${value}</div>人在讨论中</div>
            </div>
          `,
        },
      ],
      list: [
        {
          html:
            '<span style="font-size: 14px;">校友<span style="color: #D40000">快报:</span></span> | <span style="color:#666666;font-size: 12px;">欢迎使用本小程序</span>',
        },
      ],
      articles: [],
      userCancel: false,
    };
  },
  async onShow() {
    const that = this;
    // 获取热门话题
    const hotTagsRes = await that.request({
      url: `${this._config.nestServerUrl}/api/moment-tags/hot?limit=5`,
      method: "GET",
    });
    if (hotTagsRes.statusCode === 401) {
      this.authUserCanUse = false;
      this.setShouldInitMomentPage({ shoulInitMomentPage: true });
      uni.switchTab({
        url: "../index/index",
      });
      return;
    }
    if (hotTagsRes.statusCode === 405) {
      this.authUserCanUse = false;
      this.$refs.register.show({
        cancel: () => {
          this.userCancel = true;
        },
      });
      return;
    }
    // console.log(hotTagsRes);
    const hotTags = hotTagsRes.data.data;
    const panels = [];
    // console.log("hot tag", hotTags);
    for (const i in hotTags) {
      const tag = hotTags[i];
      panels[i] = {
        background: that.panelsModel[i].background,
        html: that.panelsModel[i].html(tag.name, tag.count),
        id: tag.tid,
        name: tag.name,
        count: tag.count,
      };
    }
    that.panels = panels;

    if (that.shoulInitMomentPage) {
      that.setShouldInitMomentPage({ shoulInitMomentPage: false });
      that.initMomentPage();
      await that.getNewMoment();
    }

    this.updateAllMoments();
  },
  async onLoad() {
    // console.log(timeGap(new Date(2020, 4, 5), new Date(2020, 6, 5)));
    const that = this;

    await that.getNewMoment();
  },
  async onReachBottom() {
    const that = this;
    await that.getNewMoment();
  },
  async onPullDownRefresh() {
    this.initMomentPage();
    await this.getNewMoment();
    uni.stopPullDownRefresh();
  },
  computed: {
    ...mapState([
      "moments",
      "momentPage",
      "likes",
      "attentions",
      "shoulInitMomentPage",
      "watchs",
    ]),
    mTabs() {
      return this.momentTypes.map(({ value }) => value);
    },
    showEmptyBlock() {
      return this.moments.length <= 0;
    },
  },
  methods: {
    ...mapMutations([
      "addLike",
      "delLike",
      "addAtt",
      "delAtt",
      "addWatch",
      "delWatch",
      "pushMoment",
      "incMomentPage",
      "clearMomentPage",
      "updateAllMoments",
      "setSubMomentIndex",
      "delMoment",
      "initMomentPage",
      "setShouldInitMomentPage",
    ]),
    authAgain() {
      uni.navigateTo({
        url: "/pages/register/register",
      });
    },
    async tabChange({ index }) {
      this.nowMomentTypeIndex = index;
      this.initMomentPage();
      await this.getNewMoment();
    },
    isAttention(uid) {
      return this.attentions.includes(uid);
    },
    async getNewMoment() {
      const that = this;
      if (!that.loading) {
        that.loading = true;
        try {
          let requestUrl = `${this._config.nestServerUrl}/api/moment/getAllMomentAndUser`;
          if (this.nowMomentTypeIndex === 1) {
            requestUrl = `${this._config.nestServerUrl}/api/moment/getAllAttentionMomentAndUser`;
          }
          const momentsRes = await this.request({
            url: `${requestUrl}?limit=${that.limit}&page=${that.momentPage}`,
            method: "GET",
          });
          if (momentsRes.statusCode === 405 || momentsRes.statusCode === 401) {
            this.authUserCanUse = false;
            return;
          }
          that.incMomentPage();
          that.pushMoment({
            moment: momentsRes.data.data.results.map((a) => {
              if (a.attention) {
                that.addAtt({ uid: a.uid });
              }
              if (a.liked) {
                that.addLike({ mid: a.id });
              }

              a.imgs = a.imgs === "" ? [] : JSON.parse(a.imgs);
              a.videos = a.videos === "" ? [] : JSON.parse(a.videos);
              a.buttons = [
                {
                  icon: that.buttonIcons.browse,
                  value: a.browse,
                },
                {
                  icon: that.buttonIcons.message,
                  value: a.commentCount,
                },
                {
                  icon: that.buttonIcons.unLike,
                  value: a.likedCount,
                  active: a.liked,
                  activeIcon: that.buttonIcons.liked,
                },
              ];
              return a;
            }),
          });
          //console.log(that.moments);
        } catch (err) {
          console.log(err);
          uni.showToast({
            title: "等等再刷新",
          });
        } finally {
          this.loading = false;
        }
      }
    },
    navNew(type) {
      uni.navigateTo({
        url: "./new/" + type,
      });
      this.hideMask();
    },
    hideMask() {
      this.showSelectNewType = false;
    },
    selectNewType() {
      this.showSelectNewType = true;
    },
    async btnsClick(index, options) {
      const { index: btnIndex, active } = options;
      if (btnIndex === 2) {
        if (this.likeTimer >= 0) {
          uni.showToast({
            title: "不要点击太快",
          });
        }
        clearTimeout(this.likeTimer);
        this.likeTimer = setTimeout(async () => {
          //点赞防抖
          const mid = this.moments[index].id;
          const res = await this.request({
            url: `${this._config.nestServerUrl}/api/moment/set-liked`,
            method: "POST",
            data: {
              mid,
              liked: !active,
            },
          });
          if (res.statusCode === 405 || res.statusCode === 401) {
            this.authUserCanUse = false;
            return;
          }
          if (active) {
            this.delLike({ mid });
            this.moments[index].buttons[btnIndex].value--;
          } else {
            this.addLike({ mid });
            this.moments[index].buttons[btnIndex].value++;
          }
          this.moments[index].buttons[btnIndex].active = this.likes.includes(
            mid
          );
          clearTimeout(this.likeTimer);
          this.likeTimer = -1;
        }, 200);
      }
    },
    async hlMoreClick(index, options) {
      const aid = this.moments[index].user.id;
      const mid = this.moments[index].id;
      const isMe = this.moments[index].isMe;
      if (isMe) {
        await this.hlDelClick(mid, index);
      } else {
        //console.log(aid);
        //console.log(options);
        if (this.attTimer >= 0) {
          uni.showToast({
            title: "慢点操作哦",
          });
        }
        clearTimeout(this.attTimer);
        this.attTimer = setTimeout(async () => {
          // 关注防抖
          const resId = await this.request({
            url: `${this._config.nestServerUrl}/api/users/set-attention`,
            method: "POST",
            data: {
              aid,
              att: !options.active,
            },
          });
          if (resId.statusCode === 405 || resId.statusCode === 401) {
            this.authUserCanUse = false;
            return;
          }
          if (options.active) {
            this.delAtt({ uid: aid });
          } else {
            this.addAtt({ uid: aid });
          }
          clearTimeout(this.attTimer);
          this.attTimer = -1;
        }, 200);
      }
      // console.log(resId)
    },
    async hlDelClick(id, index) {
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
            if (delId.statusCode === 405 || delId.statusCode === 401) {
              this.authUserCanUse = false;
              return;
            }
            that.delMoment(index);
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
scroll-view ::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
</style>
<style lang="scss" scoped>
.menu {
  height: 180rpx;
  box-shadow: rgba(139, 199, 203, 0.17) 0rpx 10rpx 42rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .item {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    padding: 5rpx 10rpx;
    .icon {
      width: 90rpx;
      height: 90rpx;
    }
    .text {
      font-size: 24rpx;
      color: #0b1e2c;
      font-weight: bold;
    }
  }
}
.hot-circle {
  margin-top: 10rpx;
  .body {
    white-space: nowrap;
    .panels {
      .panel {
        display: inline-block;
        margin-left: 30rpx;
        &:last-child {
          margin-right: 30rpx;
        }
      }
    }
  }
  .news {
    width: calc(100% - 60rpx);
    margin: 40rpx auto;
  }
}
.hot-article {
  .body {
    .item {
      padding: 30rpx 0;
      &:not(:last-child) {
        border: #f2f2f2 solid 1rpx;
      }
      .article {
        .text {
          padding: 10rpx;
          .title {
            color: #3b424c;
            font-size: 30rpx;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .content {
            color: #3b424c;
            font-size: 24rpx;
            padding: 10rpx 0 17rpx 0;
            .wrap {
              .tags {
                color: rgb(0, 60, 224);
                margin-right: 10rpx;
              }
            }
          }
        }
        .ctrl {
          margin-top: 24rpx;
        }
      }
    }
  }
}
.loading {
  width: 100vw;
  padding: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #babcc9;
}

@keyframes right-to-show {
  from {
    transform: translateX(100%);
  }
}
.new {
  .mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 9999999;
    background-color: rgba($color: #000000, $alpha: 0.2);
    .button {
      &:nth-child(1) {
        bottom: 30rpx + 120rpx + 20rpx;
      }
    }
  }
  .button {
    animation: right-to-show 0.5s 0s ease 1;
    position: fixed;
    width: 120rpx;
    height: 120rpx;
    border-radius: 100%;
    background-color: #38dda3;
    color: #ffffff;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 30rpx;
    right: 30rpx;
  }
}
.move-nav {
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}
</style>
