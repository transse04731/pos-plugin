<template>
  <div>
    <g-btn :uppercase="false" outlined height="100%">F1</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F2</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F1</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F2</g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenActions',
  }
</script>

<style scoped lang="scss">
  .action {
    padding: 8px;
  }
</style>