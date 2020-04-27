<template>
  <g-dialog v-model="internalValue" width="40%" eager>
    <div class="dialog">
      <div class="dialog__title">Successfully</div>
      <img alt src="/plugins/pos-plugin/assets/connected.svg"/>
      <p class="dialog__note">Device paired successfully!</p>
      <div class="dialog__buttons">
        <g-btn-bs width="100" background-color="#536DFE" text-color="white" @click="internalValue = false">OK</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogPairNewDeviceSuccess',
    props: {
      value: Boolean
    },
    data: function () {
      return {}
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set() {
          this.$emit('input', false)
        }
      }
    },
    methods: {}
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
