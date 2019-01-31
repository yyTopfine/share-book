<template>
  <div class="mineContainer">
    <i-card v-if="userInfo.nickName" :title="userInfo.nickName" i-class="mineContainer_i-card" full=true :thumb="userInfo.avatarUrl">
    </i-card>
    <i-button v-if="!userInfo.nickName" @click="login" type="primary">未登录，点我登录</i-button>
    <i-collapse>
      <i-collapse-item title="我提供的图书" name="name1" i-class="collapseSelf">
        <view slot="content" v-if="providerBook.length">

          <i-swipeout  i-class="i-swipeout-demo-item" :actions="actions1"
                       v-for="item in providerBook" :key="_id" @change="returnConfirm(item._id,false,$event)">
            <view slot="content" style="padding: 0px">
              <i-cell i-class="i-cell-padding" :title="item.bookName" :label="item.press">
              </i-cell>
            </view>
          </i-swipeout>

          <!--<i-cell v-for="item in providerBook" :key="_id" i-class="i-cell-padding" :title="item.bookName" :label="item.press"></i-cell>-->
        </view>
        <view slot="content" v-if="!providerBook.length">
          <image style="display: block;width: 80%;margin-left: 10%;height: 100px" src="cloud://share-book-dff74a.7368-share-book-dff74a/404img.png"></image>
          <div style="font-size: 12px;color: #ccc;text-align: center;line-height: 20px">还没有提供过图书，欢迎去书架添加</div>
        </view>
      </i-collapse-item>
      <i-collapse-item title="我借阅的图书" name="name2" i-class="collapseSelf">
        <view slot="content" v-if="borrowBook.length">
          <i-swipeout  i-class="i-swipeout-demo-item" :actions="actions"
                       v-for="item in borrowBook" :key="_id" @change="returnConfirm(item._id,true,$event)">
            <view slot="content" style="padding: 0px">
              <i-cell
                i-class="i-cell-padding"
                :title="item.bookName"
                :label="item.borrowEnd">
              </i-cell>
            </view>
          </i-swipeout>
        </view>
        <view slot="content" v-if="!borrowBook.length">
          <image style="display: block;width: 80%;margin-left: 10%;height: 100px" src="cloud://share-book-dff74a.7368-share-book-dff74a/404img.png"></image>
          <div style="font-size: 12px;color: #ccc;text-align: center;line-height: 20px">没有借阅图书，欢迎浏览书架借阅</div>
        </view>
      </i-collapse-item>
    </i-collapse>
    <i-modal :title="modalTitle" :visible="borrowConfirm" @ok="returnBook" @cancel = "borrowConfirm = false" >
      <view>{{modalContent}}</view>
    </i-modal>
    <i-toast id="returnBookToast" />
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
const { $Toast } = require('../../../static/iView/base/index')
export default {
  data () {
    return {
      actions: [
        {
          name: '归还',
          color: '#fff',
          width: 100,
          background: '#ed3f14'
        }
      ],
      actions1: [
        {
          name: '回收',
          color: '#fff',
          width: 100,
          background: '#ed3f14'
        }
      ],
      borrowConfirm: false,
      toggle: true,
      isShowLoding: false,
      providerBook: [],
      borrowBook: [],
      bookId: '',
      showLoginComponen: false,
      visibleLogin: false,
      isReturn: true,
      modalTitle: '归还确认',
      modalContent: '确认已将图书归还至骏梦图书馆',
      userInfo: {
        nickName: ''
      }
    }
  },
  components: {
    login
  },
  onShow () {
    let _this = this
    store.state.db.collection('shareBook-user').where({openId: store.state.openId}).get().then(res => {
      if (res.data.length !== 0) {
        _this.userInfo = res.data[0]
      }
    })
    store.state.db.collection('shareBook-books').where({openidVal: store.state.openId}).get().then(res => {
      _this.providerBook = res.data
    })
    store.state.db.collection('shareBook-books').where({borrower: store.state.openId}).get().then(res => {
      _this.borrowBook = res.data
      for (let i = 0; i < _this.borrowBook.length; i++) {
        let time = new Date(_this.borrowBook[i].borrowDate).getTime() - new Date().getTime()
        _this.borrowBook[i].borrowEnd = '归还剩余天数：' + parseInt(time / (1000 * 60 * 60 * 24)) + '天'
      }
    })
  },
  methods: {
    loginComplete () {
      let _this = this
      this.showLoginComponen = false
      store.state.db.collection('shareBook-user').where({openId: store.state.openId}).get().then(res => {
        if (res.data.length !== 0) {
          _this.userInfo = res.data[0]
        }
      })
    },
    login () {
      let _this = this
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
    },
    returnBook () {
      let _this = this
      this.borrowConfirm = false
      _this.isShowLoding = true
      wx.cloud.callFunction({
        name: _this.isReturn ? 'returnBook' : 'recyclBook',
        data: {
          bookId: _this.bookId
        }
      }).then(res => {
        _this.isShowLoding = false
        if (_this.isReturn) {
          store.state.db.collection('shareBook-books').where({borrower: store.state.openId}).get().then(res => {
            _this.borrowBook = res.data
            for (let i = 0; i < _this.borrowBook.length; i++) {
              let time = new Date(_this.borrowBook[i].borrowDate).getTime() - new Date().getTime()
              _this.borrowBook[i].borrowEnd = '归还剩余天数：' + parseInt(time / (1000 * 60 * 60 * 24)) + '天'
            }
          })
        } else {
          store.state.db.collection('shareBook-books').where({openidVal: store.state.openId}).get().then(res => {
            _this.providerBook = res.data
          })
        }
        $Toast({
          content: _this.isReturn ? '归还成功' : '回收成功',
          selector: '#returnBookToast',
          type: 'success'
        })
      }).catch(e => {
        _this.borrowDate = ''
        _this.isShowLoding = false
        $Toast({
          content: _this.isReturn ? '归还失败' : '回收失败',
          selector: '#returnBookToast',
          type: 'success'
        })
      })
      this.bookId = ''
    },
    returnConfirm (id, flag, e) {
      this.borrowConfirm = true
      this.bookId = id
      this.isReturn = flag
      this.modalTitle = flag ? '归还确认' : '回收确认'
      this.modalContent = flag ? '确认已将图书归还至骏梦图书馆' : '确认已将图书从骏梦图书馆收回'
    }
  }
}
</script>

<style >
  i-cell >view{
    border: 1px solid #ccc;
  }

  .i-swipeout-demo-item > view{
    padding: 0px!important;
    border-top:0px solid #ccc!important;
    border-left:0px solid #ccc!important;
    border-right:0px solid #ccc!important;
    margin-bottom: 5px!important;
  }

  .i-swipeout-demo-item{
    border: 0px!important;
  }

  .mineContainer{
    height: 100%;
  }

  .mineContainer_i-card{
    border-top: 0px!important;
    padding: 0px!important;
  }
  .mineContainer_i-card view{
    margin: 6px 10px;
    font-weight: bolder;
    font-size: 20px;
  }
  .mineContainer_i-card image{
    margin-right: 20px;
  }

  .collapseSelf{
    border: 0px!important;
    padding: 12px 8px!important;
  }

  .i-collapse-item-title{
    font-size: 13px!important;
    font-weight: bolder!important;
  }
</style>
