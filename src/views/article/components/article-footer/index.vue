<template>
  <div class="footer">
    <van-button
      class="write-btn"
      type="default"
      round
      size="small"
      @click="$emit('click-write')"
      >写评论</van-button
    >
    <van-icon class="comment-icon" name="comment-o" :info="commentCount" />
    <van-icon
      :name="article.is_collected ? 'star' : 'star-o'"
      :color="article.is_collected ? 'orange' : ''"
      @click="onCollect"
    ></van-icon>
    <van-icon
      :color="article.attitude === 1 ? '#e5645f' : ''"
      :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
      @click="onLike"
    ></van-icon>
  </div>
</template>

<script>
import { addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'

export default {
  name: 'ArticleFooter',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    async onCollect() {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const article = this.article
        if (article.is_collected) {
          await deleteCollect(article.art_id.toString())
        } else {
          await addCollect(article.art_id.toString())
        }
        article.is_collected = !article.is_collected
        this.$toast.success(article.is_collected ? '收藏成功' : '取消收藏成功')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    },
    async onLike() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const article = this.article
        if (article.attitude === 1) {
          await deleteLike(article.art_id.toString())
        } else {
          await addLike(article.art_id.toString())
        }
        article.attitude = article.attitude === -1 ? 1 : -1
        this.$toast.success(article.attitude === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  box-sizing: border-box;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 160px;
  }
  .van-icon {
    font-size: 20px;
  }
  .comment-icon {
    bottom: -2px;
  }
}
</style>
