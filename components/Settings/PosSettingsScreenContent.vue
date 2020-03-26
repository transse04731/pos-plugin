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
        const sidebarData = this.$getService('SettingsStore:sidebarData');
        if (!this.value) return sidebarData[0].title
        const activeItemPath = this.value.split('.').slice(1).join('.')
        const activeItem = _.get(sidebarData, activeItemPath)
        if (activeItem.isView) return activeItem.title
      }
    }
  }
</script>

<style scoped>

</style>