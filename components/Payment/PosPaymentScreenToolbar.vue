<template>
  <g-toolbar color="#eee" elevation="0" fill-height>
    <g-btn :uppercase="false" background-color="white" class="mr-2" @click.stop="back">
      <g-icon class="mr-2" svg>icon-back</g-icon>
      <span style="color: rgba(0, 0, 0, 0.87)">Back</span>
    </g-btn>
    <g-btn :uppercase="false" background-color="white" class="mr-2">
      <g-icon class="mr-2" svg>icon-menu</g-icon>
      More
    </g-btn>
    <g-btn :uppercase="false" background-color="white" @click="dialogSavedList = true">
      <g-icon class="mr-2" svg>icon-cashier</g-icon>
      Cashier drawer
    </g-btn>
  </g-toolbar>
</template>

<script>
  export default {
    name: 'PosPaymentScreenToolbar',
    methods: {
      back() {
        this.$router.push({path: '/view/test-pos-order'})
      }
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