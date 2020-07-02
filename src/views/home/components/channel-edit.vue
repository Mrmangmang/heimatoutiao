<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div class="title-wrap" slot="title">
        <span class="title">我的频道</span>
        <span class="tip">点击进入频道</span>
      </div>
      <van-button
        type="danger"
        plain
        size="mini"
        round
        @click="isEdit = !isEdit"
        color="#e5615b"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in userChannels"
        :key="channel.id"
        @click="onUserChannelClick(channel, index)"
      >
        <span :class="{ active: active === index }">{{ channel.name }}</span>
        <van-icon
          v-show="isEdit && channel.name !== '推荐'"
          class="close-icon"
          name="close"
        />
      </van-grid-item>
    </van-grid>

    <!-- 推荐频道 -->
    <van-cell :border="false">
      <div class="title-wrap" slot="title">
        <span class="title">推荐频道</span>
        <span class="tip">点击添加频道</span>
      </div>
    </van-cell>
    <van-grid :gutter="10" clickable>
      <van-grid-item
        class="channel-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        @click="AddChannel(channel)"
      >
        <div slot="text" class="text-wrap">
          <span>{{ channel.name }}</span>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { setItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isEdit: false, // 控制状态，修改还是完成
      allChannels: [] // 所有频道
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels() {
      // 获取所有频道
      try {
        const { data } = await getChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('获取数据失败！')
      }
    },
    async AddChannel(channel) {
      // 添加频道
      try {
        this.userChannels.push(channel)
        if (this.user) {
          // 已登录，数据存储到线上
          await addUserChannel([
            {
              id: channel.id, // 频道 id
              seq: this.userChannels.length // 频道的 序号
            }
          ])
        } else {
          // 未登录，数据存储到本地
          setItem('channels', this.userChannels)
        }
      } catch (error) {
        this.$toast('添加频道失败！')
      }
    },
    onUserChannelClick(channel, index) {
      // 切换频道 / 删除频道
      if (this.isEdit && channel.name !== '推荐') {
        // 编辑状态下，执行删除
        this.userChannels.splice(index, 1)
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换
        this.$emit('update:active-index', index)
        this.$emit('close-popup')
      }
    },
    async deleteChannel(channel) {
      // 删除频道
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('channles', this.userChannels)
        }
      } catch (error) {
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      // 思路： 所有频道 - 我的频道 = 推荐频道
      return this.allChannels.filter(item => {
        return !this.userChannels.find(userItem => userItem.id === item.id)
      })
    }
  }
}
</script>

<style scoped lang="less">
.title-wrap {
  .title {
    margin-right: 10px;
    font-size: 16px;
  }
  .tip {
    font-size: 12px;
    color: #ccc;
  }
}

.channel-edit {
  .channel-item {
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text {
        color: #222;
        font-size: 28px;
      }
    }
  }
}

.active {
  color: #e5615b;
}

.close-icon {
  font-size: 15px;
  position: absolute;
  right: -3px;
  top: -4px;
}
</style>
