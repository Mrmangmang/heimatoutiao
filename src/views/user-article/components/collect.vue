<template>
  <div class="collect-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <template v-for="item in list">
        <article-item
          :article="item"
          :key="item.art_id.toString()"
        ></article-item>
      </template>
    </van-list>
  </div>
</template>

<script>
import { getCollectArticles } from '@/api/article'
import ArticleItem from '@/components/article-list'

export default {
  name: 'collect',
  components: {
    ArticleItem
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  methods: {
    async onLoad() {
      this.finished = true
      try {
        const { data } = await getCollectArticles({
          page: this.page,
          per_page: this.perPage
        })

        const { results } = data.data
        this.list.push(...results)

        this.loading = false

        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        this.$toast.fail('获取信息失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
