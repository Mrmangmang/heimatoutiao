import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'
import router from '@/router'

const request = axios.create({
  // 默认请求链接
  baseURL: 'http://ttapi.research.itcast.cn'
})

/**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
request.defaults.transformResponse = [
  function(data) {
    try {
      return jsonBig.parse(data)
    } catch (err) {
      return {}
    }
  }
]

/**
 * 请求拦截，给请求加上请求头
 */
request.interceptors.request.use(
  function(config) {
    const user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截，校验是否有token，如果没有则让用户登录，并且处理token过期操作
 */
request.interceptors.response.use(
  function(response) {
    // 响应成功则直接返回数据
    return response
  },
  async function(error) {
    // 响应失败，如果状态码是401，让用户重新登录获取token
    if (error.response && error.response.status === 401) {
      const user = store.state.user
      if (!user || !user.refresh_token) {
        redirectLogin()
        return
      }
      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })

        // 如果获取成功，则用新的token替换过期的token
        store.commit('setUser', {
          token: res.data.data.token,
          refresh_token: user.refresh_token
        })

        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 server 的请求结果继续返回给发请求的具体位置
        return request(error.config)
      } catch (error) {
        redirectLogin()
      }
    }
    return Promise.reject(error)
  }
)

function redirectLogin() {
  console.log(router.currentRoute.fullPath)
  router.push({
    name: 'login',
    // 这里使用查询参数把要跳转回来的路由地址传递给了登录页面
    // router.currentRoute 就是当前路由对象， 就是 this.$route
    // fullPath  就是当前路由的路径
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
