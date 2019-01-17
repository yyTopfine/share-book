<template>
  <div class="homePgeContainer">
    <p class="homePgeContainer_title">骏梦游戏</p>
    <p class="homePgeContainer_subTitle">员工图书馆</p>
    <i-button type="error">这是一个按钮</i-button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      userInfo: {}
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
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>
  .homePgeContainer_title{
    letter-spacing: 20px;
    font-size: 26px;
    font-weight: bolder;
    text-align: center;
  }

  .homePgeContainer_subTitle{
    letter-spacing: 10px;
    font-size: 16px;
    font-weight: bolder;
    text-align: center;
  }
</style>
