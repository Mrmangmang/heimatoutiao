<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :q="searchText" />

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :q="searchText"
      @search="onSearch"
    />

    <!-- 搜索历史记录 -->
    <search-history v-else v-model="searchHistories" @search="onSearch" />
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false, // 搜索结果显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories(val) {
      // 同步到本地存储
      setItem('search-histories', val)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(q) {
      // 1. 修改搜索框的文本内容
      this.searchText = q
      // 2. 记录搜索历史记录
      const searchHistories = this.searchHistories
      const index = searchHistories.indexOf(this.searchText)
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }
      searchHistories.unshift(this.searchText)
      // 3. 展示搜索结果
      this.isResultShow = true
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 54px;
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    .van-search__action {
      color: #fff;
    }
  }
}
</style>
