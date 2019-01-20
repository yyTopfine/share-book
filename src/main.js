import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: 'share-book-dff74a',
  traceUser: true
})

const app = new Vue(App)
app.$mount()
