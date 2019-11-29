<template>
  <div style="padding: 13px">
    <p class="title">Color</p>
    <pos-color-selector></pos-color-selector>
  </div>
</template>

<script>
  import PosColorSelector from '../Article/PosColorSelector';
  export default {
    name: 'FnColorSelector',
    components: { PosColorSelector },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .g-row {
    margin-top: 20px;
  }

  .title {
    font-size: 13px;
    line-height: 16px;
  }
</style>
