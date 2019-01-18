<template>
  <div class="bookContainer">
    <div class="bookContainer-content">
      <div class="bookContainer-content_info">
        <img src="../../../static/img/homeSelect.jpg" class="bookContainer-content_info_icon">
        <div class="bookContainer-content_info_name">
          <div class="bookContainer-content_info_name--book">javascript高级程序设计</div>
          <div class="bookContainer-content_info_name--provider">提供者：张三</div>
        </div>
      </div>
    </div>
    <i-button>借阅</i-button>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
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

  .bookContainer-content{
    flex-grow: 1;
    overflow-y: scroll;
  }

  .bookContainer-content_info{
    height: 80px;
    padding: 5px 0px;
    background-color: white;
    display: flex;
  }

  .bookContainer-content_info_icon{
    display: block;
    width: 50px;
    height: 100%;
    margin-left: 20px;
  }

  .bookContainer-content_info_name{
    height: 100%;
    font-size: 16px;
    font-weight: bolder;
    padding-left: 20px;
  }

  .bookContainer-content_info_name--book,.bookContainer-content_info_name--provider{
    height: 40px;
    line-height: 40px;
  }

  .bookContainer-content_info_name--provider{
    font-size: 14px;
  }
</style>
