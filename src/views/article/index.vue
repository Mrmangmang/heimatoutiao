<template>
  <div class="article-container page-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      fixed
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>

    <!-- 加载中：loading -->
    <loading-page v-if="loading"></loading-page>

    <!-- 加载完成：文章详情 -->
    <template v-else-if="article.title">
      <div class="detail">
        <!-- 标题 -->
        <h3>{{ article.title }}</h3>
        <!-- 用户信息 -->
        <article-auth :article="article"></article-auth>
        <!-- 正文内容 -->
        <div
          class="markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
      </div>

      <van-cell ref="comment-area-tip" title="全部评论" :border="false" />

      <!-- 评论列表 -->
      <comment-list
        v-model="articleComments"
        :source="articleId"
        :total-count.sync="commentCount"
        @click-reply="onReplyShow"
      />
      <!-- 底部区域 -->
      <article-footer
        :article="article"
        :comment-count="commentCount"
        @click-write="isPostCommentShow = true"
      />
    </template>

    <!-- 加载失败页面 -->
    <error-page v-else @btn-click="getArticleDetail" />

    <!-- 发布文章评论 -->
    <van-popup
      v-model="isPostCommentShow"
      position="bottom"
      get-container="body"
    >
      <post-comment :target="articleId" @post-success="onPostSuccess" />
    </van-popup>

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      get-container="body"
      :style="{ height: '90%' }"
    >
      <comment-reply
        v-if="isReplyShow"
        :article-id="articleId"
        :comment="currentReplyComment"
        @click-close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import loadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'
import ArticleAuth from '@/components/article-auth'
import articleFooter from './components/article-footer'
import commentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    loadingPage,
    articleFooter,
    ArticleAuth,
    commentList,
    ErrorPage,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: true, // 加载显示状态
      article: {}, // 文章详情
      articleComments: [], // 评论列表
      commentCount: 0, // 评论数量
      isPostCommentShow: false, // 发布评论组件显示状态
      isReplyShow: false,
      currentReplyComment: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getArticleDetail()
  },
  mounted() {},
  methods: {
    async getArticleDetail() {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      this.loading = false
    },

    onPostSuccess(comment) {
      // 将新添加的评论展示到顶部
      this.articleComments.unshift(comment)
      // 评论总数+1
      this.commentCount++
      // 关闭发布评论弹窗
      this.isPostCommentShow = false
    },

    onReplyShow(comment) {
      this.currentReplyComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import url('./githup-markdown.css');
.article-container {
  height: 100%;
  overflow: scroll;
  background: #fff;
}
.detail {
  padding: 20px;
}
.markdown-body {
  padding-bottom: 50px;
}
</style>
