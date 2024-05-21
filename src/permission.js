// 权限控制
import router from '@/router'
import store from '@/store'

// 路由白名单
const WHITE_LIST = ['/login', '/404']

router.beforeEach((to, from, next) => {
  const token = store.state.user.userToken
  if (token) {
    // 有token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
