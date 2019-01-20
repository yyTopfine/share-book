// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    openId: '',
    userInfo: {},
    db: wx.cloud.database()
  },
  mutations: {
    setOpenId: (state, id) => {
      const obj = state
      obj.openId = id
    },
    setUserInfo: (state, Obj) => {
      const obj = state
      obj.userInfo = Obj
    }
  }
})

export default store
