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
      currentOrder: null,
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
        this.$router.go(-1)
      },
      pay() {
        const backToDashboard = !!this.currentOrder.table
        this.$emit('pay')
        if (backToDashboard) this.$router.push({path: '/view/pos-dashboard'})
        else this.$router.go(-1)
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
