<template>
  <div class="user-container page-container">
    <!-- 顶部导航 -->
    <van-nav-bar
      :title="userInfo.name + ' 的个人信息'"
      class="app-nav-bar"
      fixed
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <!-- 用户信息 -->
    <div class="user-info">
      <div class="avatar-wrapper">
        <van-image class="avatar" fit="cover" round :src="userInfo.photo" />
      </div>
      <div class="detail">
        <div class="detail-top">
          <div class="item">
            <div class="count">{{ userInfo.art_count }}</div>
            <div class="text">发布</div>
          </div>
          <div class="item">
            <div class="count">{{ userInfo.follow_count }}</div>
            <div class="text">关注</div>
          </div>
          <div class="item">
            <div class="count">{{ userInfo.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
          <div class="item">
            <div class="count">{{ userInfo.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </div>
        <div class="detail-bottom">
          <van-button
            :type="userInfo.is_following ? 'default' : 'info'"
            size="small"
            @click="userFollow"
            :loading="isLoading"
            >{{ userInfo.is_following ? '已关注' : '关注' }}</van-button
          >
          <van-button type="default" size="small">编辑资料</van-button>
        </div>
      </div>
    </div>

    <!-- 用户简介 -->
    <div class="label-info">
      <div class="bio-wrap">
        <span class="label">简介：</span>
        <span class="text">总有一个人，愿意为你爬上月亮</span>
      </div>
    </div>

    <!-- 文章列表 -->
    <loading-list :fn="getArticlesByUser" v-slot="{ item }">
      <article-item :article="item" :user="userInfo"></article-item>
    </loading-list>
  </div>
</template>

<script>
import { getUserById } from '@/api/user'
import { getArticlesByUser } from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user'
import LoadingList from '@/components/loading-list'
import ArticleItem from '@/components/article-list'

export default {
  name: 'UserPage',
  components: {
    LoadingList,
    ArticleItem
  },
  props: {
    userId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      userInfo: {},
      getArticlesByUser: getArticlesByUser.bind(null, this.userId),
      isLoading: false
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        const { data } = await getUserById(this.userId)
        this.userInfo = data.data
      } catch (error) {
        this.$toast('获取用户信息失败')
      }
    },
    async userFollow() {
      this.isLoading = true
      try {
        if (this.is_following) {
          // 取消关注
          await deleteFollow(this.userId)
        } else {
          // 关注
          await addFollow(this.userId)
        }
        // 更新视图
        this.$set(this.userInfo, 'is_following', !this.userInfo.is_following)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast('你不能关注你自己')
        }
      }
      this.isLoading = false
    }
  },
  computed: {
    is_following() {
      return this.userInfo.is_following
    }
  }
}
</script>

<style lang="less" scoped>
.user-info {
  background-color: #fff;
  padding: 15px;
  display: flex;
  margin-bottom: 10px;
  .avatar-wrapper {
    .avatar {
      width: 85px;
      height: 85px;
    }
  }
  .detail {
    width: 100%;
    .detail-top {
      display: flex;
      justify-content: space-around;
      .item {
        text-align: center;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 12px;
        }
      }
    }
    .detail-bottom {
      display: flex;
      justify-content: space-around;
      .van-button {
        width: 43%;
        margin-top: 12px;
      }
    }
  }
}

.label-info {
  background-color: #fff;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 10px;
  .bio-wrap {
    .label {
      color: #939092;
    }
    .text {
      font-weight: 500;
      margin-left: 7px;
      color: #212121;
    }
  }
}
</style>
