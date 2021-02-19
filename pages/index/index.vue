<template>
  <view class="body">
    <view
      class="custom-bar-fixed"
      :style="{
        height: CustomBars + 'px',
        'background-color': displayNavColor ? navbarColor : 'transparent',
      }"
    >
      <!-- 扫一扫 -->
      <view
        class="custom-bar-content"
        :style="{ 'padding-top': StatusBars + 'px' }"
      >
        <view
          class="scan-group"
          @tap="scanQrcode"
          hover-class="scan-qrcode-hover"
        >
          <text
            class="cuIcon-scan"
            :style="{ 'font-size': Customs.bottom - Customs.top - 8 + 'px' }"
          ></text>
          <text
            class="scan-text"
            :style="{ 'font-size': Customs.bottom - Customs.top - 22 + 'px' }"
            >扫一扫</text
          >
        </view>
        <!-- 搜索框 -->
        <navigator
          url="../search/search"
          class="custom-bar-search"
          :style="{
            'margin-right': 'calc(100vw - ' + navbarSearch + 'px' + ')',
            height: Customs.bottom - Customs.top + 'px',
          }"
        >
          <input
            placeholder="输入你想看的的内容"
            confirm-type="go"
            :placeholder-style="
              'color:#999999;font-size:' +
              (Customs.bottom - Customs.top - 20).toString() +
              'px'
            "
            :style="{ 'font-size': Customs.bottom - Customs.top - 20 + 'px' }"
            @confirm="getSearch()"
            v-model="searchInput"
            :disabled="true"
          />
          <text
            class="cuIcon-search"
            :style="{ 'font-size': Customs.bottom - Customs.top - 16 + 'px' }"
            @tap="getSearch()"
          ></text>
        </navigator>
      </view>
    </view>
    <uni-swiper-dot
      :info="settings.index.bannerImg"
      :current="navbarImageCurrent"
      :dots-styles="dotsStyles"
      class="navbar-img-box"
      :style="{ height: CustomBars + navbarHeight + 'px' }"
    >
      <swiper
        :autoplay="!pageHide"
        :circular="true"
        @change="navbarImageChange"
        :style="{
          'background-color': navbarColor,
          height: CustomBars + navbarHeight + 'px',
        }"
      >
        <swiper-item
          v-for="(item, index) in settings.index.bannerImg"
          :key="index"
        >
          <!-- 顶部状态栏 -->
          <view
            class="custom-bar"
            :style="{
              height: CustomBars + 'px',
              'background-color': item.color,
            }"
            id="nav"
          ></view>
          <!-- 顶部轮播图区域 -->
          <view class="navbar">
            <!-- <block v-if="settings.index.bannerImg.length == 1"> -->
            <view
              class="navbar-image"
              :style="{ 'background-color': navbarColor }"
              @tap="navigateUrl(item.navigate)"
            >
              <button
                open-type="share"
                v-if="item.navigate && item.navigate.type == 'share'"
              ></button>
              <image :src="item.img"></image>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
    <view class="action-bar">
      <view
        class="action-bar-content"
        hover-class="action-bar-item-hover"
        @tap="toSignIn"
      >
        <image
          src="/static/index/tools-bar/signin.svg"
          class="action-bar-icon"
        ></image>
        <view class="action-bar-text">每日签到</view>
      </view>
      <view
        class="action-bar-content"
        hover-class="action-bar-item-hover"
        @tap="toActivity"
      >
        <image
          src="/static/index/tools-bar/action.svg"
          class="action-bar-icon"
        ></image>
        <view class="action-bar-text">校友活动</view>
      </view>
      <view
        class="action-bar-content"
        hover-class="action-bar-item-hover"
        @tap="toTasks"
      >
        <image
          src="/static/index/tools-bar/tasks.svg"
          class="action-bar-icon"
        ></image>
        <view class="action-bar-text">近期任务</view>
      </view>
      <view
        class="action-bar-content"
        hover-class="action-bar-item-hover"
        @tap="toCardPackage"
      >
        <image
          src="/static/index/tools-bar/alumni-card.svg"
          class="action-bar-icon"
        ></image>
        <view class="action-bar-text">我的卡包</view>
      </view>
    </view>
    <!-- 宣传轮播图 -->
    <block v-if="settings.index.announceImg.length == 1">
      <view
        class="announce-img"
        v-for="(item, index) in settings.index.announceImg"
        :key="index"
      >
        <button
          open-type="share"
          v-if="item.navigate && item.navigate.type == 'share'"
        ></button>
        <image :src="item.img" @tap="navigateUrl(item.navigate)"></image>
      </view>
    </block>
    <block v-else-if="settings.index.announceImg.length > 1">
      <uni-swiper-dot
        :info="settings.index.announceImg"
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
            v-for="(item, index) in settings.index.announceImg"
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

    <view class="news">
      <view class="title">
        <view class="title-point"></view>
        <view class="text">最新课程</view>
      </view>
      <block v-if="settings.index.news.length > 0">
        <view
          class="content"
          hover-class="default-hover"
          v-for="(item, key) in settings.index.news"
          :key="key"
          @tap="navigateUrl(item.navigate)"
        >
          <view class="info">
            <text class="title">{{ item.title }}</text>
            <text class="tip">{{ item.tip }}</text>
          </view>
          <view class="img-area">
            <image :src="item.img" mode="aspectFill"></image>
          </view>
        </view>
      </block>
    </view>
    <register ref="register"></register>
  </view>
</template>

<script>
import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue";
import register from "@/components/register/register.vue";
export default {
  components: {
    uniSwiperDot,
    register,
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val.haveUserInfo !== undefined) {
          if (
            !(
              new Date(val.identity_verify_at).getTime() > 0 && val.haveUserInfo
            ) &&
            !this.userCancel
          ) {
            setTimeout(() => {
              this.$refs.register.show({
                cancel: () => {
                  this.userCancel = true;
                },
              });
            }, 300);
          } else {
            setTimeout(() => {
              this.$refs.register.hide();
            }, 100);
          }
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      navbarHeight: uni.upx2px(302),
      navbarSearch: this.Custom.left - uni.upx2px(30),
      navbarColor: "#31D7A3",
      displayNavColor: false,
      windowHeights: this.windowHeight,
      dotsStyles: {
        bottom: uni.upx2px(60),
        backgroundColor: "rgba(255, 255, 255,0.3)",
        border: "1px rgba(255, 255, 255,0.3) solid",
        selectedBackgroundColor: "rgba(255, 255, 255,0.9)",
        selectedBorder: "1px rgba(255, 255, 255,0.9) solid",
      },
      pageHide: false,
      Customs: this.Custom,
      StatusBars: this.StatusBar,
      CustomBars: this.CustomBar,
      showLogin: false,
      userCancel: false,
      searchInput: "",
      navbarImageCurrent: 0,
      announceImageCurrent: 0,
      settings: {
        index: {
          bannerImg: [
            {
              img: "/static/index/banner-1.svg",
              color: "#31D7A3",
              navigate: {
                type: "pages",
                url: "/pages/register/register",
              },
            },
            {
              img: "/static/index/banner-2.svg",
              color: "#57B0D1",
              navigate: {
                type: "share",
                url: "",
              },
            },
            {
              img: "/static/index/banner-3.svg",
              color: "#FF8092",
              navigate: {
                type: "miniprogram",
                appid: "wx535b0d4280e690ba",
                path:
                  "pages/school/graduated_photo/select_school/select_school",
              },
            },
          ],
          announceImg: [
            {
              img: "/static/index/announce-img-1.svg",
              navigate: {
                type: "share",
                url: "",
              },
            },
          ],
          news: [
            {
              img: "/static/index/class-cover.jpg",
              title: "阳光学院2020届毕业生就业技能培训",
              tip: "塑造更优秀的你",
              navigate: {
                type: "miniprogram",
                appid: "wx535b0d4280e690ba",
                path: "pages/index/index",
              },
            },
          ],
        },
      },
    };
  },
  onHide() {
    this.pageHide = true;
  },
  onShow() {
    this.pageHide = false;
  },
  onReady() {
    this.getMenuButton();
    setTimeout(() => {
      this.Customs = this.Custom;
      this.StatusBars = this.StatusBar;
      this.CustomBars = this.CustomBar;
      this.navbarSearch = this.Custom.left - uni.upx2px(30);
      this.windowHeights = this.windowHeight;
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
  onLoad(e) {
    uni.setBackgroundColor({
      backgroundColorTop: this.navbarColor,
      backgroundColor: this.navbarColor,
    });
    if (e.userCancel) {
      this.userCancel = true;
    }
  },
  onPageScroll() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select("#nav")
      .boundingClientRect((el) => {
        if (!(el.top < this.windowHeights && el.top > -10)) {
          // 不在可视范围内
          this.displayNavColor = true;
        } else {
          this.displayNavColor = false;
        }
      })
      .exec();
  },
  methods: {
    toSignIn() {
      // uni.showToast({
      //   icon: "none",
      //   title: "签到暂未开放",
      // });
      uni.navigateTo({
        url: "../my/point/sign",
      });
    },
    toActivity() {
      uni.showToast({
        icon: "none",
        title: "暂无更多活动",
      });
    },
    toTasks() {
      uni.showToast({
        icon: "none",
        title: "近期暂无任务",
      });
    },
    navbarImageChange(e) {
      this.navbarImageCurrent = e.detail.current;
      if (this.settings.index.bannerImg[e.detail.current].color) {
        this.navbarColor = this.settings.index.bannerImg[
          e.detail.current
        ].color;
        uni.setBackgroundColor({
          backgroundColorTop: this.navbarColor,
          backgroundColor: this.navbarColor,
        });
      }
    },
    announceImageChange(e) {
      this.announceImageCurrent = e.detail.current;
    },
    toCardPackage() {
      uni.navigateTo({
        url: "/pages/card_package/card_package",
      });
    },
    getSearch() {
      let that = this;
      if (!this.searchInput) {
        uni.showToast({
          icon: "none",
          title: "您还未输入需要搜索的内容",
          duration: 2000,
        });
        return;
      }
      // uni.showLoading({
      // 	title: '正在查找...',
      // 	mask: true
      // });
      // this.request({
      // 	method: 'POST',
      // 	url: that.systemURL + "/api/course/searchCourse",
      // 	data: {
      // 		input: that.searchInput
      // 	},
      // 	success(res) {
      // 		uni.hideLoading();
      // 		console.log(res.data);
      // 		if (res.data.status == 'success') {
      // 			switch (res.data.type) {
      // 				case 'invitation_code':
      // 					that.searchInput = '';
      // 					uni.navigateTo({
      // 						url: '/pages/course/joinClass/joinClass?class_id=' + res.data.class_id,
      // 					});
      // 					break;
      // 				case 'search':
      // 					if (res.data.result.length == 0) {
      // 						uni.showToast({
      // 							icon: 'none',
      // 							title: '未查找到相关课程',
      // 							duration: 2000
      // 						});
      // 					}
      // 					break;
      // 				default:
      // 					uni.showToast({
      // 						icon: 'none',
      // 						title: '未查找到相关课程',
      // 						duration: 2000
      // 					});
      // 					break;
      // 			}
      // 		} else {
      // 			let msg = that.parseResponse(res, that.getSearch);
      // 			uni.showToast({
      // 				icon: 'none',
      // 				title: msg,
      // 				duration: 2000
      // 			});
      // 		}
      // 	},
      // 	fail() {
      // 		uni.hideLoading();
      // 		uni.showToast({
      // 			icon: 'none',
      // 			title: '网络连接失败，请稍后再试',
      // 			duration: 2000
      // 		});
      // 	}
      // });
    },
  },
};
</script>

<style scoped>
@import url("./style.css");
</style>
