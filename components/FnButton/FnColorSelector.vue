<template>
  <div style="padding: 13px">
    <p class="title">Color</p>
    <pos-color-selector></pos-color-selector>
  </div>
</template>

<script>
  import GGridSelect from 'pos-vue-framework/src/components/GGridSelect/GGridSelect';
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GBadge from 'pos-vue-framework/src/components/GBadge/GBadge';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  import PosColorSelector from '../Article/PosColorSelector';
  export default {
    name: 'FnColorSelector',
    components: { PosColorSelector, GIcon, GBadge, GBtn, GGridSelect },
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
