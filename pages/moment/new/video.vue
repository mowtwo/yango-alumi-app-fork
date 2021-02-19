<template>
  <view class="new">
    <input
      class="title"
      type="text"
      v-model="title"
      placeholder="输入标题"
      :maxlength="80"
    />
    <textarea
      class="content"
      v-model="content"
      placeholder="为视频添加描述"
      :maxlength="300"
    />
    <view
      :class="[
        'video',
        {
          empty: !hadVideo,
          had: hadVideo,
        },
      ]"
    >
      <view class="block add" v-if="!hadVideo" @click="addVideoHandle">
        选择视频/录像
        <text class="tip"> 最长{{ uploadMaxDuration }}秒 </text>
      </view>
      <view class="block" v-else>
        <view class="container">
          <video class="preview" :src="video"></video>
        </view>
        <view class="remove" @click="removeVideo"> 删除 </view>
      </view>
    </view>
    <view class="anonymous" v-if="getCanUseAnonymous">
      <switch :checked="anonymous" @change="switchAnonymous" />
      <text
        :class="[
          'label',
          {
            anonymous,
          },
        ]"
        >{{ anonymous ? "已启用" : "未" }}匿名</text
      >
    </view>
    <view class="subject">
      <subject @change="changeSubject" />
    </view>
    <view class="submit">
      <button type="primary" @click="submit" :disabled="!canSubmit">
        发布
      </button>
    </view>
  </view>
</template>

<script>
import Subject from "@/components/mwcomponent/subject";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  components: {
    Subject,
  },
  data() {
    return {
      title: "",
      content: "",
      video: "",
      tags: [],
      anonymous: false,
      savePath: "",
      isBack: true,
      uploadMaxDuration: 60,
    };
  },
  computed: {
    ...mapGetters(["getCanUseAnonymous"]),
    hadVideo() {
      return this.video !== "" && this.savePath !== "";
    },
    canSubmit() {
      return (
        this.title !== "" ||
        this.content !== "" ||
        (this.video !== "" && this.savePath !== "")
      );
    },
  },
  async beforeDestroy() {
    // console.log(this.savePath)
    if (this.isBack) {
      await this.removeVideo();
    }
  },
  methods: {
    ...mapMutations(["setShouldInitMomentPage"]),
    switchAnonymous() {
      this.anonymous = !this.anonymous;
    },
    changeSubject({ subjects }) {
      this.tags = subjects;
    },
    addVideoHandle() {
      const that = this;
      const uploadMaxDuration = this.uploadMaxDuration;
      uni.chooseVideo({
        compressed: true,
        maxDuration: uploadMaxDuration,
        success(res) {
          if (res.duration <= uploadMaxDuration) {
            const filePath = res.tempFilePath;
            uni.showLoading({
              title: "文件上传中...",
            });
            uni.uploadFile({
              url: that._config.nestServerUrl + "/api/file-manager/upload-img",
              filePath: filePath,
              name: "file",
              success(uploadRes) {
                console.log("succ");
                const {
                  data: { path, savePath },
                } = JSON.parse(uploadRes.data);
                const fullPath = path;
                that.video = fullPath;
                that.savePath = savePath;
              },
              fail(failRes) {
                console.log("fail");
                uni.showToast({
                  title: "上传失败，请重试",
                });
              },
              complete() {
                uni.hideLoading();
              },
              header: {
                Authorization: "Bearer " + uni.getStorageSync("token"),
                "app-source": "wx",
              },
            });
          } else {
            uni.showToast({
              title: "超过规定时长",
              icon: "none",
            });
          }
        },
      });
    },
    async removeVideo() {
      const savePath = this.savePath;
      const res = await this.request({
        url: `${this._config.nestServerUrl}/api/file-manager/del-files`,
        method: "POST",
        data: {
          files: [savePath],
        },
      });
      this.video = "";
      this.savePath = "";
    },
    async submit() {
      const that = this;
      const data = {
        title: this.delEmojiContent(this.title),
        content: this.delEmojiContent(this.content),
        videos: this.video === "" ? [] : [this.video],
        tags: this.tags.map(this.delEmojiContent),
        isAnonymous: this.anonymous ? 1 : 0,
      };
      const res = await this.request({
        url: `${this._config.nestServerUrl}/api/moment/createWithTag`,
        method: "POST",
        data,
      });

      const {
        data: { status_code },
      } = res;
      if (status_code === 200) {
        that.setShouldInitMomentPage({
          shoulInitMomentPage: true,
        });
        that.isBack = false;
        uni.showModal({
          title: "发布成功",
          content: "点击返回上一页",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              uni.navigateBack({
                delta: -1,
              });
            }
          },
        });
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
@import "./new.scss";
.video {
  &.empty {
    @include block(226rpx, 226rpx);
  }
  &.had {
    @include block(350rpx, 450rpx);
  }
}
</style>