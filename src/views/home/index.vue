<template>
  <div class="home-container page-container">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <div class="logo"></div>
      <van-button
        class="search-btn"
        round
        icon="search"
        type="info"
        size="small"
        @click="$router.push('/search')"
        >搜索</van-button
      >
    </div>

    <!-- 频道列表 -->
    <van-tabs
      v-model="active"
      class="fixed-tabs"
      animated
      v-if="channels.length"
      ref="tabs"
    >
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表组件 -->
        <article-list :channel="channel" class="article-list"></article-list>
      </van-tab>
      <!-- 右侧菜单图标 -->
      <div slot="nav-right" class="van-tab" style="flex: 0 0 8%;">
        <van-icon
          slot="nav-right"
          class="wap-nav"
          name="wap-nav"
          @click="isChannelEditShow = true"
        />
      </div>
    </van-tabs>

    <!-- 频道编辑 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      round
      :overlay="false"
      style="height: 100%;"
      class="channel-edit-popup"
    >
      <van-nav-bar title="编辑频道">
        <van-icon
          name="cross"
          slot="left"
          size="20"
          @click="isChannelEditShow = false"
        />
      </van-nav-bar>
      <channel-edit
        :user-channels="channels"
        :active="active"
        :active-index.sync="active"
        @close-popup="isChannelEditShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getItem, setItem } from '@/utils/storage'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
export default {
  name: 'homeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0, // 控制激活的标签页
      isChannelEditShow: false, // 弹窗的显示状态
      channels: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    // 当用户退出，切换用户时，更新频道列表
    user() {
      // 清空频道列表
      this.channels = []
      // 初始化激活标签
      this.active = 0
    }
  },
  activated() {
    // 如果没有频道数据，则请求加载
    if (!this.channels.length) {
      this.getChannels()
    }
  },
  created() {
    this.getChannels()
  },
  methods: {
    async getChannels() {
      let channels = []
      if (this.user) {
        // 已登录，请求获取用户频道列表
        const { data } = await getUserChannels()
        channels = data.data.channels
        setItem('channels', channels)
      } else {
        // 未登录
        const localChannels = getItem('channels')
        if (localChannels) {
          // 使用本地存储的频道列表
          channels = localChannels
        } else {
          // 没有就使用默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    }
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  width: 100%;
  height: 46px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #3196fa;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
  z-index: 1;
  .logo {
    background: url('../../assets/logo.png');
    width: 100px;
    height: 30px;
    background-size: cover;
  }
  .search-btn {
    width: 50%;
    border: none;
    background-color: #5babfb;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
}

.fixed-tabs {
  padding-top: 44px;
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    right: 0;
    left: 0;
    z-index: 2;
  }
  .wap-nav {
    position: fixed;
    right: 0;
    background-color: #fff;
    opacity: 0.8;
    font-size: 26px;
    line-height: 43px;
  }
}

/deep/ .van-tabs {
  .van-tab {
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
  }
  .van-tabs__line {
    width: 15px !important;
    background-color: #3296fa;
    bottom: 20px;
  }
}

.article-list {
  min-height: 80vh;
}
</style>
