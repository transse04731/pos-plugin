<template>
  <g-toolbar color="#eee" elevation="0" height="100%">
    <g-btn background-color="white" class="mr-3" style="margin-left: -4px">
      <g-icon class="mr-2" svg>icon-back</g-icon>
      Back
    </g-btn>
    <g-btn background-color="white" class="mr-3">
      <g-icon class="mr-2" svg>icon-menu</g-icon>
      More
    </g-btn>
    <g-badge overlay color="#FF4452">
      <template v-slot:badge>
        <span>2</span>
      </template>
      <g-btn background-color="white" @click="openDialogSavedList">
        <g-icon class="mr-2" svg>icon-folder</g-icon>
        Saved list
      </g-btn>
    </g-badge>
  </g-toolbar>
</template>

<script>
  import GToolbar from 'pos-vue-framework/src/components/GToolbar/GToolbar';
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  import GBadge from 'pos-vue-framework/src/components/GBadge/GBadge';

  export default {
    name: 'PosOrderScreenToolbar',
    components: { GBadge, GIcon, GBtn, GToolbar },
    methods: {
      openDialogSavedList() {
        this.$getService('dialogSavedList:setActive')(true)
      }
    }
  }
</script>

<style scoped lang="scss">
  .toolbar {
  .g-badge-wrapper .g-btn {
    margin-right: 0;
  }

  .g-toolbar-content > .g-btn:first-child {
    margin-left: 0;
  }

  .g-toolbar-background > div {
    box-shadow: inset -8px 0 8px -8px rgba(0, 0, 0, 0.25);
  }
  }
</style>