<template>
  <div class="bookContainer">
    <div class="bookContainer_content">
      <div class="bookContainer_content_info">
        <img src="http://via.placeholder.com/70X80/add8e6/fff" class="bookContainer_content_info_icon">
        <div class="bookContainer_content_info_name">
          <div class="bookContainer_content_info_name--book">{{bookDetail.name}}</div>
          <div class="bookContainer_content_info_name--provider">作者：{{bookDetail.author}}</div>
        </div>
      </div>
      <i-sticky>
        <i-sticky-item i-class="i-sticky-demo-title">
          <view slot="title">推荐理由</view>
          <view slot="content">
            <view class="i-sticky-demo-item" style="padding: 10px 20px">{{bookDetail.readReaction}}</view>
          </view>
        </i-sticky-item>
      </i-sticky>
    </div>
    <i-button type="primary" @click="borrowBook">借阅</i-button>
    <i-toast id="bookDetailToast" />
  </div>
</template>
<script>
  import store from '../store/store'
  const { $Toast } = require('../../../static/iView/base/index')
  export default {
    data () {
      return {
        bookDetail: {},
        userInfo: {},
        bookId: ''
      }
    },
    onLoad (option) {
      let _this = this
      this.bookId = option.id
      // 查询书籍详情
      store.state.db.collection('shareBook-books').doc(option.id).get().then(res => {
        _this.bookDetail = res.data
      })
      // 查询用户信息，用于记录书籍被借人信息
      store.state.db.collection('shareBook-user').where({openId: store.state.openId}).get().then(res => {
        _this.userInfo = res.data[0]
      })
    },
    methods: {
      borrowBook () {
        let _this = this
        store.state.db.collection('shareBook-books').where({openId: store.state.openId}).get().then(res => {
          if (!res.data.length) {
            $Toast({
              content: '捐赠过图书才可以借阅',
              selector: '#bookDetailToast',
              type: 'warning'
            })
          } else if (_this.bookDetail.isBorrow) {
            $Toast({
              content: '图书已经被借阅',
              selector: '#bookDetailToast',
              type: 'warning'
            })
          } else {
            store.state.db.collection('shareBook-books').doc(_this.bookId).update({
              data: {
                isBorrow: true,
                borrower: _this.userInfo.nickName
              },
              success (res) {
                $Toast({
                  content: '借阅成功',
                  selector: '#bookDetailToast',
                  type: 'success'
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../index/main'
                  })
                }, 2000)
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .bookContainer{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .bookContainer_content{
    flex-grow: 1;
    overflow-y: scroll;
  }

  .bookContainer_content_info{
    height: 80px;
    padding: 5px 0px;
    background-color: white;
    display: flex;
    margin-bottom: 15px;
  }

  .bookContainer_content_info_icon{
    display: block;
    width: 70px;
    height: 100%;
    margin-left: 20px;
  }

  .bookContainer_content_info_name{
    height: 100%;
    font-size: 16px;
    font-weight: bolder;
    padding-left: 20px;
  }

  .bookContainer_content_info_name--book,.bookContainer_content_info_name--provider{
    height: 40px;
    line-height: 40px;
  }

  .bookContainer_content_info_name--provider{
    font-size: 14px;
  }
</style>
