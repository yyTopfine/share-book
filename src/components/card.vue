<template>
  <div>
    <p class="card">
      {{text}}
    </p>
  </div>
</template>

<script>
export default {
  props: ['text'],
  created () {
    console.log('page index created', this)
  },
  onLoad () {
    console.log('page index onLoad1111', this)
  },
  onReady () {
    console.log('page index onReady', this)
  },
  onShow () {
    console.log('onShow', this)
  },
  onUnload () {
    console.log('onUnload', this)
  },
  onHide () {
    console.log('onHide', this)
  }
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
