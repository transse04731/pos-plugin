<template>
  <div>
    <g-btn outlined height="100%">F1</g-btn>
    <g-btn outlined height="100%">F2</g-btn>
    <g-btn outlined height="100%">F3</g-btn>
    <g-btn outlined height="100%">F4</g-btn>
  </div>
</template>

<script>
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  export default {
    name: 'PosOrderScreenAction',
    components: { GBtn },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .action {
    padding: 9px 6px;
  }
</style>