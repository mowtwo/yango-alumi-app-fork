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
      placeholder="发表你的内容，让更多人看到"
      :maxlength="300"
    />
    <view class="imgs">
      <view class="block" v-for="(item, index) of imgs" :key="index">
        <view class="container">
          <image
            class="preview"
            @click="previewClickHandle(index)"
            :src="item.fullPath"
            mode="aspectFill"
          ></image>
        </view>
        <view class="remove" @click="removeClickHandle(index)"> 删除 </view>
      </view>
      <view class="block add" v-if="canAddImg" @click="addClickHandle">
        选择照片/图片
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
      imgs: [],
      maxImgCount: 9,
      tags: [],
      anonymous: false,
      isBack: true,
    };
  },
  computed: {
    ...mapState([]),
    ...mapGetters(["getCanUseAnonymous"]),
    canAddImg() {
      return this.imgs.length < this.maxImgCount;
    },
    canSubmit() {
      return this.title !== "" || this.content !== "" || this.imgs.length > 0;
    },
  },
  methods: {
    ...mapMutations(["setShouldInitMomentPage"]),
    changHandle() {
      console.log("change");
      this.content = this.delEmojiContent(this.content);
    },
    switchAnonymous() {
      this.anonymous = !this.anonymous;
    },
    async submit() {
      const that = this;
      const data = {
        title: this.delEmojiContent(this.title),
        content: this.delEmojiContent(this.content),
        imgs: this.imgs.map(({ fullPath }) => fullPath),
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
    previewClickHandle(index) {
      uni.previewImage({
        urls: this.imgs.map(({ fullPath }) => fullPath),
        current: index,
      });
    },
    changeSubject({ subjects }) {
      this.tags = subjects;
    },
    addClickHandle() {
      const count = this.maxImgCount - this.imgs.length;
      const that = this;
      uni.chooseImage({
        count,
        compressed: true,
        success(res) {
          uni.showLoading({
            title: "文件上传中...",
          });
          // that.imgs.push(...res.tempFilePaths);
          for (const filePath of res.tempFilePaths) {
            uni.uploadFile({
              url: `${that._config.nestServerUrl}/api/file-manager/upload-img`,
              filePath: filePath,
              name: "file",
              success(uploadRes) {
                console.log("succ");
                const {
                  data: { path, savePath },
                } = JSON.parse(uploadRes.data);
                const fullPath = path;
                // console.log('savePath',savePath)
                that.imgs.push({ fullPath, savePath });
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
          }
        },
      });
    },
    async removeClickHandle(index) {
      console.log(index);
      const temp = this.imgs;

      const res = await this.request({
        url: `${this._config.nestServerUrl}/api/file-manager/del-files`,
        method: "POST",
        data: {
          files: [temp[index].savePath],
        },
      });
      temp.splice(index, 1);
      this.imgs = temp;
    },
  },
  async beforeDestroy() {
    if (this.isBack) {
      const imgs = this.imgs.map(({ savePath }) => savePath);
      await this.request({
        url: `${this._config.nestServerUrl}/api/file-manager/del-files`,
        method: "POST",
        data: {
          files: [...imgs],
        },
      });
    }
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
.imgs {
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  justify-content: space-between;
  margin-top: 30rpx;
  &::after {
    content: "";
    width: 226rpx;
    height: 226rpx;
    margin: 2rpx;
  }
  @include block(226rpx, 226rpx);
}
</style>
