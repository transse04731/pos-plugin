<template>
  <g-toolbar height="100%" elevation="0" color="#eee">
    <g-btn-bs icon="icon-back" @click="back">Back</g-btn-bs>
    <g-btn-bs icon="icon-edit-menu-card-switch" @click="switchItem">Switch</g-btn-bs>
    <g-btn-bs icon="icon-edit-menu-card-copy" @click="copyItem">Copy</g-btn-bs>
    <g-spacer/>
    <g-btn-bs icon="icon-edit-menu-card-delete" @click="deleteItem">Delete</g-btn-bs>
  </g-toolbar>
</template>
<script>
  export default {
    name: 'EditMenuCardToolbar',
    props: {},
    data: function () {
      return {}
    },
    computed: {},
    methods: {
      back() {
        this.$router.push({path: '/view/pos-dashboard'})
      },
      copyItem() {

      },
      switchItem() {

      },
      deleteItem() {

      },

    }
  }
</script>
<style scoped lang="scss">
  .g-btn-bs {
    background-color: white;
    font-size: 14px;
  }
</style>
