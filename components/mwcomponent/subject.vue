<template>
  <view class="subject">
    <view class="show" v-if="isShow">
      <view
        v-for="(item, index) in subjects"
        :key="index"
        class="item item-notDel"
      >
        #{{ item }}
      </view>
      <view
        v-for="(item, index) in putSubjects"
        :key="index"
        class="item item-canDel"
        @click="delSub(item, index)"
      >
        #{{ item }}
      </view>
    </view>
    <view class="input" v-if="canInput">
      <input
        class="input-el"
        type="text"
        placeholder="输入标签"
        v-model="inputText"
        :maxlength="10"
      />
      <button
        class="input-add"
        type="primary"
        size="mini"
        :disabled="notAdd"
        @click="addTag"
      >
        添加
      </button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    subjects: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      putSubjects: [],
      inputText: "",
    };
  },
  computed: {
    isShow() {
      return this.subjects.length > 0 || this.putSubjects.length > 0;
    },
    notAdd() {
      return this.inputText === "";
    },
    canInput() {
      return this.putSubjects.length <= 5;
    },
  },
  methods: {
    delSub(item, index) {
      const that = this;
      //   console.log("del");
      uni.showModal({
        title: "是否删除？",
        content: `将标签${item}删除`,
        success(res) {
          if (res.confirm) {
            const temp = that.putSubjects;
            temp.splice(index, 1);
            that.putSubjects = temp;
            that.$emit("change", {
              subjects: [...that.subjects, ...that.putSubjects],
            });
          }
        },
      });
    },
    addTag() {
      const that = this;
      if (this.putSubjects.includes(this.inputText)) {
        uni.showToast({
          title: "已经存在了",
        });
      } else {
        const temp = that.putSubjects;
        temp.push(this.inputText);
        that.putSubjects = temp;
        that.$emit("change", {
          subjects: [...that.subjects, ...that.putSubjects],
        });
        that.inputText = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.subject {
  width: 100%;
  margin-top: 30rpx;
  .input {
    width: 100%;
    display: flex;
    padding: 25rpx 0;
    margin-top: 20rpx;
    border: {
      top: #cfcfcf solid 1rpx;
      bottom: #cfcfcf solid 1rpx;
    }

    &-el {
      flex: 1;
      height: 42rpx;
    }
  }
  .show {
    display: flex;
    flex-flow: row wrap;
    align-content: center;

    .item {
      margin-right: 10rpx;

      &-notDel {
        color: #777;
      }

      &-canDel {
        color: rgb(0, 60, 224);
      }
    }
  }
}
</style>