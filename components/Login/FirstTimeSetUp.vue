<template>
  <div class="background">
    <g-dialog persistent v-model="dialog.pairing" width="580">
      <div class="dialog" style="padding: 24px">
        <div class="dialog-title">Welcome to Gigasource POS</div>
        <div class="dialog-title--sub">Paring Code</div>
        <g-text-field-bs large class="bs-tf__pos" v-model="code">
          <template v-slot:append-inner>
            <g-icon style="cursor: pointer" @click="dialog.input = true">icon-keyboard</g-icon>
          </template>
        </g-text-field-bs>
        <div v-if="error" class="dialog-message--error">
          <g-icon>icon-no-connection</g-icon>
          <span class="ml-2 fs-small">No internet connection</span>
        </div>
        <div class="dialog-message--note">
          <b>Note: </b>Please contact your local provide start using the program. Internet connection is required.
        </div>
      </div>
    </g-dialog>
    <g-dialog persistent v-model="dialog.success" width="580" eager>
      <div class="dialog" style="padding: 24px 120px">
        <div class="dialog-title">PAIR SUCCESSFULLY</div>
        <img alt src="/plugins/pos-plugin/assets/chain.svg"/>
        <div class="dialog-message">
          We have added some sample data to help you get started with our product.
        </div>
        <g-btn-bs style="margin: 16px" width="120" background-color="#2979FF" @click="start">Start</g-btn-bs>
      </div>
    </g-dialog>
    <dialog-text-filter v-model="dialogInput" label="Code" :defaul-value="code" @submit="changeCode"/>
  </div>
</template>

<script>
  export default {
    name: "FirstTimeSetUp",
    data() {
      return {
        dialog: {
          pairing: true,
          success: false,
          input: false,
        },
        code: '',
        error: true
      }
    },
    watch: {
      code(val) {
        if (val === '123456') {
          this.dialog.success = true
        }
      }
    },
    methods: {
      changeCode(code) {
        this.code = code
      },
      start() {
        this.$router.push({path: '/view/pos-login'})
      }
    }
  }
</script>

<style scoped lang="scss">
  .background {
    background-image: url("/plugins/pos-plugin/assets/login-bg.png");
  }

  .dialog {
  width: 100%;
  background: white;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-title {
    font-size: 20px;
    font-weight: 700;
    margin: 20px 0;

    &--sub {
      font-size: 15px;
      margin-top: 8px;
      margin-bottom: 12px;
    }
  }

  &-message {
    font-size: 15px;
    color: #424242;
    text-align: center;
    margin-bottom: 16px;
    margin-top: 4px;

    &--error {
      color: #f44336;
      font-style: italic;
      margin: 12px 0 24px;
    }

    &--note {
      font-size: 12px;
      font-style: italic;
      margin-bottom: 8px;
    }
  }

  .bs-tf-wrapper {
    margin: 8px 0;
    width: 80%;

    ::v-deep {
      .bs-tf-label {
        font-size: 15px;
      }

      .bs-tf-input {
        font-size: 34px;
        font-weight: 700;
        color: #000000;
        text-align: center;
        width: 100%;
      }
    }
  }
}
</style>
