<template>
  <div style="padding: 5px 21.5% 5px 5px; display: flex; justify-content: center; width: 100%">
    <div style="display: grid; grid-template-columns: 53px 62px 53px; grid-template-rows: 35px 46px 35px; grid-gap: 17px; width: 202px; height: 150px;">
      <div style="grid-column: 2 / 3; grid-row: 1 / 2; width: 62px; height: 35px;">
        <g-btn height="35" outlined style="color: #979797" width="62">
          <g-icon size="34">mdi-menu-up</g-icon>
        </g-btn>
      </div>
      <div style="grid-column: 2 / 3; grid-row: 3 / 4;">
        <g-btn height="35" outlined style="color: #979797" width="62">
          <g-icon size="34">mdi-menu-down</g-icon>
        </g-btn>
      </div>
      <div style="grid-column: 2 / 3; grid-row: 2 / 3; display: flex; justify-content: center; align-items: center;">
        <g-btn :height="46" :width="62" elevation="0" style="background-color: #EEEEEE; border: 3px solid #1271FF">5</g-btn>
      </div>
      <div style="grid-column: 1 / 2; grid-row: 2 / 3;">
        <g-btn height="46" outlined style="color: #979797; min-width: 53px;" width="53">
          <g-icon size="34">mdi-menu-left</g-icon>
        </g-btn>
      </div>
      <div style="grid-column: 3 / 4; grid-row: 2 / 3;">
        <g-btn height="46" outlined style="color: #979797;  min-width: 53px;" width="53">
          <g-icon size="34">mdi-menu-right</g-icon>
        </g-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import {GBtn, GIcon} from 'pos-vue-framework/src/components';

  export default {
    name: 'FunctionSortComponent',
    components: { GIcon, GBtn }
  }
</script>

<style scoped>

</style>
