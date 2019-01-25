<template>
  <div class="homePgeContainer">
    <div class="homePgeContainer_bookContainer">
      <div class="homePgeContainer_content_bookItem homePgeContainer_content_bookItem--book" @click="goBookDetail(item._id)"
           v-for="item in bookList" :key="id">{{item.name}}</div>
      <div class="homePgeContainer_content_bookItem" @click="addBook">
        <button open-type="getUserInfo"/>
        <i-icon type="add" size="28" class="homePgeContainer_content_bookItem--icon"/>
      </div>
    </div>
    <Login :visibleLogin = 'visibleLogin'></Login>
  </div>
</template>

<script>
import store from '../store/store'
import login from '../../components/login'
export default {
  data () {
    return {
      current: 'homepage',
      bookList: [],
      visibleLogin: false,
      askUserInfo: false,
      showLoginComponen: false,
      hasRegister: false
    }
  },

  components: {
    login
  },
  onShow () {
    let _this = this
    // 调用云函数，返回用户openId，参数为云函数名称
    wx.cloud.callFunction({ name: 'getOpenId' }).then(res => {
      console.log('云函数返回', res)
      store.commit('setOpenId', res.result.openid)
    })
    store.state.db.collection('shareBook-books').get().then(res => {
      // res.data 包含该记录的数据
      _this.bookList = res.data
    })
  },

  methods: {
    goBookDetail (id) {
      wx.navigateTo({
        url: '../book/main?id=' + id
      })
    },
    addBook () {
      let _this = this
      // 判断用户是否注册过，没注册过需要检测是否授权获取用户信息，供后续登录使用
      store.state.db.collection('shareBook-user').where({openId: store.state.openId}).get().then(res => {
        _this.hasRegister = res.data.length !== 0
        if (!_this.hasRegister) { // 未注册
          wx.getSetting({
            success (res) {
              _this.showLoginComponen = true
              if (!res.authSetting['scope.userInfo']) { // 未授权
                _this.visibleLogin = false
              } else { // 已授权（未注册即未登录）
                _this.visibleLogin = true
              }
            }
          })
        } else { //  已注册（即登录）
          wx.navigateTo({
            url: '../addBook/main'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .homePgeContainer{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .homePgeContainer_bookContainer{
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    align-content: flex-start;
  }

  .homePgeContainer_content_bookItem{
    width: 26%;
    height: 26%;
    margin-top: 5.5%;
    background-color: gainsboro;
    margin-left: 5.5%;
  }

  .homePgeContainer_content_bookItem--book{
    box-sizing:border-box;
    padding:10px 5px;
    font-size:16px;
    font-weight:bolder;
  }

  .homePgeContainer_content_bookItem--icon{
    display: block;
    text-align: center;
    margin-top: 60%;
  }
</style>
