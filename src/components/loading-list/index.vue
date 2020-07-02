<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="(item, index) in value" :key="index">
        <slot v-bind:item="item">{{ item }}</slot>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'loadingList',
  props: {
    fn: {
      type: Function,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  methods: {
    async onLoad() {
      const { data } = await this.fn({
        page: this.page,
        per_page: this.perPage
      })
      const { results, total_count: totalCount } = data.data
      this.value.push(...results)
      // 更新总数量
      this.$emit('update:total-count', totalCount)
      // 3. 停止 loading
      this.loading = false
      // 4. 判断是否还有数据
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
