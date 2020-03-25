<template>
  <g-dialog v-model="dialog" overlay-color="#6b6f82" overlay-opacity="0.95" width="65%">
    <div class="dialog-change w-100" :style="[{background: showKeyboard ? 'white' : 'transparent'}]">
      <change-value :change-type.sync="changeType" :original-value="originalValue" :new-value-editable="newValueEditable"
                    :new-value.sync="newValue"/>
      <div class="action">
        <g-btn :uppercase="false" flat outlined @click="dialog = false">{{$t('ui.cancel')}}</g-btn>
        <g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" @click="submit" :disabled="newValue < 0">{{$t('ui.ok')}}</g-btn>
      </div>
      <div :style="[{visibility: showKeyboard ? 'visible' : 'hidden'}]" class="keyboard-wrapper">
        <pos-numpad/>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  import ChangeValue from './ChangeValue';
  export default {
    name: 'dialogChangeValue',
    components: { ChangeValue },
    props: {
      value: Boolean,
      newValueEditable: false,
    },
    data() {
      return {
        changeType: null,
        showKeyboard: false,
        showDialog: false,
        originalValue: 0,
        newValue: 0
      }
    },
    computed: {
      dialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.showDialog = value
          this.$emit('input', value);
        }
      },

    },
    watch: {
      value: val => {
        this.showDialog = val
      },
      dialog(val) {
        if (!val) {
          this.changeType = null
          this.showKeyboard = false
        }
      }
    },
    methods: {
      open(changeType, originalValue) {
        if (changeType && typeof changeType === 'string')
          this.changeType = changeType
        this.originalValue = originalValue
        this.dialog = true
      },
      submit() {
        if (this.originalValue) {
          const change = {
            type: this.changeType,
            value: this.newValue,
            difference: (this.originalValue - this.newValue)
          }
          this.$emit('submit', change);
        }
        this.dialog = false;
      },
    }
  }
</script>

<style scoped lang="scss">
  .dialog-change {
    border-radius: 6px;
    display: flex;
    flex-direction: column;

    .action {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;

      .g-btn {
        min-width: 120px !important;

        &.g-btn__outlined {
          border: 1px solid #979797;
          color: #1d1d26;
        }
      }
    }

    .keyboard-wrapper {
      background-color: #bdbdbd;
      padding: 16px 180px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      margin-top: -16px;

      .key-number {
        padding: 10px 8px;
        background: #FFFFFF;
        border: 1px solid #979797;
        box-sizing: border-box;
        border-radius: 4px;
        font-family: "Muli", sans-serif;
      }
    }
  }
</style>
