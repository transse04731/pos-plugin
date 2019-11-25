<template>
  <g-toolbar area="toolbar" color="#eee" elevation="0" fill-height>
    <g-btn background-color="white" class="mr-3" style="margin-left: -4px">
      <g-icon class="mr-2" svg>icon-back</g-icon>
      Back
    </g-btn>
  </g-toolbar>
</template>


<script>
  import {
    GIcon,
    GToolbar,
    GBtn,
  } from 'pos-vue-framework/src/components/';

  export default {
    name: 'FunctionToolbar',
    components: { GToolbar, GIcon, GBtn,  }
  }
</script>

<style scoped>

</style>
