<template>
  <div>
    <g-btn outlined height="100%">F1</g-btn>
    <g-btn outlined height="100%">F2</g-btn>
    <g-btn outlined height="100%">F1</g-btn>
    <g-btn outlined height="100%">F2</g-btn>
  </div>
</template>

<script>
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  export default {
    name: 'PosPaymentScreenActions',
    components: { GBtn }
  }
</script>

<style scoped lang="scss">
  .action {
    padding: 8px;
  }
</style>