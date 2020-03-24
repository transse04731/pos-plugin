<template>
  <g-dialog v-model="internalValue" width="90%" eager>
    <div class="dialog-input">
      <g-icon v-if="close" @click="internalValue = false"class="close-icon">icon-close@20</g-icon>
      <slot name="input">
        <div class="textfield">
          <g-text-field-bs v-model="text" :label="title" :placeholder="placeholder"/>
        </div>
      </slot>
      <slot name="buttons">
        <div class="button" v-if="showButtons">
          <g-btn-bs width="120" border-color="#979797" @click="internalValue = false">Cancel</g-btn-bs>
          <g-btn-bs width="120" background-color="#2979FF" @click="$emit('submit')">OK</g-btn-bs>
        </div>
      </slot>
      <slot name="keyboard">
        <div class="keyboard">
          <pos-keyboard-full/>
        </div>
      </slot>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: "dialogFormInput",
    props: {
      value: null,
      showButtons: {
        type: Boolean,
        default: true
      },
      close: {
        type: Boolean,
        default: true
      },
      title: String,
      placeholder: String,
    },
    data() {
      return {
        text: ''
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog-input {
    background-color: #FFFFFF;
    padding: 16px;
    width: 100%;

    .close-icon {
      float: right;
    }

    .textfield {
      margin: 24px 0;
    }

    .button {
      display: flex;
      justify-content: flex-end;
      margin: 24px 0;
    }

    .keyboard {
      background-color: #bdbdbd;
      padding: 16px;
      margin: 0 -16px -16px -16px;
    }
  }
</style>
