<template>
  <div>
    <div>POS Management</div>
    <div class="pos-management__actions-bar">
      <g-text-field-bs prepend-icon="search" placeholder="Search name or branch"/>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'PosManagement',
    props: {},
    data: function () {
      return {
        storePlaceHolder: $t('posManagement.searchPlaceholder')
      }
    },
    computed: {},
    methods: {}
  }
</script>
<style scoped>
</style>
