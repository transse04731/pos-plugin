<template>
  <g-dialog v-model="intervalValue" width="40%" eager>
    <div class="dialog">
      <div class="dialog__title">Connect your device to store</div>
      <g-text-field-bs large class="bs-tf__pos" :value="pairingCode" readonly label="Pairing code:"/>
      <div class="dialog__buttons">
        <g-btn-bs width="100" text-color="#424242" @click="intervalValue = false">Cancel</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogPairNewDevice',
    props: {
      value: Boolean,
      store: Object,
    },
    data: function () {
      return {
        pairingCode: null,
      }
    },
    async created() {
      this.pairingCode = (await axios.get(`/device/pairing-code?storeId=${this.store._id}`)).data.pairingCode;
    },
    computed: {
      intervalValue: {
        get() {
          return this.value
        },
        set() {
          this.$emit('input', false)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
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
    
    &__buttons {
      display: inline-flex;
      align-self: flex-end;
      margin-top: 24px;
    }
  }
</style>
