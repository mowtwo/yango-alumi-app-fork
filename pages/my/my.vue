<template>
  <view class="body">
    <view
      class="custom-bar"
      :style="{
        height: CustomBars + 4 + 'px',
        'padding-top': StatusBars + 'px',
      }"
    >
      <text>我的</text>
    </view>
    <view class="header" hover-class="default-hover" @tap="headerTapHandle()">
      <view class="avatar" :hover-stop-propagation="true">
        <image :src="userInfo.avatar" v-if="userInfo.avatar"></image>
        <image src="/static/my/default-avatar.svg" v-else></image>
      </view>
      <view class="content">
        <view class="userinfo">
          <view class="name">
            <block>
              <text v-if="userInfo.haveUserInfo">{{
                userInfo.nickname || userInfo.realname
              }}</text>
              <text v-else>点击登录账号</text>
            </block>
            <block>
              <view
                class="verify-icon"
                v-if="
                  userInfo.identity_verify_at &&
                  new Date(userInfo.identity_verify_at).getTime() > 0
                "
                >已实名认证</view
              >
              <view class="verify-icon no-verify" v-else>未实名认证</view>
            </block>
          </view>
          <view class="describe">{{ userInfo.detail.describe || "" }}</view>
        </view>
        <view class="icon">
          <text class="cuIcon-right"></text>
        </view>
      </view>
    </view>

    <!-- 我的信息 -->
    <view class="info-data">
      <navigator url="./point/point" class="block" hover-class="default-hover">
        <view class="num">{{ point > 999999 ? "999999+" : point }}</view>
        <view class="item">我的积分</view>
      </navigator>
      <navigator url="./funs/funs" class="block" hover-class="default-hover">
        <view class="num">{{ funsCount }}</view>
        <view class="item">我的粉丝</view>
      </navigator>
      <navigator
        url="./follow/follow"
        class="block"
        hover-class="default-hover"
      >
        <view class="num">{{ followCount }}</view>
        <view class="item">我的关注</view>
      </navigator>
    </view>

    <!-- 宣传轮播图 -->
    <block v-if="settings.my.announceImg.length == 1">
      <view
        class="announce-img"
        v-for="(item, index) in settings.my.announceImg"
        :key="index"
      >
        <button
          open-type="share"
          v-if="item.navigate && item.navigate.type == 'share'"
        ></button>
        <image :src="item.img" @tap="navigateUrl(item.navigate)"></image>
      </view>
    </block>
    <block v-else-if="settings.my.announceImg.length > 1">
      <uni-swiper-dot
        :info="settings.my.announceImg"
        :current="announceImageCurrent"
        :dots-styles="dotsStyles"
      >
        <swiper
          :autoplay="!pageHide"
          :circular="true"
          @change="announceImageChange"
          :interval="6000"
          class="announce-img"
        >
          <swiper-item
            v-for="(item, index) in settings.my.announceImg"
            :key="index"
          >
            <button
              open-type="share"
              v-if="item.navigate && item.navigate.type == 'share'"
            ></button>
            <image :src="item.img" @tap="navigateUrl(item.navigate)"></image>
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
    </block>

    <block>
      <view class="function">
        <navigator
          url="./moment/moment"
          class="item"
          hover-class="default-hover"
        >
          <view class="icon">
            <image src="/static/my/icons/dynamic.svg"></image>
          </view>
          <view class="name">我的动态</view>
        </navigator>

        <navigator
          url="./message/message"
          class="item"
          hover-class="default-hover"
        >
          <view class="icon">
            <image src="/static/my/icons/message.svg"></image>
          </view>
          <view class="name">我的消息</view>
          <view class="tip" v-if="newMessageCount > 0">{{
            newMessageCount
          }}</view>
        </navigator>

        <!-- <view class="item" hover-class="default-hover">
          <view class="icon">
            <image src="/static/my/icons/store.svg"></image>
          </view>
          <view class="name">积分商城</view>
        </view> -->

        <view class="item" hover-class="default-hover">
          <view class="icon">
            <image src="/static/my/icons/back-record.svg"></image>
          </view>
          <view class="name">返校记录</view>
        </view>
		
		<!-- <navigator url="./userinfo/userinfo" class="item" hover-class="default-hover">
		  <view class="icon">
		    <image src="/static/my/icons/back-record.svg"></image>
		  </view>
		  <view class="name">身份信息</view>
		</navigator> -->
		
		<navigator url="./userinfo/qrcode" class="item" hover-class="default-hover">
		  <view class="icon">
		    <image src="/static/my/icons/scan.svg"></image>
		  </view>
		  <view class="name">我的身份码</view>
		</navigator>

        <navigator url="./help/help" class="item" hover-class="default-hover">
          <view class="icon">
            <image src="/static/my/icons/help.svg"></image>
          </view>
          <view class="name">帮助{{ "&" }}反馈</view>
        </navigator>

        <navigator
          url="./setting/setting"
          class="item"
          hover-class="default-hover"
        >
          <view class="icon">
            <image src="/static/my/icons/settings.svg"></image>
          </view>
          <view class="name">设置</view>
        </navigator>
      </view>
    </block>
    <view class="law">
      <text @tap="toTos">服务条款</text>
    </view>
    <register ref="register"></register>
  </view>
</template>

<script>
import register from "@/components/register/register.vue";
import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue";
import { createNamespacedHelpers } from "vuex";
const {
  mapState: mapPointState,
  mapMutations: mapPointMutations,
} = createNamespacedHelpers("RewardPoint");
export default {
  components: {
    uniSwiperDot,
    register,
  },
  computed: {
    ...mapPointState(["point"]),
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
  },
  watch: {
    userInfo: function (val) {},
  },
  data() {
    return {
      newMessageCount: 0,
      followCount: 0,
      funsCount: 0,
      StatusBars: this.StatusBar,
      CustomBars: this.CustomBar,
      settings: {
        my: {
          announceImg: [
            {
              img: "/static/my/announce-img-1.svg",
              navigate: {
                type: "share",
              },
            },
          ],
        },
      },
    };
  },
  onReady() {
    this.getMenuButton();
    setTimeout(() => {
      this.Customs = this.Custom;
      this.StatusBars = this.StatusBar;
      this.CustomBars = this.CustomBar;
      this.navbarSearch = this.Custom.left - uni.upx2px(30);
    }, 0);
  },
  onShareAppMessage() {
    let shareImg = "https://alumni-static.huashuedu.cn/share/default/img.png";
    // if (this.settings && this.settings.global && this.settings.global.shareImg) {
    // 	shareImg = this.settings.global.shareImg;
    // }
    return {
      title: "快来一起玩转校友圈吧！",
      path: "pages/index/index",
      imageUrl: shareImg,
    };
  },
  methods: {
    ...mapPointMutations({
      updatePoint: "update",
    }),
    headerTapHandle() {
      if (
        !this.userInfo.haveUserInfo ||
        !(new Date(this.userInfo.identity_verify_at).getTime() > 0)
      ) {
        this.$refs.register.show();
      } else {
        // 跳转详情页
		uni.navigateTo({
			url: './info/info'
		});
      }
    },
    toTos() {
      this.navigateUrl({
        type: "webview",
        url: `${this._config.staticUrl}/law/tos.html`,
      });
    },
  },
  async onShow() {
    const that = this;
    const attentionCount = await this.request({
      url: `${this._config.nestServerUrl}/api/attention/count`,
      method: "GET",
    });
    const data = attentionCount.data.data;
    const count = data.count || {};
    const followCount = count.followCount || 0;
    const funsCount = count.funsCount || 0;
    that.followCount = followCount > 99 ? "99+" : followCount;
    that.funsCount = funsCount > 99 ? "99+" : funsCount;

    //获取点赞
    const newMessageCountRes = await that.request({
      url: `${this._config.nestServerUrl}/api/message/new-count`,
      method: "GET",
    });
    // console.log();
    const nMsgCData = newMessageCountRes.data.data;
    that.newMessageCount = nMsgCData.count;

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
.function {
  .item {
    .tip {
      $size: 30rpx;
      width: $size;
      height: $size;
      color: #ffffff;
      background-color: rgb(255, 28, 28);
      font-size: $size - 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 200rpx;
      margin-left: auto;
      margin-right: 10rpx;
    }
  }
}

.body {
  min-height: 100vh;
  background-color: #ffffff;
}

.custom-bar {
  position: sticky;
  top: 0;
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.custom-bar > text {
  font-size: 34rpx;
  line-height: 600rpx;
}

.header {
  padding: 50rpx 60rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.header > .avatar {
  height: 100rpx;
  width: 100rpx;
  border-radius: 50%;
}

.header > .avatar > image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.header > .content {
  padding-left: 24rpx;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.header > .content > .userinfo {
}

.header > .content > .userinfo > .name {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.header > .content > .userinfo > .name > .verify-icon {
  margin-left: 12rpx;
  display: inline-block;
  padding: 6rpx 18rpx;
  background: linear-gradient(
    180deg,
    rgba(246, 213, 164, 1) 0%,
    rgba(223, 180, 107, 1) 100%
  );
  border-radius: 19rpx;
  color: #ffffff;
  font-size: 16rpx;
}

.header > .content > .userinfo > .name > .verify-icon.no-verify {
  background: linear-gradient(
    180deg,
    rgba(186, 188, 201, 1) 0%,
    rgba(136, 136, 136, 1) 100%
  );
}

.header > .content > .userinfo > .name > text {
  color: #3b424c;
  font-size: 30rpx;
  letter-spacing: 1rpx;
  font-weight: bold;
}

.header > .content > .userinfo > .describe {
  margin-top: 12rpx;
  color: #bababa;
  font-weight: bold;
  font-size: 24rpx;
}

.header > .content > .icon {
  flex: 1;
  text-align: right;
}

.header > .content > .icon > .cuIcon-right {
  font-size: 40rpx;
  color: #666666;
}

.info-data {
  margin: 0 30rpx;
  display: flex;
  flex-direction: row;
}

.info-data > .block {
  padding: 30rpx 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-data > .block > .num {
  color: #282828;
  font-size: 36rpx;
  font-weight: bold;
}

.info-data > .block > .item {
  margin-top: 12rpx;
  color: #9fa2ab;
  font-size: 30rpx;
}

.announce-img {
  margin: 0 30rpx;
  height: 132rpx;
  position: relative;
}

.announce-img image {
  width: 100%;
  height: 100%;
}

.announce-img > button,
.announce-img > swiper-item > button {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}

.function {
  padding: 60rpx 0;
  padding-bottom: 30rpx;
}

.function > .item {
  padding: 30rpx 67rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.function > .item > .icon {
  width: 48rpx;
  height: 48rpx;
}

.function > .item > .icon > image {
  height: 100%;
  width: 100%;
}

.function > .item > .name {
  margin-left: 35rpx;
  color: #282828;
  font-size: 30rpx;
  font-weight: 400;
}

.law {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 40rpx;
}
.law > text {
  color: #bababa;
  font-size: 26rpx;
}

.default-hover {
  background-color: #f0f0f0 !important;
}
</style>
