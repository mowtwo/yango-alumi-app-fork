<template>
  <view class="hot-moment">
    <view class="head">
      <view class="container">
        <view class="line big-title">
          圈子：<text class="text">{{ title }}</text>
        </view>
        <view class="line user create-user">
          创建者：<text class="text">{{ createUser }}</text>
        </view>
        <view class="line time create-time">
          创建时间：<text class="text">{{ createTime }}</text>
        </view>
        <view class="line time update-time">
          最后话题时间：<text class="text">{{ updateTime }}</text>
        </view>
        <view class="line count">
          动态数：<text class="text">{{ count }}</text>
        </view>
      </view>
    </view>
    <template v-if="showEmpty">
      <empty-block title="动态不见了"></empty-block>
    </template>
    <template v-else>
      <view class="circle">
        <color-title-container title="全部动态">
          <view class="body" v-if="showBody">
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
              >
                <view class="article">
                  <navigator
                    class="text"
                    :url="`../detail/detail?id=${item.id}`"
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
                      <video :src="item.videos[0]" controls></video>
                    </view>
                  </navigator>
                  <view class="ctrl">
                    <button-panel>
                      <view class="created-at">
                        {{ parseDateToStr(item.createdAt) }}
                      </view>
                    </button-panel>
                  </view>
                </view>
              </header-line-container>
            </view>
          </view>
          <view class="no-moments" v-else>
            <!-- TODO
          - 添加占位图
           -->
          </view>
        </color-title-container>
      </view>
      <view class="loading">
        {{ loading ? "正在加载更多..." : "暂无更多" }}</view
      >
    </template>
  </view>
</template>

<script>
import ColorTitleContainer from "@/components/mwcomponent/color-title-container";
import TripImgGrid from "@/components/mwcomponent/trip-img-grid";
import ButtonPanel from "@/components/mwcomponent/button-panel";
import HeaderLineContainer from "@/components/mwcomponent/header-line-container";
import { mapState, mapMutations } from "vuex";
import EmptyBlock from "@/components/mwcomponent/empty-block.vue";
export default {
  components: {
    ColorTitleContainer,
    TripImgGrid,
    ButtonPanel,
    HeaderLineContainer,
    EmptyBlock,
  },
  computed: {
    ...mapState(["likes", "attentions", "watchs"]),
    showEmpty() {
      return this.moments.length <= 0;
    },
    createTime() {
      if (this.info.createAt) {
        return this.parseDateToStr(this.info.createAt);
      }
      return this.parseDateToStr(new Date());
    },
    updateTime() {
      if (this.info.lastMomentCreateAt) {
        return this.parseDateToStr(this.info.lastMomentCreateAt);
      }
      return this.parseDateToStr(new Date());
    },
    count() {
      if (this.info.count) {
        const c = this.info.count;
        if (c > 99999) {
          return "99999+";
        }
        return c;
      }
      return 0;
    },
    createUser() {
      if (this.info.createUser) {
        if (this.info.createUser.nickname) {
          return this.info.createUser.nickname;
        }
      }
      return "创建者的信息丢失在了时空裂缝中...";
    },
    showBody() {
      return this.moments.length > 0;
    },
  },
  data() {
    return {
      timeSilceLength: 19,
      id: -1,
      title: "",
      info: {},
      // createTime: new Date().toISOString().substring(0, 10),
      // updateTime: new Date().toISOString().substring(0, 10),
      // count: 1000,
      moments: [],
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
    };
  },
  async onLoad({ id, name }) {
    this.title = name;
    this.id = id;
    await this.getTagInfo();
    await this.getNewMoment();
  },
  async onReachBottom() {
    const that = this;
    await that.getNewMoment();
  },
  async onShow() {},
  methods: {
    ...mapMutations([
      "addLike",
      "delLike",
      "addAtt",
      "delAtt",
      "addWatch",
      "delWatch",
      "setShouldInitMomentPage",
    ]),
    async getTagInfo() {
      const tagRes = await this.request({
        url: `${this._config.nestServerUrl}/api/tags/info?id=${this.id}`,
        method: "GET",
      });
      const data = tagRes.data.data;
      this.info = data.tag;
    },
    isAttention(uid) {
      return this.attentions.includes(uid);
    },
    async getNewMoment() {
      const that = this;
      if (!that.loading) {
        that.loading = true;
        try {
          const momentsRes = await this.request({
            url: `${
              this._config.nestServerUrl
            }/api/moment/getAllMomentAndUserWithTag?limit=${
              that.limit
            }&page=${that.page++}&tid=${that.id}`,
            method: "GET",
          });
          that.moments.push(
            ...momentsRes.data.data.map((a) => {
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
            })
          );
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
    async hlMoreClick(index, options) {
      const aid = this.moments[index].user.id;
      const mid = this.moments[index].id;
      const isMe = this.moments[index].isMe;
      if (isMe) {
        await this.hlDelClick(mid, index);
      } else {
        console.log(aid);
        console.log(options);
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
            that.setShouldInitMomentPage({
              shouldInitMomentPage: true,
            });
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
.hot-moment {
  .head {
    $height: 300rpx;
    position: relative;
    width: 100vw;
    height: $height;
    display: flex;
    &::before {
      content: "";
      position: absolute;
      height: calc(100% / 2);
      width: 100%;
      background-color: #31d7a3;
    }

    .container {
      width: calc(100% - 30rpx);
      height: 100%;
      margin: 0 auto;
      background-color: #ffffff;
      position: relative;
      box-shadow: 3px 4px 32px rgba(4, 0, 0, 0.08);
      padding: 20rpx 35rpx;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      flex-flow: column nowrap;
      .line {
        margin-bottom: 10rpx;
      }
      .big-title {
        font-size: 40rpx;
        font-weight: bold;
        color: #353535;
      }

      .user {
        font-size: 28rpx;
        color: #333333;
        .text {
          font-weight: bold;
          color: #666666;
        }
      }

      .time {
        font-size: 26rpx;
        color: #666666;
      }

      .count {
        font-size: 24rpx;
        color: #b9b9b9;
      }
    }
  }
}
.circle {
  margin-top: 54rpx;
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
</style>
