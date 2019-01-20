<template>
  <div class="addBookContainer">
    <div class="addBookContainer_content">
      <i-input :value="bookName" @change="changeBookName" title="书名:" placeholder="必填，请输入书名"  />
      <i-input :value="author" @change="changeAuthor" title="作者:" placeholder="必填，请输入作者" />
      <i-input :value="readReaction" @change="changeReadReaction" type="textarea" title="读后感:" placeholder="选填，请输入您的读后感(最多50字)"
               i-class="addBookContainer_content_readReaction" maxlength="50"/>
    </div>
    <i-button @click="addBook" type="primary">添加</i-button>
    <i-toast id="addBookToast" />
  </div>
</template>
<script>
  import store from '../store/store'
  const { $Toast } = require('../../../static/iView/base/index')
  export default {
    data () {
      return {
        bookName: '',
        author: '',
        readReaction: ''
      }
    },
    methods: {
      changeBookName (e) {
        this.bookName = e.mp.detail.detail.value
      },
      changeReadReaction (e) {
        this.readReaction = e.mp.detail.detail.value
      },
      changeAuthor (e) {
        this.author = e.mp.detail.detail.value
      },
      addBook () {
        let _this = this
        if (!_this.bookName && !_this.author) {
          $Toast({
            content: '书名和作者为必填项',
            selector: '#addBookToast',
            type: 'warning'
          })
          return
        }
        store.state.db.collection('shareBook-books').add({
          data: {
            openId: store.state.openId,
            nickName: store.state.userInfo.nickName,
            name: _this.bookName,
            author: _this.author,
            readReaction: _this.readReaction,
            isBorrow: false
          }
        }).then(res => {
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
        })
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
  }

  .addBookContainer_content{
    flex-grow: 1;
    overflow-y: scroll;
  }

  .addBookContainer_content_readReaction{
    height: 80px!important;
  }

</style>
