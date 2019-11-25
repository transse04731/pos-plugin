<template>
  <g-toolbar color="#eee" elevation="0" fill-height>
    <g-btn background-color="white" class="mr-2">
      <router-link to="/order">
        <g-icon class="mr-2" svg>icon-back</g-icon>
        <span style="color: rgba(0, 0, 0, 0.87)">Back</span>
      </router-link>
    </g-btn>
    <g-btn background-color="white" class="mr-2">
      <g-icon class="mr-2" svg>icon-menu</g-icon>
      More
    </g-btn>
    <g-btn background-color="white" @click="dialogSavedList = true">
      <g-icon class="mr-2" svg>icon-cashier</g-icon>
      Cashier drawer
    </g-btn>
  </g-toolbar>
</template>

<script>
  import GToolbar from 'pos-vue-framework/src/components/GToolbar/GToolbar';
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  export default {
    name: 'PosPaymentScreenToolbar',
    components: { GIcon, GBtn, GToolbar },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .toolbar {
    grid-area: toolbar;
    width: 100%;

    ::v-deep .g-badge-wrapper .g-btn {
      margin-right: 0;
    }

    ::v-deep .g-toolbar-content > .g-btn:first-child {
      margin-left: 0;
    }

    ::v-deep .g-toolbar-background > div {
      box-shadow: inset -8px 0 8px -8px rgba(0, 0, 0, 0.25);
    }
  }
</style>