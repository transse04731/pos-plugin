<template>
  <p v-if="lastPayment > 0">Last Pay: <span style="color: #1271ff">€ {{convertMoney(lastPayment)}}</span></p>
</template>

<script>
  export default {
    name: 'PosOrderScreenInfoLeft',
    injectService: [
      'PosStore:convertMoney',
      'PosStore:paymentTotal',
      'PosStore:lastPayment'
    ]
  }
</script>

<style scoped>
  .info__left {
    display: flex;
    padding: 16px;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
  }
</style>