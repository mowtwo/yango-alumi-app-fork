<template>
  <view class="view">
    <scroll-view :scroll-y="true" class="scroll" @scroll="scrollHandle">
      <view class="header">
        <view class="avator">
          <image
            class="el"
            :src="userInfo.avatar || '/static/my/default-avatar.svg'"
            mode="aspectFill"
          />
          <view
            :class="[
              'gender',
              {
                male: userInfo.gender && user.gender === 'male',
                female: userInfo.gender && user.gender === 'female',
              },
            ]"
            v-if="userInfo.gender"
            >{{ gender }}</view
          >
        </view>
      </view>
      <view class="body">
        <view class="pre">
          <slot name="body-pre"></slot>
        </view>
        <view class="block basic">
          <view class="line">
            <view class="row name">
              {{ userInfo.nickname || "unkown user" }}
            </view>
            <view class="row verify" v-if="userInfo.realname">
              实名认证：{{ userInfo.realname || "unkown realname" }}
            </view>
          </view>
          <view class="line">
            <view class="row detail ul">
              <template v-for="(value, key, index) in userInfo.detail">
                <view class="li" :key="index" v-if="canShowDetail(key)">
                  {{ getDetail(key, value) }}
                </view>
              </template>
            </view>
          </view>
        </view>
        <view class="content">
          <slot name="user-content"></slot>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moveNav from "@/components/mwcomponent/move-nav.vue";
export default {
  components: { moveNav },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {
          nickname: "nickname",
          realname: "realname",
          detail: {},
        };
      },
    },
    excludeInfos: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      transMap: {
        gender: "性别",
        city: "城市",
        birthday: "生日",
        college: "学院",
        grade: "年级",
        major: "专业",
        class: "班级",
        enter_school_at: "入学年份",
        graduate_at: "毕业年份",
        describe: "留言",
        idcard_num: "身份证号码",
      },
      detailValueMap: {
        gender: {
          0: "未选择",
          1: "男",
          2: "女",
        },
      },
    };
  },
  computed: {
    gender() {
      if (this.userInfo.gender) {
        if (this.userInfo.gender === "male") {
          return "男";
        } else if (this.userInfo.gender === "female") {
          return "女";
        } else {
          return "?";
        }
      } else {
        return "?";
      }
    },
  },
  methods: {
    canShowDetail(key) {
      const show = !this.excludeInfos.includes(key);
      console.log(show);
      return show;
    },
    getDetail(key, value) {
      const transKeys = Object.keys(this.transMap);
      if (transKeys.includes(key)) {
        if (key === "gender") {
          value = this.detailValueMap.gender[value];
        }
        if (!value) {
          value = "暂未添加";
        }
        return `${this.transMap[key]}：${value}`;
      } else {
        return `${key}：${value}`;
      }
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
      detail,
    }) {
      // console.log(detail);
      this.$emit("scroll", { detail });
      if (scrollTop === 0) {
        this.$emit("scroll-in-top");
      } else {
        this.$emit("scroll-not-in-top");
      }
      if (deltaY > 0) {
        this.$emit("scroll-to-top", {
          deltaY,
          scrollTop,
        });
      } else if (deltaY < 0) {
        this.$emit("scroll-to-bottom", {
          deltaY,
          scrollTop,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.view {
  position: fixed;
  width: 100vw;
  height: 100vh;
  .scroll {
    width: 100%;
    height: 100%;
    background-color: #31d7a3;
    $size: 180rpx;
    $header-height: $size + 100rpx;
    .header {
      width: 100%;
      height: $header-height;
      position: relative;
      .avator {
        width: $size;
        height: $size;
        position: absolute;
        border-radius: 200rpx;
        bottom: -#{$size/2};
        box-sizing: border-box;
        border: #ffffff solid 4rpx;
        left: 30rpx;
        .el {
          width: $size - 8rpx;
          height: $size - 8rpx;
          overflow: hidden;
          border-radius: 200rpx;
        }
        .gender {
          width: 50rpx;
          height: 50rpx;
          border-radius: 200rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 0;
          right: 0;
          box-sizing: border-box;
          border: #ffffff solid 4rpx;
          $color: rgb(66, 66, 66);
          background-color: $color + 200;
          color: $color;

          &.male {
            $color: rgb(0, 110, 255);
            background-color: $color + 200;
            color: $color;
          }
          &.female {
            $color: rgb(247, 0, 255);
            background-color: $color + 200;
            color: $color;
          }
        }
      }
    }
    .body {
      $radius: 20rpx;
      width: 100vw;
      min-height: calc(100% - #{$header-height});
      // min-height: 200%;
      background-color: #ffffff;
      border-top-left-radius: $radius;
      border-top-right-radius: $radius;
      .pre {
        width: 100%;
        height: $size / 2;
      }
      .block {
        margin-top: 10rpx;
        width: 100%;
        padding: 30rpx;
        &:not(:last-child) {
          border-bottom: #eee solid 1rpx;
        }
        .line {
          padding: 10rpx 0;
          &:not(:last-child) {
            border-bottom: #eee solid 1rpx;
          }
          .row {
            padding: 5rpx 0;
          }
        }
        .ul {
          margin: 5rpx 0;
          & > .li {
            &:not(:last-child) {
              padding-bottom: 5rpx;
            }
            &::before {
              content: "-";
              font-weight: bold;
              margin-right: 10rpx;
            }
          }
        }
      }
      .basic {
        .name {
          font-size: 40rpx;
          font-weight: bold;
        }
        .describe,
        .verify {
          font-size: 24rpx;
          color: rgb(151, 151, 151);
        }
        .detail {
          font-size: 24rpx;
          color: rgb(39, 39, 39);
        }
      }
      .content {
        padding-top: 20rpx;
      }
    }
  }
}
</style>