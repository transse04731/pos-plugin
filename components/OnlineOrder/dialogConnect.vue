<template>
  <g-dialog v-model="internalValue" width="40%" eager>
    <div class="dialog">
      <div class="dialog-title">Connect this device to your webshop</div>
      <g-text-field-bs large class="bs-tf__pos" label=" Enter your pairing code:" v-model="code"/>
      <div class="dialog-note">
        <b>Note: </b>Pairing code can be found by opening your online ordering settings on your browser.
      </div>
      <div class="dialog-buttons">
        <g-btn-bs width="100" text-color="#424242" @click="internalValue = false">Cancel</g-btn-bs>
        <g-btn-bs width="100" background-color="#536DFE" text-color="white" @click="connect">Confirm</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: "dialogConnect",
    props: {
      value: null,
    },
    data() {
      return {
        code: ''
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set(val) {
          this.code = ''
          this.$emit('input', val)
        }
      }
    },
    methods: {
      connect() {
        this.$emit('confirm', this.code)
        this.internalValue = false
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

    &-title {
      font-size: 20px;
      font-weight: 600;
      color: #212121;
      margin-bottom: 24px;
      align-self: flex-start;
    }

    .bs-tf-wrapper {
      margin: 8px 0;
      width: 100%;

      ::v-deep {
        .bs-tf-label {
          font-size: 15px;
        }

        .bs-tf-input {
          font-size: 34px;
          font-weight: 700;
          color: #000000;
          text-align: center;
        }
      }
    }

    &-note {
      font-size: 12px;
      color: #757575;
    }

    &-buttons {
      display: inline-flex;
      align-self: flex-end;
      margin-top: 24px;
    }
  }
</style>
