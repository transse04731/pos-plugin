<template>
  <div class="online-order-setting">
    <div class="online-order-setting__title">Online Order Settings</div>
    <div class="online-order-setting__content">
      <g-row v-if="computedDevice">
        <g-text-field-bs label="Status" :value="connected ? 'Connected' : 'No connection'" readonly/>
        <g-text-field-bs label="Webshop URL" :value="computedDevice.url" readonly/>
      </g-row>
      <g-btn-bs v-if="connected" large background-color="#E0E0E0" style="margin-top: 24px;"
                @click.stop="dialog.disconnect = true">
        Disconnect
      </g-btn-bs>
      <g-btn-bs v-else large background-color="#E0E0E0" style="margin-top: 24px;"
                @click.stop="dialog.connect = true">
        Connect
      </g-btn-bs>
      <g-divider style="margin-top: 24px"/>
    </div>
    <div class="online-order-setting__title">General Settings</div>
    <div class="online-order-setting__content">
      <p><b>Default time to complete order: </b></p>
      <g-row>
        <g-grid-select :grid="false" :items="deliveryTimes" v-model="computedDefaultPrepareTime" mandatory>
          <template #default="{item, toggleSelect}">
            <g-btn-bs border-color="#e0e0e0" text-color="black" width="72" height="30"
                      style="margin-top: 12px" @click.stop="toggleSelect(item)"
            >{{item}}
            </g-btn-bs>
          </template>
          <template #selected="{item}">
            <g-btn-bs border-color="#90CAF9" text-color="black" width="72" height="30" background-color="#E3F2FD"
                      style="margin-top: 12px" @click.stop="toggleSelect(item)"
            >{{item}}
            </g-btn-bs>
          </template>
        </g-grid-select>
      </g-row>
      <g-switch label="Incoming order notification sound"></g-switch>
      <p><b>Order sorting option: </b></p>
      <g-grid-select :grid="false" :items="orderSorting" v-model="computedOnlineOrderSorting" mandatory>
        <template #default="{item, toggleSelect}">
          <g-btn-bs border-color="#e0e0e0" text-color="black" width="160" height="30"
                    style="margin-top: 12px" @click.stop="toggleSelect(item)"
          >{{item.text}}
          </g-btn-bs>
        </template>
        <template #selected="{item}">
          <g-btn-bs border-color="#90CAF9" text-color="black" width="160" height="30" background-color="#E3F2FD"
                    style="margin-top: 12px" @click.stop="toggleSelect(item)"
          >{{item.text}}
          </g-btn-bs>
        </template>
      </g-grid-select>
    </div>

    <dialog-connect v-model="dialog.connect" @confirm="connect"/>
    <dialog-disconnect v-model="dialog.disconnect" @confirm="disconnect"/>
  </div>
</template>

<script>
  import axios from 'axios';
  import ValuePicker from './ValuePicker';
  import GGridItemSelector from '../FnButton/components/GGridItemSelector';

  export default {
    name: "OnlineOrderSetting",
    components: {GGridItemSelector, ValuePicker},
    props: {
      onlineDevice: null,
      defaultPrepareTime: Number,
      onlineOrderSorting: String
    },
    data() {
      return {
        internalDevice: null,
        connected: false,
        dialog: {
          connect: false,
          disconnect: false
        },
        deliveryTimes: [15, 30, 45, 60],
        orderSorting: [
          {text: 'Order Number', value: 'order'},
          {text: 'Time to Complete', value: 'time'},
        ],
      }
    },
    computed: {
      computedDevice: {
        get() {
          return this.internalDevice
        },
        set(val) {
          this.$emit('updateDevice', val)
        }
      },
      computedDefaultPrepareTime: {
        get() {
          return this.defaultPrepareTime
        },
        set(val) {
          this.$emit('updateDefaultPrepareTime', val)
        }
      },
      computedOnlineOrderSorting: {
        get() {
          return this.onlineOrderSorting
        },
        set(val) {
          this.$emit('updateOnlineOrderSorting', val)
        }
      }
    },
    watch: {
      onlineDevice(val) {
        this.internalDevice = val

        if (this.internalDevice.paired) this.connected = true;
      }
    },
    methods: {
      async connect(pairingCode) {
        const serverUrl = this.internalDevice.url
        const pairingApiUrl = `${serverUrl}/online-order-device/register`
        const requestBody = {pairingCode}
        const requestResponse = await axios.post(pairingApiUrl, requestBody)
        const {deviceId} = requestResponse.data

        this.$emit('registerOnlineOrder', deviceId)

        this.computedDevice = {
          id: deviceId,
          paired: true,
          url: this.internalDevice.url,
          sound: this.internalDevice.sound,
        }

        this.connected = true;
      },
      disconnect() {
        this.$emit('unregisterOnlineOrder')

        this.computedDevice = {
          id: null,
          paired: false,
          url: this.internalDevice.url,
          sound: this.internalDevice.sound,
        }

        this.connected = false
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$emit('getOnlineDevice')
      })
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('getOnlineDevice')
      })
    }
  }
</script>

<style scoped lang="scss">
  .online-order-setting {
    width: 100%;
    height: 100%;
    padding: 24px 48px;

    &__title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 24px;
    }

    &__content {
      background: #FFFFFF;
      border: 0.4px solid #9E9E9E;
      border-radius: 4px;
      width: 80%;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      margin-bottom: 16px;

      .g-row {
        .bs-tf-wrapper--readonly {
          flex: 1 1;
          margin-left: 0;
        }
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
        margin-left: 0;
        width: 25%;
      }
    }
  }
</style>
