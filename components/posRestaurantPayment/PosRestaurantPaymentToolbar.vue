<template>
  <g-toolbar color="#eee" height="100%" elevation="0">
    <g-btn-bs icon="icon-back" @click.stop="back">Back</g-btn-bs>
    <g-btn-bs icon="icon-menu">More</g-btn-bs>
    <g-btn-bs icon="icon-promotion" @click.stop="promotion">Promotion</g-btn-bs>
    <g-btn-bs icon="icon-cashier">Cashier drawer</g-btn-bs>
    <g-btn-bs icon="icon-split_check_2">Split check</g-btn-bs>
    <g-btn-bs icon="icon-red_bill">Red bill</g-btn-bs>
    <g-btn-bs icon="icon-print2">Bill</g-btn-bs>
    <g-spacer/>
    <g-btn-bs class="col-2" background-color="#2979FF" :disabled="isPayBtnDisabled" @click.stop="pay">Pay</g-btn-bs>
  </g-toolbar>
</template>

<script>
  export default {
    name: "PosRestaurantPaymentToolbar",
    props: {
      paymentAmountTendered: String,
      paymentTotal: Number
    },
    computed: {
      isPayBtnDisabled() {
        return +this.paymentAmountTendered < this.paymentTotal
      }
    },
    methods: {
      back() {
        this.$router.push({path: '/view/pos-order-2'})
      },
      pay() {
        this.$emit('pay')
      },
      promotion() {
        this.$emit('promotion')
      }
    }
  }
</script>

<style scoped lang="scss">
  .g-btn-bs {
    background-color: white;
    font-size: 14px;
  }
</style>
