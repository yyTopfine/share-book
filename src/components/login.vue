<template>
  <div>
    <i-modal title="登录确认" :visible="visibleLogin" @ok="loginOk" @cancel = "loginCancel" >
      <view>登录后即可添加图书</view>
    </i-modal>
    <i-modal title="用户信息权限获取申请" :visible="askUserInfo" :show-ok=false @cancel = "askUserInfoCancel" >
      <button  open-type="getUserInfo" @click="authorOk" style="width: 80%;margin: 0 auto;background-color: #2d8cf0">点我授权</button>
    </i-modal>
    <i-toast id="toast" />
  </div>
</template>
<script>
  import store from '../pages/store/store'
  const { $Toast } = require('../../static/iView/base/index')
  export default {
    data () {
      return {
        askUserInfo: false
      }
    },
    props: ['visibleLogin'],
    mounted () {
      let _this = this
      // 未授权时弹授权提示框，反之直接显示注册登录按钮
      if (!_this.visibleLogin) {
        wx.authorize({
          scope: 'scope.userInfo',
          success () {
            _this.visibleLogin = true
            _this.getUserInfo()
          },
          fail () {
            _this.askUserInfo = true
          }
        })
      }
    },
    methods: {
      askUserInfoCancel () {
        this.askUserInfo = false
        this.$emit('loginComplete')
      },
      authorOk () {
        this.askUserInfo = false
        this.$emit('loginComplete')
      },
      loginCancel () {
        this.visibleLogin = false
      },
      getUserInfo () {
        wx.getUserInfo({
          success: (res) => {
            store.commit('setUserInfo', res.userInfo)
          }
        })
      },
      loginOk () {
        this.visibleLogin = false
        let _this = this
        wx.cloud.callFunction({
          name: 'login',
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
          _this.visibleLogin = false
          setTimeout(function () {
            _this.$emit('loginComplete')
          }, 1500)
        }).catch(e => {
          $Toast({
            content: '登录失败',
            type: 'error',
            selector: '#toast'
          })
          _this.visibleLogin = false
          setTimeout(function () {
            _this.$emit('loginComplete')
          }, 1500)
        })
      }
    }
  }
</script>
<style>

</style>
