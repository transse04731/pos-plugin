<template>
  <g-toolbar color="#eee" height="100%" elevation="0">
    <g-btn-bs icon="icon-back">Back</g-btn-bs>
    <g-btn-bs icon="icon-menu">More</g-btn-bs>
    <g-btn-bs icon="icon-promotion">Promotion</g-btn-bs>
    <g-btn-bs icon="icon-cashier">Cashier drawer</g-btn-bs>
    <g-btn-bs icon="icon-split_check_2">Split check</g-btn-bs>
    <g-btn-bs icon="icon-red_bill">Red bill</g-btn-bs>
    <g-btn-bs icon="icon-print">Bill</g-btn-bs>
    <g-btn-bs class="col-3" background-color="#2979FF">Pay</g-btn-bs>
  </g-toolbar>
</template>

<script>
  export default {
    name: "PosRestaurantPaymentToolbar"
  }
</script>

<style scoped lang="scss">
  .g-btn-bs {
    background-color: white;
    font-size: 14px;
  }
</style>
