<template>
  <view class="message">
    <template v-if="showUnReadeMessage">
      <color-title-container
        :title="`未读消息（${unReadeMessageCount}条）`"
        more="全部设为已读"
        @navigator-click="clearAllMessage"
      >
        <view class="list">
          <view
            class="item"
            v-for="(item, index) of unReadeMessage"
            :key="index"
            @click="clearItemMessage(index)"
          >
            <template v-if="item.mtype === 'system'">
              <system-item
                :title="item.title"
                :content="item.content"
                :created-at="parseDateToStr(item.createdAt)"
                :url="genUrlWithQuery(messageType[item.mtype], item.query)"
              ></system-item>
            </template>
            <template v-if="item.mtype === 'moment'">
              <moment-item
                :title="item.title"
                :content="item.content"
                :created-at="parseDateToStr(item.createdAt)"
                :url="genUrlWithQuery(messageType[item.mtype], item.query)"
                :avator="item.avator"
              ></moment-item>
            </template>
          </view>
        </view>
      </color-title-container>
    </template>
    <template v-if="showReadedMessage">
      <color-title-container :title="`已读消息（${readedMessageCount}条）`">
        <view class="list">
          <view
            class="item"
            v-for="(item, index) of readedMessage"
            :key="index"
          >
            <template v-if="item.mtype === 'system'">
              <system-item
                :title="item.title"
                :content="item.content"
                :created-at="parseDateToStr(item.createdAt)"
                :url="genUrlWithQuery(messageType[item.mtype], item.query)"
              ></system-item>
            </template>
            <template v-if="item.mtype === 'moment'">
              <moment-item
                :title="item.title"
                :content="item.content"
                :created-at="parseDateToStr(item.createdAt)"
                :url="genUrlWithQuery(messageType[item.mtype], item.query)"
                :avator="item.avator"
              ></moment-item>
            </template>
          </view>
        </view>
      </color-title-container>
    </template>
    <template v-if="showEmpty">
      <empty-block title="没有任何消息" />
    </template>
  </view>
</template>

<script>
import colorTitleContainer from "@/components/mwcomponent/color-title-container.vue";
import EmptyBlock from "@/components/mwcomponent/empty-block.vue";
import SystemItem from "@/components/mwcomponent/message/system-item.vue";
import MomentItem from "@/components/mwcomponent/message/moment-item.vue";
export default {
  components: { colorTitleContainer, EmptyBlock, SystemItem, MomentItem },
  data() {
    return {
      messageType: {
        system: "./system",
        moment: "../../moment/detail/detail",
      },
      limit: 30,
      page: 0,
      unReadeMessage: [],
      readedMessage: [],
    };
  },
  computed: {
    showUnReadeMessage() {
      return this.unReadeMessage.length > 0;
    },
    unReadeMessageCount() {
      const len = this.unReadeMessage.length;
      return len > 99 ? `99+` : len;
    },
    showReadedMessage() {
      return this.readedMessage.length > 0;
    },
    readedMessageCount() {
      const len = this.readedMessage.length;
      return len > 99 ? `99+` : len;
    },
    showEmpty() {
      return !this.showUnReadeMessage && !this.showReadedMessage;
    },
  },
  methods: {
    async clearAllMessage() {
      const ids = this.unReadeMessage.map(({ id }) => id);
      await this.request({
        url: `${this._config.nestServerUrl}/api/message/set-readed`,
        method: "POST",
        data: {
          ids,
          readed: 1,
        },
      });
      this.readedMessage.push(...this.unReadeMessage);
      this.unReadeMessage = [];
    },
    async clearItemMessage(index) {
      const tmp = this.unReadeMessage;
      const item = tmp[index];
      await this.request({
        url: `${this._config.nestServerUrl}/api/message/set-readed`,
        method: "POST",
        data: {
          ids: [item.id],
          readed: 1,
        },
      });
      tmp.splice(index, 1);
      this.readedMessage.unshift(item);
      this.unReadeMessage = tmp;
    },
    async getNextMsg() {
      const that = this;
      const messageRes = await that.request({
        url: `${this._config.nestServerUrl}/api/message/message?limit=${
          that.limit
        }&page=${that.page++}`,
        method: "GET",
      });
      const data = messageRes.data.data;
      const messages = data.messages;
      for (const msg of messages) {
        if (msg.query) {
          msg.query = JSON.parse(msg.query);
        }
        if (msg.readed !== 1) {
          that.unReadeMessage.push(msg);
        } else {
          that.readedMessage.push(msg);
        }
      }
    },
  },
  async onLoad() {
    await this.getNextMsg();
  },
  async onReachBottom() {
    await this.getNextMsg();
  },
};
</script>

<style>
page {
  background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
.list {
  .item {
    margin-top: 20rpx;
    &:not(:last-child) {
      margin-bottom: 56rpx;
    }
  }
}
</style>