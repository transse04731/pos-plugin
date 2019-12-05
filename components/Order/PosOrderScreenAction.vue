<template>
  <div>
    <g-btn :uppercase="false" outlined height="100%">F1</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F2</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F3</g-btn>
    <g-btn :uppercase="false" outlined height="100%">F4</g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenAction',
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .action {
    padding: 9px 6px;
  }

  .g-btn {
    &.g-btn__outlined {
      border: 1px solid #979797;
      background-color: #fafafa;
    }
  }
</style>