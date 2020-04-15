<template>
  <g-dialog v-model="internalValue" width="40%" eager>
    <div class="dialog">
      <div class="dialog-title">Add New Device</div>
      <g-text-field-bs v-model="name" label="Device name"/>
      <p class="mt-2">Install app: <a class="i fw-600">gigasource.io/downloadxyz</a></p>
      <div class="qr-code">
        <img alt :src="qrCode"/>
      </div>
      <p class="my-3">Pairing/License code:</p>
      <div class="license-code">
        {{ pairingCode }}
      </div>
      <div class="dialog-buttons">
        <g-btn-bs large width="100" text-color="#424242" @click="close">Cancel</g-btn-bs>
        <g-btn-bs large width="100" text-color="white" background-color="indigo-accent-2" @click="submit">OK</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: "dialogNewDevice",
    props: {
      value: null,
    },
    data() {
      return {
        name: null,
        qrCode: '/plugins/pos-plugin/assets/qr.svg',
        pairingCode: '1Z3S56'
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
    },
    methods: {
      close() {
        this.$emit('input', false)
      },
      submit() {
        const device = { name: this.name }
        this.$emit('submit', device)
        this.close()
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog {
    background: white;
    border-radius: 4px;
    width: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;

    &-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 28px;
    }

    &-buttons {
      display: flex;
      align-self: flex-end;
      margin-top: 24px;
      margin-right: -8px;
    }

    .qr-code {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .license-code {
      background: #EFEFEF;
      border: 1px solid #9E9E9E;
      border-radius: 2px;
      text-align: center;
      font-weight: 700;
      font-size: 34px;
      line-height: 43px;
      padding: 12px;
    }
  }
</style>
