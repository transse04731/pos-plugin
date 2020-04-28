<template>
  <g-btn flat :uppercase="false" height="100%" v-if="id">ID: {{id}}</g-btn>
  <g-btn flat :uppercase="false" height="100%" v-else @click.stop="pair">Pair</g-btn>
</template>

<script>
  export default {
    name: 'StoreIdBtn',
    data() {
      return {
        id: ''
      }
    },
    mounted() {
      cms.socket.emit('getWebshopId', storeId => {
        this.id = storeId || ''
      })
    },
    methods: {
      pair() {
        this.$router.push('/pos-setup')
      }
    }
  }
</script>

<style scoped>

</style>