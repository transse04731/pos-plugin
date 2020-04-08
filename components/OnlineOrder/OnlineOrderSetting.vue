<template>
  <div class="online-order-setting">
    <div class="online-order-setting__title">Online Order Settings</div>
    <div class="online-order-setting__content">
      <p><b>Status: </b>{{status ? 'Connected' : 'No connection'}}</p>
      <p><b>Webshop URL: </b>{{url}}</p>
      <p><b>Incoming order notification sound: </b></p>
      <g-radio-group row v-model="sound">
        <g-radio color="indigo-accent-2" label="Active" :value="'active'"/>
        <g-radio color="indigo-accent-2" label="Diabled" :value="'disabled'"/>
      </g-radio-group>
      <g-btn-bs v-if="status" large background-color="#E0E0E0" @click="dialog.disconnect = true">Disconnect</g-btn-bs>
      <g-btn-bs v-else large background-color="#E0E0E0" @click="dialog.connect = true">Connect</g-btn-bs>
    </div>
    <dialog-connect v-model="dialog.connect" @confirm="connect"/>
    <dialog-disconnect v-model="dialog.disconnect" @confirm="disconnect"/>
  </div>
</template>

<script>
  export default {
    name: "OnlineOrderSetting",
    props: {},
    data() {
      return {
        status: false,
        url: 'N/A',
        sound: 'active',
        dialog: {
          connect: false,
          disconnect: false
        }
      }
    },
    methods: {
      connect() {
        this.status = true
      },
      disconnect() {
        this.status = false
      }
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
