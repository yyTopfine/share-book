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
    <i-modal title="登录确认" :visible="visibleLogin" @ok="loginOk" @cancel = "loginCancel" >
      <view>登录后即可添加图书</view>
    </i-modal>
    <i-modal title="用户信息权限获取申请" :visible="askUserInfo" :show-ok=false @cancel = "askUserInfo = false" >
      <button  open-type="getUserInfo" @click="authorOk" style="width: 80%;margin: 0 auto;background-color: lightblue">点我授权</button>
    </i-modal>
    <i-toast id="toast" />
  </div>
</template>

<script>
import store from '../store/store'
const { $Toast } = require('../../../static/iView/base/index')
export default {
  data () {
    return {
      current: 'homepage',
      bookList: [],
      visibleLogin: false,
      askUserInfo: false
    }
  },

  components: {
  },
  created () {
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
    getUserInfo () {
      wx.getUserInfo({
        success: (res) => {
          store.commit('setUserInfo', res.userInfo)
        }
      })
    },
    authorOk () {
      this.askUserInfo = false
    },
    goBookDetail (id) {
      wx.navigateTo({
        url: '../book/main?id=' + id
      })
    },
    loginCancel () {
      this.visibleLogin = false
    },
    loginOk () {
      this.visibleLogin = false
      store.state.db.collection('shareBook-user').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          openId: store.state.openId,
          nickName: store.state.userInfo.nickName,
          avatarUrl: store.state.userInfo.avatarUrl
        }
      }).then(res => {
        $Toast({
          content: '登录成功',
          type: 'success',
          selector: '#toast'
        })
      })
    },
    addBook () {
      let userRecord = []
      let _this = this
      store.state.db.collection('shareBook-user').where({openId: store.state.openId}).get().then(res => {
        console.log('查询', res.data)
        userRecord = res.data
        wx.getSetting({
          success (res) {
            if (!res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success () {
                  if (userRecord.length === 0) {
                    _this.visibleLogin = true
                    _this.getUserInfo()
                  } else {
                    wx.navigateTo({
                      url: '../addBook/main'
                    })
                  }
                },
                fail () {
                  _this.askUserInfo = true
                }
              })
            } else {
              if (userRecord.length === 0) {
                _this.visibleLogin = true
                _this.getUserInfo()
              } else {
                wx.navigateTo({
                  url: '../addBook/main'
                })
              }
            }
          }
        })
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
