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
      userInfo: {
        nickName: '未登录'
      }
    }
  },
  mounted () {
    let _this = this
    store.state.db.collection('shareBook-user').where({openId: store.state.openId}).get().then(res => {
      if (res.data.length !== 0) {
        _this.userInfo = res.data[0]
      }
    }).catch(e => {})
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
