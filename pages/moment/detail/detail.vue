<template>
  <view>
    <template v-if="!inRendering">
      <view class="body">
        <header-line-container
          :uname="`${item.isAnonymous ? '匿名' : item.user.nickname}${
            item.isMe ? '（我）' : ''
          }`"
          :avator="item.isAnonymous ? anonymousHeader : item.user.avatar"
          :avator-right-active="attentions.includes(item.uid)"
          :avator-right-text="
            item.isMe ? '删除' : item.isAnonymous ? '' : '关注'
          "
          :avator-right-active-text="item.isMe ? '' : '取消关注'"
          @hl-more-click="changeAtt(item.uid, $event)"
          :tags="
            item.user.showRealName && !item.isAnonymous && item.user.realname
              ? ['实名认证：' + item.user.realname]
              : []
          "
        >
          <view class="article">
            <navigator class="text" url="/">
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
            </navigator>
            <view class="images" v-if="item.imgs.length > 0">
              <trip-img-grid :images="item.imgs" />
            </view>
            <view class="videos" v-if="item.videos.length > 0">
              <video :src="item.videos[0]" controls></video>
            </view>
            <view class="ctrl">
              <button-panel :buttons="item.buttons" @buttons-click="btnsClick">
                <view class="created-at">
                  {{ parseDateToStr(item.createdAt) }}
                </view>
              </button-panel>
            </view>
          </view>
        </header-line-container>
      </view>
      <view class="comments">
        <view v-for="(item, index) in comments" :key="index" class="item">
          <header-line-container
            :uname="`${item.user.nickname}${item.isMe ? '（我）' : ''}`"
            :avator="item.user.avatar"
            :avator-right-active="item.attention"
            :avator-right-text="item.isMe ? '' : '关注'"
            avator-right-active-text="取消关注"
            :tags="
              item.user.showRealName && !item.isAnonymous && item.user.realname
                ? ['实名认证：' + item.user.realname]
                : []
            "
          >
            <view class="body">
              <view class="comment">
                {{ item.content }}
              </view>
            </view>
          </header-line-container>
          <view class="second-comment" @click="addSecondComment(index, item)">
            <view class="tip">
              {{
                item.commentCount > 0
                  ? `查看${
                      item.commentCount > 999 ? "999+" : item.commentCount
                    }条回复`
                  : "回复"
              }}
            </view>
            <view class="time created-at">{{
              parseDateToStr(item.createdAt)
            }}</view>
          </view>
        </view>

        <view v-for="(item, index) in ncomments" :key="index" class="item">
          <header-line-container
            :uname="`${item.user.nickname}${item.isMe ? '（我）' : ''}`"
            :avator="item.user.avatar"
            :tags="
              item.user.showRealName && !item.isAnonymous && item.user.realname
                ? ['实名认证：' + item.user.realname]
                : []
            "
          >
            <view class="body">
              <view class="comment">
                {{ item.content }}
              </view>
            </view>
          </header-line-container>
          <view class="second-comment" @click="addSecondComment(index, item)">
            <view class="tip"> 回复 </view>
            <view class="time created-at">{{
              parseDateToStr(item.createdAt)
            }}</view>
          </view>
        </view>
        <view class="splitCmts" v-if="cmtLoading" @click="getNextComment">
          {{ cmtLoading ? "正在加载更多..." : "中间还有更多评论" }}
        </view>
      </view>
      <view class="addComment">
        <view class="input">
          <input
            class="input-el"
            type="text"
            v-model="newComment"
            placeholder="评论"
            cursor-spacing="50"
          />
        </view>
        <button
          type="primary"
          class="submit"
          size="mini"
          :disabled="newComment === ''"
          @click="addComment"
        >
          回复
        </button>
      </view>
      <view class="comment-view" v-if="showCommentView">
        <comment-view
          @close-click="closeClick(showCommentView)"
          @submit="secondCmtSubmit"
          @show="commentViewShow"
          @hide="commentViewHide"
          :bottom-input-placeholder="bottomInputPlaceholder"
          :bottom-input-focus="bottomInputFocus"
        >
          <view class="body" v-if="lookTopCommentIndex >= 0">
            <view class="top-comment">
              <header-line-container
                :uname="`${comments[lookTopCommentIndex].user.nickname}${
                  comments[lookTopCommentIndex].isMe ? '（我）' : ''
                }`"
                :avator="comments[lookTopCommentIndex].user.avatar"
                :tags="
                  item.user.showRealName &&
                  !item.isAnonymous &&
                  item.user.realname
                    ? ['实名认证：' + item.user.realname]
                    : []
                "
              >
                <view class="body">
                  <view
                    class="comment"
                    @click="
                      willAddSecondCommentTo(
                        comments[lookTopCommentIndex],
                        true
                      )
                    "
                  >
                    {{ comments[lookTopCommentIndex].content }}
                  </view>
                </view>
              </header-line-container>
              <view class="tools">
                <view class="time created-at">
                  {{ parseDateToStr(comments[lookTopCommentIndex].createdAt) }}
                </view>
              </view>
            </view>
            <view class="list">
              <view class="title" v-if="secondComments.length > 0">
                {{ secondComments.length }}条回复
              </view>
              <view
                class="item"
                v-for="(item, index) of secondComments"
                :key="index"
                ><header-line-container
                  :uname="`${item.user.nickname}${item.isMe ? '（我）' : ''}`"
                  :avator="item.user.avatar"
                  :tags="
                    item.user.showRealName &&
                    !item.isAnonymous &&
                    item.user.realname
                      ? ['实名认证：' + item.user.realname]
                      : []
                  "
                >
                  <view class="body">
                    <view class="comment" @click="willAddSecondCommentTo(item)">
                      <template v-if="!!item.parent">
                        回复
                        <text class="at-user">
                          @{{ item.parent.user.nickname }}
                        </text>
                        ：
                      </template>
                      {{ item.content }}
                    </view>
                  </view>
                </header-line-container>
                <view class="tools">
                  <view class="time created-at">
                    {{ parseDateToStr(item.createdAt) }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </comment-view>
      </view>
    </template>
    <template v-else>
      <view class="rendering">
        <view class="container">
          <view
            v-for="(item, index) of [1, 2, 3, 4, 5]"
            :key="index"
            :class="['icon', 'icon-' + item]"
          ></view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import HeaderLineContainer from "@/components/mwcomponent/header-line-container";
import TripImgGrid from "@/components/mwcomponent/trip-img-grid";
import ButtonPanel from "@/components/mwcomponent/button-panel";
import CommentView from "@/components/mwcomponent/comment-view";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    HeaderLineContainer,
    TripImgGrid,
    ButtonPanel,
    CommentView,
  },
  computed: {
    ...mapState([
      "likes",
      "attentions",
      "subMomentIndex",
      "moments",
      "userInfo",
    ]),
  },
  data() {
    const dt = new Date();
    return {
      inRendering: true,
      attTimer: -1,
      likeTimer: -1,
      secondComments: [],
      lookTopCommentIndex: -1,
      secondCommentsPage: 0,
      secondCommentsLimit: 30,
      secondCommentsToPid: -1,
      showCommentView: false,
      bottomInputPlaceholder: "",
      bottomInputFocus: false,
      anonymousHeader: require("@/static/moment/anonymous.jpg"),
      item: {
        imgs: [],
        videos: [],
        tags: [],
      },
      buttonIcons: {
        liked: require("@/static/moment/liked.png"),
        unLike: require("@/static/moment/unlike.png"),
        message: require("@/static/moment/message.png"),
        browse: require("@/static/moment/look.png"),
      },
      comments: [],
      ncomments: [],
      commentsPage: 0,
      newComment: "",
      ncmtModel: {
        id: -1,
        uid: -1,
        mid: -1,
        content: "",
        imgs: null,
        videos: null,
        createdAt: dt,
        updatedAt: dt,
        pid: null,
        user: {},
        attention: false,
        isMe: true,
      },
      nscmtModel: {},
      cmtLimit: 10,
      cmtLoading: false,
      openWithCmtPid: -1,
    };
  },
  async onLoad({ id, pid }) {
    if (!(typeof id === "number")) {
      if (!!!id) {
        uni.navigateBack({
          delta: -1,
        });
      }
    }
    pid = Number(pid);
    if (typeof pid === "number") {
      if (pid >= 0) {
        this.openWithCmtPid = pid;
      }
    }
    const that = this;

    // 获取单篇文章
    const res = await this.request({
      url: `${this._config.nestServerUrl}/api/moment/getMomentAndUser?id=${id}`,
      method: "GET",
    });
    const a = res.data.data;
    console.log(a);
    a.imgs = a.imgs === "" ? [] : JSON.parse(a.imgs);
    // a.imgs = [];
    a.videos = a.videos === "" ? [] : JSON.parse(a.videos);
    // a.videos = [];
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
    this.item = a;
    if (a.isDel === 1) {
      uni.showModal({
        title: "文章已被删除",
        content: "去寻找更多动态吧",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            uni.switchTab({
              url: "../moment",
            });
          }
        },
      });
    }
    //获取评论列表
    await that.getNextComment();
    const cmtIds = that.comments.map(({ id }) => id);
    const openWithIndex = cmtIds.indexOf(that.openWithCmtPid);
    if (that.openWithCmtPid >= 0 && openWithIndex >= 0) {
      that.secondCommentsToPid = this.openWithCmtPid;
      that.lookTopCommentIndex = openWithIndex;
      that.openWithCmtPid = -1;
      that.showCommentView = true;
    }
    that.inRendering = false;
  },
  onShow() {},
  async onReachBottom() {
    const that = this;
    await that.getNextComment();
  },
  beforeDestroy() {
    this.setSubMomentIndex({
      subMomentIndex: -1,
    });
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
      "delMoment",
      "getSubMomentIndexWithId",
      "setSubMomentIndex",
      "setShouldInitMomentPage",
    ]),
    async commentViewShow() {
      const that = this;
      if (this.lookTopCommentIndex < 0) {
        return;
      }
      const pcmt = this.comments[this.lookTopCommentIndex];
      that.secondCommentsPage = 0;
      await that.getNextSecondComment(pcmt);
    },

    async getNextSecondComment(pcmt) {
      const that = this;
      const secCmtRes = await this.request({
        url: `${this._config.nestServerUrl}/api/moment/second-comment?mid=${
          this.item.id
        }&ppid=${pcmt.id}&limit=${
          that.secondCommentsLimit
        }&page=${that.secondCommentsPage++}`,
        method: "GET",
      });
      // console.log(secCmtRes.data.data);
      const data = secCmtRes.data.data;
      const comments = data.comments;
      that.secondComments.push(...comments);
    },
    async secondCmtSubmit(options) {
      const that = this;
      const content = options.comment;
      const data = {
        content,
        mid: that.item.id,
        ppid: that.comments[that.lookTopCommentIndex].id,
      };
      if (that.secondCommentsToPid >= 0) {
        data.pid = that.secondCommentsToPid;
      }
      const insertRes = await this.request({
        url: `${this._config.nestServerUrl}/api/moment/second-comment`,
        method: "POST",
        data,
      });
      const resData = insertRes.data.data;
      const newSecondComment = resData.newSecondComment;
      // console.log(newSecondComment);
      that.secondComments.push(newSecondComment);
      that.bottomInputFocus = false;
      that.bottomInputPlaceholder = "";
      that.secondCommentsToPid = -1;
      uni.showToast({
        title: "回复成功",
      });
      // that.initSecondComment();
    },
    addSecondComment(index, item) {
      this.showCommentView = true;
      this.lookTopCommentIndex = index;
    },
    closeClick(active) {
      const that = this;
      this.showCommentView = !active;
      that.initSecondComment();
    },
    commentViewHide() {},
    initSecondComment() {
      const that = this;
      that.secondComments = [];
      that.lookTopCommentIndex = -1;
      that.secondCommentsPage = 0;
      that.secondCommentsToPid = -1;
      that.bottomInputPlaceholder = "";
      that.bottomInputFocus = false;
    },

    async willAddSecondCommentTo(target, isTopComment) {
      const that = this;
      that.bottomInputFocus = false;
      await that.awaitUS(100);
      that.bottomInputFocus = true;
      that.bottomInputPlaceholder = `回复 @${target.user.nickname}`;
      that.secondCommentsToPid = isTopComment ? -1 : target.id;
    },
    async getNextComment() {
      const that = this;
      const id = that.item.id;
      try {
        that.cmtLoading = true;
        const cmtRes = await this.request({
          url: `${
            this._config.nestServerUrl
          }/api/moment/comments?id=${id}&limit=${
            that.cmtLimit
          }&page=${that.commentsPage++}`,
          method: "GET",
        });
        const cmts = cmtRes.data.data.comments;
        for (const cmt of cmts) {
          for (const i in that.ncomments) {
            const ncmt = that.ncomments[i];
            if (ncmt.id === cmt.id) {
              that.ncomments.splice(i, 1);
            }
          }
        }
        that.comments.push(...cmts);
      } catch (err) {
        console.log(err);
      } finally {
        that.cmtLoading = false;
      }
    },
    async changeAtt(aid, options) {
      const isMe = this.item.isMe;
      const mid = this.item.id;
      if (isMe) {
        await this.hlDelClick(mid);
      } else {
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
          if (options.active) {
            this.delAtt({
              uid: aid,
            });
          } else {
            this.addAtt({
              uid: aid,
            });
          }
          clearTimeout(this.attTimer);
          this.attTimer = -1;
        }, 200);
      }
    },

    async hlDelClick(id) {
      const that = this;
      const index = that.subMomentIndex;
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
            that.delMoment(index);
            uni.showModal({
              title: "删除成功",
              content: "点击确定返回上一页",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.setShouldInitMomentPage({
                    shoulInitMomentPage: true,
                  });
                  uni.navigateBack({
                    delta: -1,
                  });
                }
              },
            });
          }
        },
      });
    },

    async addComment() {
      const that = this;
      const content = that.delEmojiContent(that.newComment);
      const res = await that.request({
        url: `${this._config.nestServerUrl}/api/moment/comment`,
        method: "POST",
        data: {
          id: that.item.id,
          content,
        },
      });
      console.log(res.data.data);
      const { insertId: id } = res.data.data;
      const dt = new Date();
      const ncmt = {
        ...that.ncmtModel,
        user: that.userInfo,
        mid: that.item.id,
        content,
        createdAt: dt,
        updatedAt: dt,
        id,
      };
      that.comments.push(ncmt);
      that.item.buttons[1].value++;
      if (that.subMomentIndex > -1) {
        that.moments[this.subMomentIndex].buttons[1].value =
          that.item.buttons[1].value;
      }
      that.newComment = "";
    },
    async btnsClick(options) {
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
          const mid = this.item.id;
          const res = await this.request({
            url: `${this._config.nestServerUrl}/api/moment/set-liked`,
            method: "POST",
            data: {
              mid,
              liked: !active,
            },
          });
          if (active) {
            this.delLike({
              mid,
            });
            this.item.buttons[btnIndex].value--;
          } else {
            this.addLike({
              mid,
            });
            this.item.buttons[btnIndex].value++;
          }
          this.item.buttons[btnIndex].active = this.likes.includes(mid);
          if (this.subMomentIndex > -1) {
            this.moments[
              this.subMomentIndex
            ].buttons[2].value = this.item.buttons[btnIndex].value;
          } else {
            this.getSubMomentIndexWithId({
              id: this.item.id,
            });
            if (this.subMomentIndex > -1) {
              this.moments[
                this.subMomentIndex
              ].buttons[2].value = this.item.buttons[btnIndex].value;
            }
          }
        }, 200);
      }
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
.body {
  margin-top: 20rpx;

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

.comments {
  margin-top: 30rpx;
  padding-bottom: 200rpx;

  .item {
    margin: 57rpx 0;

    .body {
      padding: 0 50rpx;

      .comment {
        font-size: 30rpx;
        color: #3b424c;
        // font-weight: bold;
      }
    }
  }
}

.addComment {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  padding: 30rpx 23rpx;
  background-color: #ffffff;
  border-top: #dddddd solid 1rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .input {
    flex: 1;
    height: 65rpx;
    background-color: #f5f5f5;
    overflow: hidden;
    border-radius: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 28rpx;

    &-el {
      width: 100%;
      height: 100%;
    }
  }

  .submit {
    margin-left: 30rpx;
  }
}

.splitCmts {
  text-align: center;
  padding: 20rpx;
  font-size: 24rpx;
  color: #bbbbbb;
}
.second-comment {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  .tip {
    font-size: 28rpx;
    color: #777777;
    display: inline-block;
    padding: 5rpx 8rpx;
    margin-left: 40rpx;

    &:active {
      background-color: rgba($color: #000000, $alpha: 0.1);
      opacity: 0.6;
    }
  }
}

.comment-view {
  .body {
    .top-comment {
      .body {
        padding: 0 50rpx;

        .comment {
          font-size: 30rpx;
          color: #3b424c;
        }
      }
    }

    .list {
      .title {
        font-size: 26rpx;
        color: #a0a0a0;
        padding: 30rpx 30rpx;
        border-top: #eeeeee solid 15rpx;
      }
      .item {
        .body {
          padding: 0 50rpx;

          .comment {
            font-size: 30rpx;
            color: #3b424c;
            .at-user {
              color: rgb(0, 114, 207);
              margin: 0 5rpx;
            }
          }
        }
      }
    }

    .tools {
      display: flex;
      margin-top: 5rpx;
      align-items: center;
      padding: 30rpx;
      .time {
        padding: 10rpx 0;
        margin-left: auto;
        margin-right: 0;
      }
    }
  }
}

.comment {
  &:active {
    opacity: 0.6;
    background-color: rgba($color: #000000, $alpha: 0.1);
  }
}

@keyframes icon-dot {
  0% {
    transform: scaleY(0.5);
  }
  100% {
    transform: scaleY(1.5);
  }
}
.rendering {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    width: 80rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .icon {
      width: 10rpx;
      height: 40rpx;
      background-color: #2bd199;
      @for $i from 1 through 5 {
        &-#{$i} {
          $duration: 0.3s;
          $delay-time: $i * $duration;
          animation: icon-dot $duration $delay-time linear infinite;
        }
      }
    }
  }
}
</style>
