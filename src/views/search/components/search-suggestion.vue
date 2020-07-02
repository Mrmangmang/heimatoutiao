<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getSuggestions } from '@/api/search'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    q: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想列表
    }
  },
  computed: {},
  watch: {
    q: {
      handler: debounce(async function() {
        const q = this.q
        if (!q) {
          return
        }
        const { data } = await getSuggestions(q)
        this.suggestions = data.data.options
      }, 200),
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    highlight(str) {
      // 字体高亮
      return str
        .toLowerCase()
        .replace(
          this.q.toLowerCase(),
          `<span style="color: red;">${this.q}</span>`
        )
    }
  }
}
</script>

<style scoped lang="less"></style>
