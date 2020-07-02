import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Dialog } from 'vant'

Vue.use(VueRouter)

const routes = [
  {
    // 登录
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/')
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '', // 首页
        name: 'home',
        component: () => import('@/views/home/')
      },
      {
        // 问答
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/')
      },
      {
        // 视频
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/')
      },
      {
        // 我的
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/')
      }
    ]
  },
  {
    // 搜索
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/')
  },
  {
    // 文章详情
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    // 用户资料编辑
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    // 用户主页
    path: '/user/:userId',
    name: 'user',
    component: () => import('@/views/user'),
    props: true
  },
  {
    // 用户关注/粉丝
    path: '/user/:userId/follow',
    name: 'user-follow',
    component: () => import('@/views/user-follow'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    // 我的收藏 / 历史
    path: '/my-article/:type?',
    name: 'user-article',
    component: () => import('@/views/user-article'),
    props: true
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || !to.meta.requiresAuth) {
    return next()
  }

  if (store.state.user) {
    // 如果登录则放行
    return next()
  }

  Dialog.confirm({
    title: '该功能需要登录，确认登录吗？'
  })
    .then(() => {
      next({
        name: 'login',
        query: {
          redirect: from.fullPath
        }
      })
    })
    .catch(() => {})
})

export default router
