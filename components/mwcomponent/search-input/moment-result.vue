<template>
  <view class="result">
    <template v-if="!showEmpty">
      <view class="list">
        <navigator
          :url="`../moment/detail/detail?id=${item.id}`"
          class="item"
          v-for="(item, index) of moments"
          :key="index"
        >
          <view class="title">
            <text
              v-for="(word, wIndex) of item.titleResultArray"
              :key="wIndex"
              :class="[
                'word',
                {
                  active: word.active,
                },
              ]"
            >
              {{ word.word }}
            </text>
          </view>
          <view class="content">
            <text
              v-for="(word, wIndex) of item.contentResultArray"
              :key="wIndex"
              :class="[
                'word',
                {
                  active: word.active,
                },
              ]"
            >
              {{ word.word }}
            </text>
          </view>
          <view class="media">
            <template v-if="item.imgs">
              <trip-img-grid :images="item.imgs"></trip-img-grid>
            </template>
            <template v-if="item.videos">
              <video :src="item.videos[0]" @click.stop></video>
            </template>
          </view>
          <view class="bottom">
            <view class="block best-match" v-if="item.bestMatch">最佳匹配</view>
            <view class="block time">{{ parseDateToStr(item.createAt) }}</view>
          </view>
        </navigator>
      </view>
    </template>
    <template v-else>
      <empty-block title="没有合适的匹配结果"></empty-block>
    </template>
  </view>
</template>

<script>
import EmptyBlock from "../empty-block.vue";
import tripImgGrid from "../trip-img-grid.vue";
export default {
  components: { tripImgGrid, EmptyBlock },
  props: {
    moments: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    showEmpty() {
      return this.moments <= 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.result {
  width: 100%;
  .list {
    width: 100%;
    .item {
      width: 100%;
      background-color: #ffffff;
      padding: 10rpx 15rpx;
      $borderColor: rgb(238, 238, 238);
      .title {
        font-size: 30rpx;
        font-weight: bold;
        color: #3b424c;
        padding: 10rpx 15rpx;
        border-bottom: $borderColor solid 1rpx;
      }
      .content {
        font-size: 24rpx;
        color: #3b424c;
        padding: 10rpx 15rpx;
      }
      .word {
        &.active {
          background-color: rgba(206, 206, 143, 0.637);
        }
      }
      .bottom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .block {
          // display: inline-block;
          font-size: 24rpx;
          padding: 10rpx 15rpx;
          border: #babcc9 solid 1rpx;
          border-radius: 200rpx;
          overflow: hidden;
          background-color: #ffffff;
          &.best-match {
            $color: #2bd199;
            color: $color;
            border-color: $color;
            margin-right: 10rpx;
          }
          &.time {
            $color: #babcc9;
            color: $color;
            border-color: $color;
          }
        }
      }
    }
  }
}
</style>