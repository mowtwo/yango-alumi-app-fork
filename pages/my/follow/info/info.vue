<template>
  <view class="info">
    <view
      class="cu-bar"
      :style="{
        height: CustomBars + 4 + 'px',
        'padding-top': StatusBars + 'px',
        backgroundColor: showBar
          ? `rgba(255,255,255,${barOpactity})`
          : 'rgba(0,0,0,0)',
      }"
    >
      <view
        class="back"
        :style="{
          top: StatusBars + 'px',
          height: `calc(100% - ${StatusBars}px)`,
        }"
        @click="backClick"
      >
        <text
          class="cuIcon-right icon"
          :style="{
            color: showBar ? '#000' : '#fff',
          }"
        ></text>
      </view>
      <template v-if="showBar">
        <cu-bar :title="userInfo.nickname" :opacity="barOpactity"></cu-bar>
      </template>
    </view>
    <view class="render-view">
      <business-view
        :user-info="userInfo"
        :exclude-infos="['idcard_num']"
        @scroll-not-in-top="notInTopHandle"
        @scroll-in-top="inTopHandle"
        @scroll="scrollHandle"
      >
        <view slot="body-pre">
          <view class="tools">
            <!-- <navigator class="button">编辑资料</navigator> -->
          </view>
        </view>
        <view slot="user-content">
          <view class="action-count">
            <color-title-container title="用户数据">
              <view class="container">
                <view class="block follow-count">
                  <view class="title">关注数</view>
                  <view class="value">
                    {{ followCount > 999 ? "999+" : followCount }}
                  </view>
                </view>
                <view class="block funs-count">
                  <view class="title">粉丝数</view>
                  <view class="value">
                    {{ funsCount > 999 ? "999+" : funsCount }}
                  </view>
                </view>
              </view>
            </color-title-container>
          </view>
          <view class="moment">
            <color-title-container title="动态">
              <template v-if="!showEmpty">
                <view class="body">
                  <view
                    class="item"
                    v-for="(item, index) of moments"
                    :key="index"
                  >
                    <navigator
                      :url="`../../../moment/detail/detail?id=${item.id}`"
                      class="link"
                    >
                      <view class="title">
                        {{
                          item.title === ""
                            ? item.content === ""
                              ? "分享动态"
                              : item.content
                            : item.title
                        }}
                      </view>
                      <view class="time">{{
                        parseDateToStr(item.createdAt)
                      }}</view>
                    </navigator>
                  </view>
                </view>
              </template>
              <template v-else>
                <empty-block title="用户还没有发布任何动态"></empty-block>
              </template>
            </color-title-container>
          </view>
        </view>
      </business-view>
    </view>
  </view>
</template>

<script>
import CuBar from "@/components/mwcomponent/cu-bar.vue";
import ColorTitleContainer from "@/components/mwcomponent/color-title-container.vue";
import EmptyBlock from "@/components/mwcomponent/empty-block.vue";

export default {
  components: {
    CuBar,
    ColorTitleContainer,
    EmptyBlock,
  },
  computed: {
    showEmpty() {
      return this.moments.length <= 0;
    },
  },
  data() {
    return {
      StatusBars: this.StatusBar,
      CustomBars: this.CustomBar,
      title: "Mowtwo",
      showBar: false,
      barOpactity: 0,
      maxScrollTop: 80,
      uid: -1,
      userInfo: {},
      moments: [],
      limit: 20,
      page: 0,
      followCount: 0,
      funsCount: 0,
    };
  },
  async onLoad({ id }) {
    this.uid = id;
  },
  async onReady() {
    await this.getNewMoment();
  },
  async onShow() {
    const userRes = await this.request({
      url: `${this._config.nestServerUrl}/api/users/user-and-info?id=${this.uid}`,
      method: "GET",
    });
    const userResData = userRes.data.data;
    this.userInfo = userResData.userResult;

    const countRes = await this.request({
      url: `${this._config.nestServerUrl}/api/users/follow-and-funs-count?id=${this.uid}`,
      method: "GET",
    });
    const countResData = countRes.data.data;
    const countResult = countResData.countResult;
    this.followCount = countResult.followCount;
    this.funsCount = countResult.funsCount;
    await this.getNewMoment();
  },
  methods: {
    async getNewMoment() {
      const momentsRes = await this.request({
        url: `${this._config.nestServerUrl}/api/moment/other?limit=${
          this.limit
        }&page=${this.page++}&uid=${this.uid}`,
        method: "GET",
      });
      this.moments.push(...momentsRes.data);
    },
    backClick() {
      uni.navigateBack({
        delta: -1,
      });
    },
    notInTopHandle() {
      this.showBar = true;
    },
    inTopHandle() {
      this.showBar = false;
    },
    scrollHandle({
      detail: {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth,
        deltaX,
        deltaY,
      },
    }) {
      // console.log(scrollTop);
      let opacity = scrollTop / this.maxScrollTop;
      if (opacity > 1) {
        opacity = 1;
      }
      if (opacity <= 0.1) {
        opacity = 0;
      }
      this.barOpactity = opacity;
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
.info {
  .cu-bar {
    position: fixed;
    z-index: 9999999;
    top: 0;
    left: 0;
    .back {
      position: absolute;
      z-index: 99999999;
      left: 30rpx;
      display: flex;
      align-items: center;
      .icon {
        transform: rotate(-180deg);
        padding: 10rpx 5rpx;
        font-size: 34rpx;
        color: #ffffff;
        &:active {
          background-color: rgba($color: #000000, $alpha: 0.1);
          opacity: 0.6;
        }
      }
    }
  }
  .render-view {
    .tools {
      display: flex;
      justify-content: flex-end;
      .button {
        background-color: #31d7a3;
        color: #ffffff;
        font-size: 30rpx;
        margin: 20rpx;
        padding: 10rpx 20rpx;
        border-radius: 200rpx;
      }
    }
    .action-count {
      .container {
        display: flex;
        flex-flow: nowrap row;
        align-items: center;
        justify-content: space-around;
        padding: 50rpx;
        .block {
          width: 100%;
          display: flex;
          box-sizing: border-box;
          flex-flow: nowrap column;
          align-items: center;
          justify-content: center;
          &:not(:last-child) {
            border-right: #eee solid 1rpx;
          }
          .title {
            color: #5f5f5f;
            font-size: 28rpx;
          }
          .value {
            color: #141414;
            font-weight: bold;
            font-size: 40rpx;
            margin-top: 10rpx;
          }
        }
      }
    }
    .moment {
      margin-top: 20rpx;
      padding-bottom: 50rpx;
      .item {
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 10rpx;
          .link {
            padding: 10rpx 0;
          }
        }
        .link {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .title {
            // font-weight: bold;
            font-size: 30rpx;
            color: #1a1a1a;
            margin-left: 50rpx;
          }
          .time {
            color: rgb(199, 199, 199);
            font-size: 24rpx;
            margin-right: 50rpx;
          }
        }
      }
    }
  }
}
</style>