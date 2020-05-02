<template>
  <g-btn flat :uppercase="false" height="100%" v-if="online && connected">
      <g-icon>icon-wlan</g-icon>
      <span style="color: #2979FF"> Internet</span>
  </g-btn>
  <g-btn flat :uppercase="false" height="100%" v-else-if="online && !connected">
    <g-icon>icon-wlan-error</g-icon>
    <span style="color: #FF4452"> Error</span>
  </g-btn>
  <g-btn flat :uppercase="false" height="100%" v-else>
    <g-icon>icon-wlan-disconnected</g-icon>
    <span style="color: #FF4452"> No Internet</span>
  </g-btn>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'ConnectionStatusBtn',
    data() {
      return {
        online: false,
        connected: false
      }
    },
    mounted() {
      this.online = navigator.onLine

      window.cms.socket.emit('getWebshopUrl', async webshopUrl => {
        this.webshopUrl = webshopUrl

        try {
          await axios.get(`${webshopUrl}/health-check`)
          this.connected = true
        } catch (e) {
          this.connected = false
        }
      });
    }
  }
</script>

<style scoped>

</style>