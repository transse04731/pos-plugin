<template>
  <g-toolbar absolute bottom color="grey lighten 3">
    <g-btn background-color="white" text-color="#1d1d26">
      <g-icon class="mr-2" svg>
        icon-back
      </g-icon>
      Back
    </g-btn>
  </g-toolbar>
</template>

<script>
  import {GSimpleTable, GBtn, GIcon, GToolbar} from 'pos-vue-framework/src/components';

  export default {
    name: 'viewGeneralToolbar',
    components: { GSimpleTable, GBtn, GIcon, GToolbar },
  }
</script>

<style scoped>

</style>