<template>
  <g-dialog v-model="dialogLoginSupport" width="100%" eager>
    <g-card width="100%" height="585px">
      <g-grid-layout :layout="layout" style="height: 100%; width: 100%">
        <p area="version" class="support-item"><b>Version: </b>{{this.version}}</p>
        <p area="network" class="support-item"><b>Network: </b>{{this.network}}</p>
        <p area="internet" class="support-item"><b>Internet: </b>{{this.internet}}</p>
        <p area="ssid" class="support-item"><b>SSID: </b>{{this.ssID}}</p>
        <p area="ip" class="support-item"><b>IP: </b>{{this.ip}}</p>

        <div area="keyboard_input" class="text-field-section" style="position: relative;height: 70px;">
          <g-text-field clear-icon="cancel" clearable outlined style="color: #1d1d26; width: 85%; margin-right: 10px;" v-model="supportMessage"></g-text-field>
          <g-btn :uppercase="false" background-color="blue" class="send-btn" elevation="0" style="height: calc(100% + 1px)" text-color="white" width="15%">SEND</g-btn>
        </div>

        <div area="keyboard" class="keyboard-wrapper">
          <pos-keyboard-full v-model="supportMessage"/>
        </div>
      </g-grid-layout>

      <g-btn :uppercase="false" @click="dialogLoginSupport = !dialogLoginSupport" class="overlay-close-icon" icon style="position: absolute; top: 5px; right: 5px;">
        <g-icon>mdi-close</g-icon>
      </g-btn>
    </g-card>

  </g-dialog>
</template>

<script>
  import loginSupportDialog from './loginSupportDialog'

  export default {
    name: 'dialogLoginSupport',
    props: {
      value: null
    },
    computed: {
      dialogLoginSupport: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      }
    },
    data: () => ({
      layout: loginSupportDialog,
      show: Boolean,
      supportMessage: '',
      version: 0.3,
      network: 'Wifi',
      internet: 'Yes',
      ssID: 'Giga5',
      ip: '192.168.10.90',
    })
  }
</script>

<style lang="scss" scoped>
  .send-btn {
    height: 100%;
  }

  .support-item {
    margin-top: 34px;
    margin-left: 17px;
    font-size: 20px;
    line-height: 25px;
  }

  .g-tf-wrapper {
    margin: 0;
  }

  .text-field-section {
    background-color: rgba(196, 196, 196, 0.4);
    width: 100%;
    display: inline-flex;
    padding: 10px;

    .g-tf-wrapper {
      background-color: #ffffff;
      ::v-deep fieldset {
        border: none !important;
      }
    }

  }

  ::v-deep .keyboard-wrapper {
    padding: 16px;
    background-color: #BDBDBD;
    height: 263px;

    .key {
      border-radius: 0;
      font-size: 24px;
    }
  }

  .dialog-content-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
