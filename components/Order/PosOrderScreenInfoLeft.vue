<template>
  <p class="info__left" v-if="lastPayment > 0">
    Last Pay:
    <span>€{{lastPayment | formatNumber}}</span>
  </p>
</template>

<script>
  export default {
    name: 'PosOrderScreenInfoLeft',
    injectService: [
      'PosStore:paymentTotal',
      'PosStore:lastPayment'
    ]
  }
</script>

<style scoped lang="scss">
  .info__left {
    display: flex;
    padding: 16px;
    align-items: center;
    font-size: 13px;
    font-weight: 700;

    span {
      color: #1271ff;
      margin-left: 8px;
    }
  }
</style>