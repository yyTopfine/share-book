<template>
  <div class="addBookContainer">
    <div class="addBookContainer_content">
      <i-input :value="bookInfo.bookName" @change="changeBookInfo($event,'bookName')" title="书名:" placeholder="必填，请输入书名"  />
      <i-input :value="bookInfo.author" @change="changeBookInfo($event,'author')" title="作者:" placeholder="必填，请输入作者" />
      <i-input :value="bookInfo.press" @change="changeBookInfo($event,'press')" title="出版社:" placeholder="必填，请输入出版社" />
      <i-input :value="bookInfo.pressDate" @change="changeBookInfo($event,'pressDate')" title="出版日期:" placeholder="必填，请输入出版社日期" />
      <i-input :value="bookInfo.price" @change="changeBookInfo($event,'price')" title="价格:" placeholder="必填，请输入价格" />
      <i-input :value="bookInfo.bookType" @change="changeBookInfo($event,'bookType')" title="分类:" placeholder="请输入分类" />
      <i-input :value="bookInfo.bookLabel" @change="changeBookInfo($event,'bookLabel')" title="标签:" placeholder="请输入标签" />
      <div style="font-size: 14px;color: #495060;padding: 10px 15px" v-if="!bookInfo.bookFaceUrl">请选择封面(必选):</div>
      <div class="addBookContainer_bookFace" v-if="!bookInfo.bookFaceUrl">
        <image class="addBookContainer_bookFace_item" :src= "imageCouldUrl + 'bookFace1.png'" @click="chooseBookFack('bookFace1.png')"
               :class="{hasChooseFace: bookInfo.bookFaceId === imageCouldUrl +'bookFace1.png'}"/>
        <image class="addBookContainer_bookFace_item" :src= "imageCouldUrl + 'bookFace2.png'" @click="chooseBookFack('bookFace2.png')"
               :class="{hasChooseFace: bookInfo.bookFaceId === imageCouldUrl +'bookFace2.png'}"/>
        <image class="addBookContainer_bookFace_item" :src= "imageCouldUrl + 'bookFace3.png'" @click="chooseBookFack('bookFace3.png')"
               :class="{hasChooseFace: bookInfo.bookFaceId === imageCouldUrl +'bookFace3.png'}"/>
        <image class="addBookContainer_bookFace_item" :src= "imageCouldUrl + 'bookFace4.png'" @click="chooseBookFack('bookFace4.png')"
               :class="{hasChooseFace: bookInfo.bookFaceId === imageCouldUrl +'bookFace4.png'}"/>
      </div>
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
          bookLabel: '',
          bookFaceId: '',
          bookFaceUrl: ''
        },
        isShowLoding: false,
        imageCouldUrl: 'cloud://share-book-dff74a.7368-share-book-dff74a/'
      }
    },
    onUnload () {
      this.bookInfo = {
        bookName: '',
        author: '',
        press: '',
        pressDate: '',
        price: '',
        bookType: '',
        bookLabel: '',
        bookFaceId: 'cloud://share-book-dff74a.7368-share-book-dff74a/bookFace1.png',
        bookFaceUrl: 'https://7368-share-book-dff74a-1258538911.tcb.qcloud.la/bookFace1.png?sign=8f6ceda593ee4cca6ffa50064885e851&t=1548746722'
      }
    },
    methods: {
      changeBookInfo (e, id) {
        this.bookInfo[id] = e.mp.detail.detail.value
      },
      chooseBookFack (id) {
        let _this = this
        this.bookInfo.bookFaceId = this.imageCouldUrl + id
        wx.cloud.downloadFile({
          fileID: _this.bookInfo.bookFaceId,
          success: res => {
            _this.bookInfo.bookFaceUrl = res.tempFilePath
          }
        })
      },
      addBook () {
        let _this = this
        for (let key in _this.bookInfo) {
          if (!_this.bookInfo[ key ] && key !== 'bookType' && key !== 'bookLabel' && key !== 'bookFaceId') {
            console.log('xxx', key)
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
            borrowerDate: '',
            bookFaceId: _this.bookInfo.bookFaceUrl
          }
        }).then(res => {
          _this.isShowLoding = false
          store.commit('setBookInfo', null)
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
        }).catch(e => { _this.isShowLoding = false; store.commit('setBookInfo', null) })
      }
    },
    mounted () {
      if (store.state.bookInfo) {
        this.bookInfo.bookName = store.state.bookInfo.showapi_res_body.data.title
        this.bookInfo.author = store.state.bookInfo.showapi_res_body.data.author
        this.bookInfo.pressDate = store.state.bookInfo.showapi_res_body.data.pubdate
        this.bookInfo.press = store.state.bookInfo.showapi_res_body.data.publisher
        this.bookInfo.price = store.state.bookInfo.showapi_res_body.data.price
        this.bookInfo.bookFaceUrl = store.state.bookInfo.showapi_res_body.data.img
      }
    }
  }
</script>
<style scoped>
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

  .addBookContainer_bookFace{
    display: flex;
    justify-content: space-around;
  }

  .addBookContainer_bookFace_item{
    width: 20%;
    height: 90px;
    display: block;
  }

  .hasChooseFace{
    border: 1px dashed red;
  }

</style>
