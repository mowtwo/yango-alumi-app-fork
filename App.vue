<script>
import Vue from "vue";
import {
  createNamespacedHelpers,
  mapState as mapGlobalState,
  mapMutations as mapGlobalMutations,
} from "vuex";
import Auth from '@/utils/Auth.js';

const { mapState, mapMutations } = createNamespacedHelpers("RewardPoint");
const { mapMutations: mapSettingMutations } = createNamespacedHelpers(
  "Setting"
);
export default {
  onLaunch: function (e) {
    const that = this;
    try {
      if (e.path != "pages/login/login") {
        this.getUserInfoByToken()
          .then((r) => {
			  Auth.autoUpdateUserInfo();
		  })
          .catch((e) => {
            console.log(e);
          });
      }
    } catch (e) {
      console.log(e);
    }

    //获取全局服务器设置
    this.request({
      url: `${this._config.nestServerUrl}/api/setting/global_setting`,
      method: "GET",
    }).then((res) => {
      const data = res.data.data;
      const globalSetting = data.globalSettingResult;
      that.setGlobalSetting({
        globalSetting,
      });
    });

    let userInfo = uni.getStorage({
      key: "userInfo",
      success: (data) => {
        try {
          if (data && data.data) {
            data = data.data;
            data = JSON.parse(data);
            if (typeof data !== "object") {
              throw "JSON格式错误";
            }
            Vue.prototype.$store.commit("setUserInfo", {
              userInfo: data,
            });
            //获取积分
            this.request({
              url: `${this._config.nestServerUrl}/api/point/point`,
              method: "GET",
            }).then((res) => {
              // console.log(res);
              const data = res.data.data;
              const point = data.point;
              that.updatePoint({ point });
            });
            //获取签到状态
            this.request({
              url: `${this._config.nestServerUrl}/api/point/sign`,
              method: "GET",
            }).then((res) => {
              // console.log(res);
              const data = res.data.data;
              // console.log(data);
              const signed = data.signed;
              if (signed) {
                that.signIt();
              }
            });
            //获取设置列表
            this.request({
              url: `${this._config.nestServerUrl}/api/userinfo/setting`,
              method: "GET",
            }).then((res) => {
              const data = res.data.data;
              const setting = data.setting;
              for (const { key, name, value } of setting) {
                that.updateSetting({
                  key,
                  name,
                  value,
                });
              }
            });
          }
        } catch (err) {
          console.log(err);
        }
      },
      fail: (e) => {
        console.log(e);
      },
    });
    uni.getSystemInfo({
      success: function (e) {
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.safeAreaBottom = 0;
        if (e.screenHeight / e.screenWidth >= 1.8 && e.platform == "ios") {
          Vue.prototype.safeAreaBottom = 34;
        }
        Vue.prototype.windowHeight = e.windowHeight;
        // #ifndef MP
        if (e.platform == "android") {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif
        // #ifdef MP-WEIXIN
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar =
          custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-QQ
        let customHeight = qq.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = customHeight;
        Vue.prototype.CustomBar =
          customHeight.bottom + customHeight.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      },
    });

    // 自动升级
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {});
    updateManager.onUpdateReady(function (res) {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启小程序?",
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });
    updateManager.onUpdateFailed(function (res) {
      uni.showToast({
        icon: "none",
        title: "自动更新失败, 请手动重启小程序后使用新版",
        duration: 3000,
      });
    });
  },
  onShow: function () {},
  onHide: function () {},
  methods: {
    ...mapGlobalMutations(["setGlobalSetting"]),
    ...mapMutations({
      updatePoint: "update",
      signIt: "signIt",
    }),
    ...mapSettingMutations({
      updateSetting: "update",
    }),
  },
};
</script>

<style>
/*每个页面公共css */
@import "colorui/icon.css";
@import "colorui/animation.css";

body {
  --main-color: #39d8b0;
  background-color: #f1f1f1;
  font-size: 28upx;
  color: #333333;
  font-family: Helvetica Neue, Helvetica, sans-serif;
}

view,
scroll-view,
swiper,
button,
input,
textarea,
label,
navigator,
image {
  box-sizing: border-box;
}
.created-at {
  font-size: 24rpx;
  color: rgb(150, 150, 150);
}
</style>
