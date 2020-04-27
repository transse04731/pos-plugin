<template>
  <div class="device">
    <div class="device__title">Pair to POS</div>
    <div class="device__content">
      <p><b>Status: </b>{{ status }}</p>
      <p><b>Online Ordering URL: </b>{{url}}</p>
      <g-btn-bs v-if="status === 'Paired'" large background-color="#E0E0E0" @click="unPair">Unpair</g-btn-bs>
      <g-btn-bs v-else large background-color="#E0E0E0" @click="showPairDialog">Pair</g-btn-bs>
    </div>
    <g-dialog v-model="dialog.connect" width="40%" eager>
      <div class="dialog">
        <div class="dialog__title">Pair Online Ordering to your POS device:</div>
        <g-text-field-bs large :class="tfClass" :value="pairingCode" readonly/>
        <p class="dialog__note"><b>Note: </b>Only one device can be connected to online ordering at a time.</p>
        <div class="dialog__buttons">
          <g-btn-bs width="100" text-color="#424242" @click="hidePairDialog">Cancel</g-btn-bs>
        </div>
      </div>
    </g-dialog>
    <g-dialog v-model="dialog.success" width="40%" eager>
      <div class="dialog">
        <div class="dialog__title">Successfully</div>
        <img alt src="/plugins/pos-plugin/assets/connected.svg"/>
        <p class="dialog__note">Device paired successfully!</p>
        <div class="dialog__buttons">
          <g-btn-bs width="100" background-color="#536DFE" text-color="white" @click="dialog.success = false">OK
          </g-btn-bs>
        </div>
      </div>
    </g-dialog>
  </div>
</template>

<script>
  export default {
    name: "Device",
    props: {
      store: Object,
    },
    data() {
      return {
        pairedInfo: null,
        status: '',
        name: 'WebShop',
        url: `${location.origin}/store/${this.store.alias}`,
        pairingCode: null,
        color: 'indigo-accent-2',
        tfClass: 'bs-tf__pos',
        dialog: {
          connect: false,
          success: false
        },
      }
    },
    async created() {
      await this.loadPairStatus()
    },
    methods: {
      async loadPairStatus() {
        this.$set(this, 'pairedInfo', (await cms.getModel('Device').findOne({ storeId: this.store._id, name: this.name })))
        if (!this.pairedInfo) {
          this.status = 'Not Paired'
        } else if (!this.pairedInfo.paired) {
          this.status = 'Waiting to pair'
        } else {
          this.status = 'Paired'
        }
      },
      async unPair() {
        await axios.post(`/device/unregister`, { _id: this.pairedInfo._id })
        await this.loadPairStatus()
      },
      async showPairDialog() {
        this.pairingCode = (await axios.get(`/device/pairing-code?storeId=${this.store._id}&name=${this.name}`)).data.pairingCode;
        this.dialog.connect = true
      },
      async hidePairDialog() {
        await this.loadPairStatus()
        this.dialog.connect = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .device {
    &__title {
      font-size: 18px;
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

      .g-btn-bs {
        margin-top: 8px;
        width: 25%;
        align-self: flex-end;
        font-size: 16px;
      }
    }
  }

  .dialog {
    width: 100%;
    background: white;
    padding: 24px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__title {
      font-size: 20px;
      font-weight: 600;
      color: #212121;
      margin-bottom: 12px;
      align-self: flex-start;
    }

    .bs-tf-wrapper {
      margin: 8px 0;
      width: 100%;

      ::v-deep {
        .bs-tf-label {
          font-size: 15px;
        }

        .input, .bs-tf-input {
          width: 100%;
        }

        .bs-tf-input {
          font-size: 34px;
          font-weight: 700;
          color: #000000;
          text-align: center;
          pointer-events: none;
        }
      }

      &.bs-tf__disabled-icon {
        pointer-events: none;
      }
    }

    &__note {
      font-size: 12px;
      color: #757575;
    }

    &__buttons {
      display: inline-flex;
      align-self: flex-end;
      margin-top: 24px;
    }
  }
</style>
