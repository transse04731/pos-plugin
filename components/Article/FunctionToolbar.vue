<template>
  <!--  <div style="background-color: #EEEEEE; padding: 12px; position: relative; bottom: 0; width: 100%">-->
  <!--    <g-btn background-color="white" class="mr-2">-->
  <!--      <router-link to="/order">-->
  <!--        <g-icon class="mr-2" svg>icon-back</g-icon>-->
  <!--        <span style="color: rgba(0, 0, 0, 0.87)">Back</span>-->
  <!--      </router-link>-->
  <!--    </g-btn>-->
  <!--  </div>-->
  <g-toolbar area="toolbar" color="#eee" elevation="0" fill-height>
    <g-btn background-color="white" class="mr-3" style="margin-left: -4px">
      <g-icon class="mr-2" svg>icon-back</g-icon>
      Back
    </g-btn>
  </g-toolbar>
</template>


<script>
  import {
    GGridLayout,
    GRadio,
    GRadioGroup,
    GKeyboard,
    GSpacer,
    GTextField,
    GScrollWindowItem,
    GScrollWindow,
    GCardText,
    GCardActions,
    GCardTitle,
    GCard,
    GDialog,
    GIcon,
    GBadge,
    GToolbar,
    GDivider,
    GSimpleTable,
    GImg,
    GAvatar,
    GItem,
    GItemGroup,
    GWindowItem,
    GWindow,
    GNumberKeyboard,
    GRow,
    GBtn,
  } from 'pos-vue-framework/src/components/';

  export default {
    name: 'FunctionToolbar',
    components: { GToolbar, GIcon, GBtn, GBadge }
  }
</script>

<style scoped>

</style>
