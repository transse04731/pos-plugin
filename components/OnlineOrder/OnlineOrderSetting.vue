<template>
  <div class="online-order-setting">
    <div class="online-order-setting__title">Online Order Settings</div>
    <div class="online-order-setting__content" v-for="device in computedDevices">
      <p><b>Status: </b>{{status ? 'Connected' : 'No connection'}}</p>
      <p><b>Webshop URL: </b>{{device.url}}</p>
      <p><b>Incoming order notification sound: </b></p>
      <g-radio-group row v-model="device.sound">
        <g-radio color="indigo-accent-2" label="Active" :value="true"/>
        <g-radio color="indigo-accent-2" label="Disabled" :value="false"/>
      </g-radio-group>
      <g-btn-bs v-if="status" large background-color="#E0E0E0" @click="dialog.disconnect = true">Disconnect</g-btn-bs>
      <g-btn-bs v-else large background-color="#E0E0E0" @click="openConnectDialog(device)">Connect</g-btn-bs>
    </div>
    <dialog-connect v-model="dialog.connect" @confirm="connect"/>
    <dialog-disconnect v-model="dialog.disconnect" @confirm="disconnect"/>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: "OnlineOrderSetting",
    props: {
      onlineDevices: Array
    },
    data() {
      return {
        selectedDevice: null,
        internalDevices: [],
        status: false,
        dialog: {
          connect: false,
          disconnect: false
        }
      }
    },
    computed: {
      computedDevices: {
        get() {
          return this.internalDevices
        },
        set(val) {
          this.$emit('updateDevices', val)
        }
      }
    },
    watch: {
      onlineDevices(val) {
        this.internalDevices = val.map(item => ({
          ...item,
          connected: false
        }))
      }
    },
    methods: {
      openConnectDialog(device) {
        this.dialog.connect = true
        this.selectedDevice = device
      },
      async connect(pairingCode) {
        const serverUrl = this.selectedDevice.url
        const pairingApiUrl = `${serverUrl}/online-order-device/register`
        const requestBody = {pairingCode}

        const requestResponse = await axios.post(pairingApiUrl, requestBody)

        //TODO: Handle error when user enters incorrect pairing code
        const {deviceId} = requestResponse.data
        const io = window['socket.io-client'];

        const socket = io(`${serverUrl}?clientId=${deviceId}`)
        socket.on('createOrder', (orderData, ackFn) => {
          const {socket: sk} = window.cms
          sk.emit('createOrder', orderData)
          ackFn()
        })

        this.status = true
      },
      disconnect() {
        this.status = false
        //todo disconnect logic
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$emit('getOnlineDevices')
      });


    },
    activated() {
      this.$nextTick(() => {
        this.$emit('getOnlineDevices')
      })
    }
  }
</script>

<style scoped lang="scss">
  .online-order-setting {
    background-image: url('/plugins/pos-plugin/assets/out.png');
    width: 100%;
    height: 100%;
    padding: 24px 16px;

    &__title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    &__content {
      background: #FFFFFF;
      border: 0.4px solid #9E9E9E;
      border-radius: 4px;
      padding: 20px 24px;
      width: 60%;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      margin-bottom: 16px;

      p {
        margin-bottom: 8px;
      }

      .g-radio-wrapper {
        margin: 0 36px 0 0;

        ::v-deep {
          .g-radio-checkmark {
            &:before, &:after {
              font-size: 12px;
              top: 2px;
            }
          }

          .g-radio-label {
            font-size: 15px;
            margin-left: -6px;
          }

          .g-radio__active .g-radio-label {
            font-weight: 600;
          }
        }

      }

      .g-btn-bs {
        margin-top: 24px;
        width: 25%;
        align-self: flex-end;
        font-size: 16px;
      }
    }
  }
</style>
