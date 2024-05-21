import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.state.user.userToken
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // Token 401处理
    console.dir(error.response.status)
    if (error.response.status === 401) {
      // 1. 清空用户数据
      store.commit('user/clearUserInfo')
      // 2. 跳转到登录
      router.push('/login')
    }
    // 错误统一处理
    Message.error(error.response.data.msg)
    return Promise.reject(error)
  }
)

export default service
