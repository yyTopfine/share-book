<template>
  <div class="bookContainer">
    <div class="bookContainer_content">
      <div class="bookContainer_content_info">
        <image :src="bookDetail.bookFaceId" class="bookContainer_content_info_icon" />
        <div class="bookContainer_content_info_name">
          <div class="bookContainer_content_info_name--book">{{bookDetail.bookName}}</div>
          <div class="bookContainer_content_info_name--provider">作者：{{bookDetail.author}}</div>
        </div>
      </div>
      <i-sticky>
        <i-sticky-item i-class="i-sticky-demo-title">
          <view slot="title" style="font-size: 18px;font-weight: bolder">详细信息</view>
          <view slot="content">
            <view class="i-sticky-demo-item" style="padding: 10px 20px;font-size: 16px"><span style="font-weight: bolder">提供者：</span>{{bookDetail.provider}}</view>
            <view class="i-sticky-demo-item" style="padding: 10px 20px;font-size: 16px"><span style="font-weight: bolder">出版社：</span>{{bookDetail.press}}</view>
            <view class="i-sticky-demo-item" style="padding: 10px 20px;font-size: 16px"><span style="font-weight: bolder">出版日期：</span>{{bookDetail.pressDate}}</view>
            <view class="i-sticky-demo-item" style="padding: 10px 20px;font-size: 16px"><span style="font-weight: bolder">价格：</span>{{bookDetail.price}}元</view>
            <view class="i-sticky-demo-item" style="padding: 10px 20px;font-size: 16px" v-if="bookDetail.isBorrow"><span style="font-weight: bolder">到期时间：</span>{{bookDetail.borrowDate}}</view>
            <view class="i-sticky-demo-item" style="padding: 10px 20px;font-size: 16px" v-if="bookDetail.summary"><span style="font-weight: bolder">概述：</span></view>
            <view class="i-sticky-demo-item" style="padding: 10px 20px;font-size: 16px;text-indent: 32px" v-if="bookDetail.summary">{{bookDetail.summary}}</view>
          </view>
        </i-sticky-item>
      </i-sticky>
    </div>
    <div style="flex-basis: 65px;flex-shrink: 0">
      <i-button type="primary" @click="borrowBook" v-if="!bookDetail.isBorrow">借阅</i-button>
      <i-button type="primary" v-if="bookDetail.isBorrow" disabled>已借阅</i-button>
      <i-toast id="bookDetailToast" />
      <i-modal title="请选择借阅周期" :visible="borrowChoose" :actions="borrowAry"
               action-mode="vertical" @click="borrowChooseClick"></i-modal>
      <i-spin custom fix v-if="isShowLoding">
        <i-icon type="refresh" size="20" i-class="icon-load"></i-icon>
        <view>Loading</view>
      </i-spin>
    </div>
  </div>
</template>
<script>
  import store from '../store/store'
  import {formatTime} from '../../utils/index'
  const { $Toast } = require('../../../static/iView/base/index')
  export default {
    data () {
      return {
        bookDetail: {},
        userInfo: {},
        bookId: '',
        borrowChoose: false,
        isShowLoding: false,
        borrowDate: '',
        borrowAry: [{
          name: '一个月'
        }, {
          name: '两个月'
        }, {
          name: '三个月'
        }]
      }
    },
    onUnload () {
      this.borrowChoose = false
      this.isShowLoding = false
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
      borrowChooseClick (e) {
        let _this = this
        if (e.mp._relatedInfo.anchorTargetText === '一个月') {
          _this.borrowDate = formatTime(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30))
          console.log(_this.borrowDate)
        } else if (e.mp._relatedInfo.anchorTargetText === '两个月') {
          _this.borrowDate = formatTime(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30 * 2))
        } else if (e.mp._relatedInfo.anchorTargetText === '三个月') {
          _this.borrowDate = formatTime(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30 * 3))
        }
        if (_this.borrowDate) {
          _this.borrowChoose = false
          _this.isShowLoding = true
          wx.cloud.callFunction({
            name: 'borrowBook',
            data: {
              bookId: _this.bookId,
              isBorrow: true,
              borrower: store.state.openId,
              borrowDate: _this.borrowDate
            }
          }).then(res => {
            _this.isShowLoding = false
            $Toast({
              content: '借阅成功',
              selector: '#bookDetailToast',
              type: 'success'
            })
            _this.borrowDate = ''
            setTimeout(function () {
              wx.switchTab({
                url: '../index/main'
              })
            }, 2000)
          }).catch(e => {
            _this.borrowDate = ''
            _this.isShowLoding = false
            $Toast({
              content: '借阅失败',
              selector: '#bookDetailToast',
              type: 'success'
            })
          })
        }
      },
      borrowBook () {
        let _this = this
        store.state.db.collection('shareBook-books').where({openidVal: store.state.openId}).get().then(res => {
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
            _this.borrowChoose = true
          }
        })
      }
    }
  }
</script>
<style scoped>
  .bookContainer{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    overflow: hidden;
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
    flex-basis: 70px;
    flex-shrink: 0;
    height: 100%;
    margin-left: 20px;
  }

  .bookContainer_content_info_name{
    height: 100%;
    font-size: 16px;
    overflow: hidden;
    font-weight: bolder;
    padding-left: 20px;
  }

  .bookContainer_content_info_name--book,.bookContainer_content_info_name--provider{
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .bookContainer_content_info_name--provider{
    font-size: 14px;
  }
</style>
