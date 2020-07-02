<template>
  <div class="user-article">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="收藏/历史"
      left-arrow
      fixed
      @click-left="$router.back()"
    />

    <!-- tab导航 -->
    <van-tabs v-model="active" sticky animated color="#3296fa">
      <van-tab title="我的收藏">
        <collect />
      </van-tab>
      <van-tab title="我的历史">
        <history />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Collect from './components/collect'
import History from './components/history'
export default {
  name: 'userArticle',
  components: {
    Collect,
    History
  },
  props: {
    type: {
      type: String
    }
  },
  data() {
    let active = ['collect', 'history'].indexOf(this.type)
    return {
      active,
      routes: ['collect', 'history']
    }
  },
  // 当前页面离开时触发
  beforeRouteLeave(to, from, next) {
    // 如果跳转文章详情页，则缓存当前页面
    if (to.name === 'article') {
      this.$store.commit('addCachePage', 'userArticle')
    } else {
      this.$store.commit('removeCachePage', 'userArticle')
    }

    next()
  }
}
</script>

<style lang="less" scoped>
.user-article {
  padding-top: 90px;
  padding-bottom: 50px;
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
