<template>
  <view class="search">
    <s-input
      placeholder="输入要搜索的内容"
      :throttle="true"
      :current-value="currentValue"
      @change="keywordChange"
      @clear="inputClear"
    ></s-input>
    <template v-if="showResult">
      <color-title-container title="匹配动态">
        <view class="moments">
          <moment-result :moments="moments"></moment-result>
        </view>
      </color-title-container>
    </template>
    <template v-else>
      <view class="history">
        <color-title-container title="搜索历史">
          <view class="list">
            <view
              class="item"
              v-for="(item, index) of keywordsHistory"
              :key="index"
              hover-class="active"
              @click="setCurrentValue(item)"
              >{{ item }}</view
            >
          </view>
        </color-title-container>
      </view>
    </template>
  </view>
</template>

<script>
import SInput from "@/components/mwcomponent/search-input/search-input";
import ColorTitleContainer from "@/components/mwcomponent/color-title-container.vue";
import MomentResult from "@/components/mwcomponent/search-input/moment-result.vue";
export default {
  components: {
    SInput,
    ColorTitleContainer,
    MomentResult,
  },
  data() {
    return {
      keywords: [],
      moments: [],
      currentValue: "",
      keywordsHistory: [],
    };
  },
  computed: {
    showResult() {
      return this.keywords.length > 0 || this.moments.length > 0;
    },
  },
  onLoad({ keyword = "" }) {
    this.currentValue = keyword;
    const that = this;
    uni.getStorage({
      key: "keywordsHistory",
      success({ data }) {
        // console.log(data);
        that.keywordsHistory = data;
      },
      fail() {
        uni.setStorage({
          key: "keywordsHistory",
          data: [],
        });
      },
    });
  },
  methods: {
    saveKeywordHistoryStorage(key, data) {
      return new Promise((resolve) => {
        uni.setStorage({
          key,
          data,
        });
        resolve();
      });
    },
    setCurrentValue(k) {
      this.currentValue = k;
    },
    inputClear() {
      this.moments = [];
      this.keywords = [];
    },
    async keywordChange({ value }) {
      if (value !== "") {
        uni.showLoading({
          title: "搜索中...",
        });
        this.keywordsHistory = [
          value,
          ...this.keywordsHistory.filter((v) => v !== value).slice(0, 10),
        ];
        await this.saveKeywordHistoryStorage(
          "keywordsHistory",
          this.keywordsHistory
        );
        const keywords = value.replace(/\s+/).split("");
        const keywordsUri = encodeURI(keywords.join(" "));
        const searchRes = await this.request({
          url: `${this._config.nestServerUrl}/api/search/search?limit=5&keywords=${keywordsUri}`,
          method: "GET",
        });
        this.keywords = keywords;
        const data = searchRes.data.data;
        const { moments } = data.searchResult;
        await this.parseMoments(moments);
        uni.hideLoading();
      } else {
        this.keywords = [];
        this.moments = [];
      }
    },
    parseMoments(nmoments) {
      this.moments = [];
      for (const m of nmoments) {
        const {
          title,
          content,
          createAt,
          id,
          imgs,
          videos,
          bestMatch = false,
        } = m;
        const titleWordArray = title.split("");
        const contentWordArray = content.split("");
        let activeCount = 0;
        const titleResultArray = titleWordArray.map((word) => {
          if (this.keywords.includes(word)) {
            activeCount++;
            return {
              active: true,
              word,
            };
          } else {
            return {
              active: false,
              word,
            };
          }
        });
        const contentResultArray = contentWordArray.map((word) => {
          if (this.keywords.includes(word)) {
            activeCount++;
            return {
              active: true,
              word,
            };
          } else {
            return {
              active: false,
              word,
            };
          }
        });
        // console.log(titleResultArray);
        // console.log(contentResultArray);
        let imgsJson = imgs;
        let videosJson = videos;
        if (imgsJson) {
          imgsJson = JSON.parse(imgsJson);
        }
        if (videosJson) {
          videosJson = JSON.parse(videosJson);
        }
        this.moments.push({
          title,
          content,
          titleWordArray,
          contentWordArray,
          titleResultArray,
          contentResultArray,
          activeCount,
          createAt,
          id,
          imgs: imgsJson,
          videos: videosJson,
          bestMatch,
        });
      }
      this.moments.sort((a, b) => b.activeCount - a.activeCount); //通过关键字匹配数量排序
      //根据是否最佳匹配指定
      const m1 = this.moments.filter(({ bestMatch }) => bestMatch);
      const m2 = this.moments.filter(({ bestMatch }) => !bestMatch);
      this.moments = [...m1, ...m2];
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
.history {
  width: 100vw;
  // padding: 20rpx;
  .list {
    width: 100%;
    padding: 30rpx;
    display: flex;
    flex-flow: wrap row;
    align-items: center;
    align-content: center;
    .item {
      $color: rgb(243, 243, 243);
      color: $color;
      font-size: 32rpx;
      padding: 5rpx 30rpx;
      // border: $color solid 2rpx;
      background-color: $color;
      color: rgb(53, 53, 53);
      margin-left: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 200rpx;
      // background-color: #ffffff;
      &.active {
        background-color: #eee;
        opacity: 0.6;
      }
    }
  }
}
</style>
