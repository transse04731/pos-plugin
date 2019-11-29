<template>
  <div area="buttons">
    <g-btn outlined height="100%">F1</g-btn>
    <g-btn outlined height="100%" @click="openDialogChangePrice" :disabled="!hasActiveOrderProduct">Change Price</g-btn>
    <g-btn outlined height="100%">Note</g-btn>
    <g-btn outlined height="100%" @click="openDialogProductLookup">Product Lookup</g-btn>
    <g-btn outlined height="100%" disabled>Disabled Button</g-btn>
    <g-btn outlined height="100%" @click="openDialogDiscount" :disabled="!hasActiveOrderProduct">Discount</g-btn>
    <g-btn outlined height="100%"></g-btn>
    <g-btn outlined height="100%">Plastic Refund</g-btn>
    <g-btn area="btn__big" text background-color="green lighten 1" text-color="white" height="100%" @click="quickCash">Quick Cash</g-btn>
    <g-btn text background-color="orange lighten 1" text-color="white" height="100%" @click.stop="saveInProgressOrder">Save</g-btn>
    <g-btn text background-color="blue darken 2" height="100%" @click.stop="routeToPayment">
      <span class="text-white">Pay</span>
    </g-btn>
  </div>
</template>

<script>
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import _ from 'lodash'

  export default {
    name: 'PosOrderScreenButtonGroup',
    components: { GBtn },
    injectService: [
      'PosStore:(quickCash,activeTableProduct,saveInProgressOrder)'
    ],
    computed: {
      hasActiveOrderProduct() {
        return !_.isNil(this.activeTableProduct)
      }
    },
    methods: {
      openDialogChangePrice() {
        this.$getService('dialogChangePrice:open')('new')
      },
      openDialogDiscount() {
        this.$getService('dialogChangePrice:open')('amount')
      },
      openDialogProductLookup() {
        this.$getService('dialogProductLookup:setActive')(true)
      },
      routeToPayment() {
        this.$router.push({path: `test-pos-payment`})
      }
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