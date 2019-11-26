<template>
  <div area="content">
    <slot :name="internalValue"></slot>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: 'PosSettingsScreenContent',
    props: {
      value: String
    },
    computed: {
      internalValue() {
        if (!this.value) return
        const activeItemPath = this.value.split('.').slice(1).join('.')
        const activeItem = _.get(this.$getService('PosStore:sidebarData'), activeItemPath)
        if (activeItem.isView) return activeItem.title
      }
    }
  }
</script>

<style scoped>

</style>