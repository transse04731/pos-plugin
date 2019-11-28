<template>
  <g-text-field error type="password" v-model="internalValue">
    <template v-if="internalValue && internalValue.length < 6" v-slot:hint>
      <g-icon color="red" size="16px" style="margin-right: 8px">mdi-close-circle</g-icon>
      <p style="color: #F44336;">Passcode is incorrect</p>
    </template>
  </g-text-field>
</template>

<script>
  import { getInternalValue } from 'pos-vue-framework/src/mixins/getVModel';

  export default {
    name: 'PosLoginTextfield',
    setup() {
      const internalValue = getInternalValue(...arguments);
      return { internalValue }
    },
    props: {
      value: ''
    }
    //injectService: ['PosStore:loginPassword->value']
  }
</script>

<style lang="scss" scoped>
  .login-textfield {
    ::v-deep .g-tf .inputGroup .g-tf-input {
      text-align: center;
      font-size: 24px;
      letter-spacing: 12px;
      color: #2196F3;
    }
  }

</style>
