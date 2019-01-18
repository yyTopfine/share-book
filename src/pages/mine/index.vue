<template>
  <div class="mineContainer">
    <div class="mineContainer_userInfo">
      <img src="../../../static/img/homeSelect.jpg" class="mineContainer_userInfo_icon">
      <div class="mineContainer_userInfo_name">张三</div>
    </div>
    <div style="height: 10px;background-color: gainsboro"></div>
    <i-cell-group class="mineContainer_list">
      <i-cell title="我的图书" is-link></i-cell>
    </i-cell-group>
  </div>
</template>

<script>

export default {
  data () {
    return {
      userInfo: {},
      current: 'mine'
    }
  },

  components: {
  },

  methods: {
    handleChange (event) {
      wx.reLaunch({
        url: '../index/main'
      })
    }
  }
}
</script>

<style scoped>
  .mineContainer{
    height: 100%;
  }

  .mineContainer_userInfo{
    height: 50px;
    padding: 5px 0px;
    background-color: white;
    display: flex;
  }

  .mineContainer_userInfo_icon{
    display: block;
    width: 50px;
    height: 100%;
    margin-left: 20px;
  }
  .mineContainer_userInfo_name{
    height: 100%;
    line-height: 50px;
    font-size: 18px;
    font-weight: bolder;
    padding-left: 10px;
  }
</style>
