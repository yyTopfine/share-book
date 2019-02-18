<template>
  <div class="homePgeContainer">
    <i-notice-bar icon="systemprompt" loop v-if="showNotice">
      您有图书将于一周后到期，请注意按时归还！
    </i-notice-bar>
    <div class="homePgeContainer_bookContainer">
      <div class="homePgeContainer_content_bookItem homePgeContainer_content_bookItem--book" @click="goBookDetail(item._id)" v-for="item in bookList" :key="id" style="position: relative">
        <image :src="item.bookFaceId" style="width: 100%;height: 100%;display: block"></image>
        <span v-if="item.isManual" style="position: absolute;top:5px;left: 10px;color: yellow;right: 5px;font-size: 12px">{{item.bookName}}</span>
        <image v-if="item.isBorrow" src="cloud://share-book-dff74a.7368-share-book-dff74a/borrowFlag.png" style="position: absolute;top:60px;width: 50px;height: 50px;display: block;left: 23px"/>
        <!--<span style="position: absolute;bottom:5px;color: yellow;right: 10px;font-size: 8px">{{item.provider}}</span>-->
      </div>
      <div class="homePgeContainer_content_bookItem" @click="addBook">
        <button open-type="getUserInfo"/>
        <i-icon type="add" size="28" class="homePgeContainer_content_bookItem--icon"/>
      </div>
    </div>
    <login :visibleLogin = 'visibleLogin' v-if="showLoginComponen" @loginComplete="loginComplete"></login>
    <i-spin custom fix v-if="isShowLoding">
      <i-icon type="refresh" size="20" i-class="icon-load"></i-icon>
      <view>Loading</view>
    </i-spin>
  </div>
</template>

<script>
import store from '../store/store'
import login from '@/components/login'
export default {
  data () {
    return {
      current: 'homepage',
      bookList: [],
      visibleLogin: false,
      askUserInfo: false,
      showLoginComponen: false,
      hasRegister: false,
      showNotice: false,
      isShowLoding: false
    }
  },
  components: {
    login
  },
  mounted () {
    // 调用云函数，返回用户openId，参数为云函数名称
    wx.cloud.callFunction({ name: 'getOpenId' }).then(res => {
      console.log('云函数返回', res)
      store.commit('setOpenId', res.result.openid)
      this.checkIsShowNotice()
    })
  },
  onShow () {
    this.isShowLoding = true
    this.getBookList()
    /* store.state.db.collection('shareBook-books').get().then(res => {
      // res.data 包含该记录的数据
      console.log('ssss11', res)
      _this.bookList = res.data
    }) */
    this.checkIsShowNotice()
  },

  methods: {
    async getBookList () {
      const countResult = await store.state.db.collection('shareBook-books').count()
      const total = countResult.total
      const batchTimes = Math.ceil(total / 20)
      let _this = this
      _this.bookList.splice(0, _this.bookList.length)
      for (let i = 0; i < batchTimes; i++) {
        store.state.db.collection('shareBook-books').skip(i * 20).limit(20).get().then(res => {
          // res.data 包含该记录的数据
          _this.bookList = _this.bookList.concat(res.data)
          if (i === batchTimes - 1) {
            _this.isShowLoding = false
          }
        })
      }
    },
    checkIsShowNotice () {
      let _this = this
      _this.showNotice = false
      store.state.db.collection('shareBook-books').where({borrower: store.state.openId}).get().then(res => {
        let borrowBook = res.data
        for (let i = 0; i < borrowBook.length; i++) {
          let time = new Date(borrowBook[i].borrowDate).getTime() - new Date().getTime()
          borrowBook.borrowEnd = '归还剩余天数：' + parseInt(time / (1000 * 60 * 60 * 24)) + '天'
          if (parseInt(time / (1000 * 60 * 60 * 24)) <= 2) {
            _this.showNotice = true
          }
        }
      })
    },
    goBookDetail (id) {
      wx.navigateTo({
        url: '../book/main?id=' + id
      })
    },
    loginComplete () {
      this.showLoginComponen = false
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
                wx.getUserInfo({
                  success: (res) => {
                    store.commit('setUserInfo', res.userInfo)
                  }
                })
                _this.visibleLogin = true
              }
            }
          })
        } else { //  已注册（即登录）
          store.commit('setUserInfo', res.data[0])
          wx.navigateTo({
            url: '../sibnAddBook/main'
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
    height: 150px;
    margin-top: 5.5%;
    background-color: gainsboro;
    margin-left: 5.5%;
  }

  .homePgeContainer_content_bookItem--book{
    box-sizing:border-box;
    font-size:13px;
    font-weight:bolder;
  }

  .homePgeContainer_content_bookItem--icon{
    display: block;
    text-align: center;
    margin-top: 60%;
  }
</style>
