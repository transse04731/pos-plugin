<template>
  <div area="buttons">
    <g-btn outlined height="100%">F1</g-btn>
    <g-btn outlined height="100%" @click="dialogChangePrice = true">Change Price</g-btn>
    <g-btn outlined height="100%">Note</g-btn>
    <g-btn outlined height="100%" @click="dialogProductLookup = true">Product Lookup</g-btn>
    <g-btn outlined height="100%" disabled>Disabled Button</g-btn>
    <g-btn outlined height="100%">Discount</g-btn>
    <g-btn outlined height="100%"></g-btn>
    <g-btn outlined height="100%">Plastic Refund</g-btn>
    <g-btn area="btn__big" text background-color="green lighten 1" text-color="white" height="100%" @click="quickCash">Quick Cash</g-btn>
    <g-btn text background-color="orange lighten 1" text-color="white" height="100%">Save</g-btn>
    <g-btn text background-color="blue darken 2" height="100%">
      <span class="text-white">Pay</span>
    </g-btn>
  </div>
</template>

<script>
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';

  export default {
    name: 'PosOrderScreenActionButtonGroup',
    components: { GBtn },
    data() {
      return {}
    },
    methods: {
      quickCash() {}
    }
  }
</script>

<style scoped lang="scss">
  .g-btn {
    &.g-btn__outlined {
      border: 1px solid #979797;
      background-color: #fafafa;
    }

    &.g-btn__disabled {
      background-color: #DFDFDF;
    }

    &.g-btn__text {
      border: 0;
    }
  }
</style>