<template>
  <view class="setting">
    <option-group>
      <!-- <option-item title="允许被关注" /> -->
      <view class="list">
        <view class="item" v-for="(item, index) of setting" :key="index">
          <option-item
            :title="item.name"
            :option-key="item.key"
            :checked="item.value"
            @change="itemChange"
          />
        </view>
      </view>
    </option-group>
    <option-group>
      <!-- <button-item title="退出登录"></button-item> -->
    </option-group>
  </view>
</template>

<script>
import OptionItem from "@/components/mwcomponent/options/option-item";
import OptionGroup from "@/components/mwcomponent/options/option-group";
import LinkItem from "@/components/mwcomponent/options/link-item.vue";
import ButtonItem from "@/components/mwcomponent/options/button-item.vue";
import { createNamespacedHelpers, mapMutations } from "vuex";
const {
  mapState,
  mapMutations: mapSettingMutations,
  mapActions,
} = createNamespacedHelpers("Setting");
export default {
  components: {
    OptionItem,
    OptionGroup,
    LinkItem,
    ButtonItem,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["setting"]),
  },
  methods: {
    ...mapMutations(["setShouldInitMomentPage"]),
    ...mapSettingMutations({
      updateSetting: "update",
    }),
    async itemChange({ value, key, name }) {
      this.request({
        url: `${this._config.nestServerUrl}/api/userinfo/setting`,
        method: "POST",
        data: {
          value,
          key,
          name,
        },
      });
      this.updateSetting({
        key,
        value,
        name,
      });
      this.setShouldInitMomentPage({ shoulInitMomentPage: true });
    },
  },
  async onLoad() {
    const that = this;
    const res = await this.request({
      url: `${this._config.nestServerUrl}/api/userinfo/setting`,
      method: "GET",
    });
    const data = res.data.data;
    const setting = data.setting;
    for (const { key, name, value } of setting) {
      that.updateSetting({
        key,
        name,
        value,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>