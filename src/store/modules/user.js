import { loginAPI } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export default {
  state: {
    userToken: getToken() || ''
  },
  mutations: {
    setUserToken (state, value) {
      state.userToken = value
      setToken(value)
    },
    removeUserToken (state) {
      state.userToken = ''
      removeToken()
    }
  },
  actions: {
    // 登录
    async doLogin (store, value) {
      const res = await loginAPI(value)
      console.log(res)
      store.commit('setUserToken', res.data.token)
    }
  }
}
