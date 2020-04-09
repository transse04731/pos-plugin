<template>
  <div class="device">
    <div class="device__title">Setting Menu</div>
    <div class="device__content">
      <p><b>Status: </b>{{status ? 'Connected' : 'No connection'}}</p>
      <p><b>Webshop URL: </b>{{url}}</p>
      <g-btn-bs large background-color="#E0E0E0" @click="dialog.connect = true">Connect</g-btn-bs>
    </div>
    <g-dialog v-model="dialog.connect" width="40%" eager>
      <div class="dialog">
        <div class="dialog__title">Connect a new device:</div>
        <g-text-field-bs large :class="tfClass" label=" Enter your pairing code:" :value="code">
          <template v-slot:append-inner>
            <g-tooltip :open-on-hover="true" bottom speech-bubble color="#000" transition="0.3" remove-content-on-close>
              <template v-slot:activator="{on}">
                <g-icon @mouseenter="on.mouseenter"
                        @mouseleave="on.mouseleave"
                        @click.stop.prevent="resetCode"
                        :color="color">
                  fas fa-undo
                </g-icon>
              </template>
              <span>Reset</span>
            </g-tooltip>
          </template>
        </g-text-field-bs>
        <p class="dialog__note"><b>Note: </b>Code is valid within 15 minutes after generation. Only one device can be connected to online ordering at a time.</p>
        <div class="dialog__buttons">
          <g-btn-bs width="100" text-color="#424242" @click="dialog.connect = false">Cancel</g-btn-bs>
        </div>
      </div>
    </g-dialog>
    <g-dialog v-model="dialog.success" width="40%" eager>
      <div class="dialog">
        <div class="dialog__title">Successfully</div>
        <img alt src="/plugins/pos-plugin/assets/connected.svg"/>
        <p class="dialog__note">Device added successfully!</p>
        <div class="dialog__buttons">
          <g-btn-bs width="100" background-color="#536DFE" text-color="white" @click="dialog.success = false">OK</g-btn-bs>
        </div>
      </div>
    </g-dialog>
  </div>
</template>

<script>
  export default {
    name: "Device",
    props: {

    },
    data() {
      return {
        status: false,
        url: 'pos.gigasource.io/KFC',
        dialog: {
          connect: false,
          success: false
        },
        code: '123456XYZ',
        color: 'indigo-accent-2',
        tfClass: 'bs-tf__pos'
      }
    },
    methods: {
      resetCode() {
        this.tfClass += ' bs-tf__disabled-icon'
        this.color = 'grey-lighten-2'
        setTimeout(() => {
          this.tfClass = 'bs-tf__pos'
          this.color = 'indigo-accent-2'
        }, 300000)
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
