<template>
  <div class="mineContainer">
    <i-card :title="userInfo.nickName" i-class="mineContainer_i-card" full=true :thumb="userInfo.avatarUrl">
    </i-card>
    <i-cell-group class="mineContainer_list">
      <i-cell title="我的图书" is-link></i-cell>
    </i-cell-group>
  </div>
</template>

<script>
import store from '../store/store'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    let _this = this
    setTimeout(function () {
      store.state.db.collection('shareBook-user').where({openId: store.state.openId}).get().then(res => {
        console.log('sssss11', res.data)
        _this.userInfo = res.data[0]
      })
    }, 1500)
  },
  components: {
  },

  methods: {
  }
}
</script>

<style>
  .mineContainer{
    height: 100%;
  }

  .mineContainer_i-card{
    border-top: 0px!important;
    padding: 0px!important;
  }
  .mineContainer_i-card view{
    margin: 6px 10px;
  }
</style>
