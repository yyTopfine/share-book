<template>
  <div class="homePgeContainer">
    <div class="homePgeContainer_bookContainer" @click="goBookDetail">
      <div class="homePgeContainer_content_bookItem" v-for="item in bookList" :key="id">{{item.name}}</div>
      <div class="homePgeContainer_content_bookItem">
        <i-icon type="add" size="28" class="homePgeContainer_content_bookItem--icon"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      userInfo: {},
      current: 'homepage',
      bookList: []
    }
  },

  components: {
  },

  methods: {
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    goBookDetail () {
      wx.navigateTo({
        url: '../book/main'
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

  .homePgeContainer_content_bookItem--icon{
    display: block;
    text-align: center;
    margin-top: 60%;
  }
</style>
