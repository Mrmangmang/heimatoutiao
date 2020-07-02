<template>
  <!-- 文章评论列表 -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已展示所有评论"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(comment, index) in value"
      :key="index"
      :comment="comment"
      @click-reply="$emit('click-reply', comment)"
    ></comment-item>
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from '../comment-item'
export default {
  name: 'commentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      // 文章id
      type: [String, Number, Object],
      required: true
    },
    value: {
      // 评论列表
      type: Array,
      default: () => []
    },
    totalCount: {
      // 评论数量
      type: Number
    },
    isComment: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null, // 请求下一页数据的页码
      limit: 10 // 一页条数
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    async onLoad() {
      const { data } = await getComments({
        type: this.isComment ? 'c' : 'a', // 查看文章评论：a，查看评论回复：c
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit
      })
      // 处理数据
      const { results, total_count: totalCount } = data.data
      const arr = this.value.slice() // 返回一个新的数组，不建议直接修改原数组
      arr.push(...results)
      this.$emit('input', arr) // 把获取的数据传递给父组件并改变父组件的数据
      this.$emit('update:total-count', totalCount) // 更新父组件数据

      // 结束loading
      this.loading = false

      // 4. 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
