<template>
  <div class="search-history">
    <van-cell-group>
      <van-cell title="历史记录">
        <template v-if="isDeleteShow">
          <span @click="$emit('update:search-histories', [])">全部删除</span>
          &nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </template>
        <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
      </van-cell>
      <van-cell
        :title="item"
        v-for="(item, index) in searchHistories"
        :key="index"
        @click="onHistoryClick(item, index)"
      >
        <van-icon name="close" v-show="isDeleteShow"></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  model: {
    prop: 'search-histories',
    event: 'update:search-histories'
  },
  props: {
    searchHistories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onHistoryClick(item, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
