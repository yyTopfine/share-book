<template>
  <div class="addBookContainer">
    <div class="addBookContainer_content">
      <i-input :value="bookInfo.bookName" @change="changeBookInfo($event,'bookName')" title="书名:" placeholder="必填，请输入书名"  />
      <i-input :value="bookInfo.author" @change="changeBookInfo($event,'author')" title="作者:" placeholder="必填，请输入作者" />
      <i-input :value="bookInfo.press" @change="changeBookInfo($event,'press')" title="出版社:" placeholder="必填，请输入出版社" />
      <i-input :value="bookInfo.pressDate" @change="changeBookInfo($event,'pressDate')" title="出版日期:" placeholder="必填，请输入出版社日期" />
      <i-input :value="bookInfo.price" @change="changeBookInfo($event,'price')" title="价格:" placeholder="必填，请输入价格" />
      <i-input :value="bookInfo.bookType" @change="changeBookInfo($event,'bookType')" title="分类:" placeholder="必填，请输入分类" />
      <i-input :value="bookInfo.bookLabel" @change="changeBookInfo($event,'bookLabel')" title="标签:" placeholder="必填，请输入标签" />
    </div>
    <i-button @click="addBook" type="primary">添加</i-button>
    <i-toast id="addBookToast" />
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
        bookInfo: {
          bookName: '',
          author: '',
          press: '',
          pressDate: '',
          price: '',
          bookType: '',
          bookLabel: ''
        },
        isShowLoding: false
      }
    },
    mounted () {
      console.log('xxfdsfds', store.state.userInfo.nickName)
    },
    methods: {
      changeBookInfo (e, id) {
        this.bookInfo[id] = e.mp.detail.detail.value
      },
      addBook () {
        let _this = this
        for (let key in _this.bookInfo) {
          if (!_this.bookInfo[ key ]) {
            console.log(key)
            $Toast({
              content: '表单中有未填项，请填写后提交',
              selector: '#addBookToast',
              type: 'warning'
            })
            return
          }
        }
        _this.isShowLoding = true
        wx.cloud.callFunction({
          name: 'addBook',
          data: {
            provider: store.state.userInfo.nickName,
            bookName: _this.bookInfo.bookName,
            author: _this.bookInfo.author,
            press: _this.bookInfo.press,
            bookType: _this.bookInfo.bookType,
            bookLabel: _this.bookInfo.bookLabel,
            pressDate: _this.bookInfo.pressDate,
            price: _this.bookInfo.price,
            openidVal: store.state.openId,
            borrower: '',
            borrowerDate: ''
          }
        }).then(res => {
          _this.isShowLoding = false
          $Toast({
            content: '添加成功',
            selector: '#addBookToast',
            type: 'success'
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../index/main'
            })
          }, 2000)
        }).catch(e => { _this.isShowLoding = false })
      }
    }
  }
</script>
<style>
  .addBookContainer{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .addBookContainer_content{
    flex-grow: 1;
    overflow-y: scroll;
  }

  .addBookContainer_content_readReaction{
    height: 80px!important;
  }

</style>
