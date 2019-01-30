<template>
  <div class="isdnContainer">
    <image class="isdnContainer_isbnImage" src="cloud://share-book-dff74a.7368-share-book-dff74a/isbn.png" @click="addBook" />
    <div class="isdnContainer_text">点图标扫码获取书籍信息</div>
    <i-button @click="addNotAuto" type="primary" style="width: 70%;margin: 0 auto;display: block">无法扫码,手动添加</i-button>
    <i-toast id="isbnAdd" />
    <i-spin custom fix v-if="isShowLoding">
      <i-icon type="refresh" size="20" i-class="icon-load"></i-icon>
      <view>Loading</view>
    </i-spin>
  </div>
</template>
<script>
  import store from '../store/store'
  const { $Toast } = require('../../../static/iView/base/index')
  export default {
    data () {
      return {
        isdnCode: '',
        isShowLoding: false
      }
    },
    methods: {
      addNotAuto () {
        wx.navigateTo({
          url: '../addBook/main'
        })
      },
      addBook () {
        let _this = this
        wx.scanCode({
          success (res) {
            _this.isdnCode = res.result
            _this.isShowLoding = true
            wx.cloud.callFunction({
              name: 'getIsbnInfo',
              data: {
                isbn: _this.isdnCode
              }
            }).then(res => {
              _this.isShowLoding = false
              console.log('info:', JSON.parse(res.result))
              store.commit('setBookInfo', JSON.parse(res.result))
              wx.navigateTo({
                url: '../addBook/main'
              })
            }).catch(e => {
              _this.isShowLoding = false
              $Toast({
                content: '扫码获取信息失败，请手动添加',
                selector: '#isbnAdd',
                type: 'warning'
              })
            })
          }
        })
      }
    }
  }
</script>
<style>
  .isdnContainer_isbnImage{
    display: block;
    width: 70%;
    margin-left: 15%;
    height: 90px;
    margin-top: 30%;
  }
  .isdnContainer_text{
    font-size: 16px;
    text-align: center;
    line-height: 38px;
    color: #ccc;
    margin-bottom: 80px;
  }
</style>
