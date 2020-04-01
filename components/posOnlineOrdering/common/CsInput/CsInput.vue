<template>
  <input
      :value="value"
      :placeholder="placeholder"
      :type="type"
      :max="max"
      @input="oninput"
      @keydown.enter="onenter"
      @blur="onblur"
      :style="style"
      ref="input"
      spellcheck="false"/>
</template>
<script>
  import _ from 'lodash';

  // TODO: Add enter, escape, etc,...
  export default {
    name: 'CsInput',
    props: {
      value: String,
      type: String,
      placeholder: String,
      wait: {
        type: Number,
        default: 200
      },
      max: Number
    },
    created() {
      this.emitDebounce = _.debounce(this.$emit, this.wait)
    },
    computed: {
      style() {
        return {
          'user-select': 'text !important',
          '-webkit-user-select': 'text !important',
        }
      }
    },
    methods: {
      oninput(e) {
        this.$emit('input', e.target.value);
        this.emitDebounce('inputdebounce', e.target.value)
      },
      onenter(e) {
        this.$emit('enterpressed', e)
      },
      focus() {
        this.$refs.input.focus()
      },
      select() {
        this.$refs.input.select()
      },
      onblur(e) {
        this.$emit('blur', e)
      }
    }
  }
</script>

<style lang="scss">
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 50px white inset !important;
  }
</style>
