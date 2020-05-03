<template>
  <g-btn-bs icon="icon-wlan@20" text-color="#2979FF" v-if="online && connected">
      Internet
  </g-btn-bs>
  <g-btn-bs icon="icon-wlan-error@20" text-color="#FF4452" v-else-if="online && !connected">
    Error
  </g-btn-bs>
  <g-btn-bs icon="icon-wlan-disconnected@20" text-color="#FF4452" height="100%" v-else>
    No Internet
  </g-btn-bs>
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

<style scoped lang="scss">
 .g-btn-bs {
   font-size: 14px;
 }
</style>
