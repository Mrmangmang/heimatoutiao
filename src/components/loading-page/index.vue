<template>
  <div>
    <!-- $attrs 获取父组件绑定的数据 -->
    <van-loading class="loading" v-bind="$attrs" color="#1989fa" vertical>
      <slot>加载中...</slot>
    </van-loading>
  </div>
</template>

<script>
export default {
  name: 'pageLoading'
}
</script>

<style lang="less" scoped>
.loading {
  padding-top: 100px;
  text-align: center;
}
</style>
