<template>
  <g-toolbar area="toolbar" color="grey lighten 3" height="100%">
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-2" @click="back">
      <g-icon class="mr-2" svg>
        icon-back
      </g-icon>
      Back
    </g-btn>
    <g-spacer/>
    <slot :name="internalValue"></slot>
  </g-toolbar>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: 'PosSettingsScreenToolbar',
    props: {
      value: String
    },
    computed: {
      internalValue() {
        if (!this.value) return 'Articles'
        const activeItemPath = this.value.split('.').slice(1).join('.')
        const activeItem = _.get(this.$getService('PosStore:sidebarData'), activeItemPath)
        if (activeItem.isView) return activeItem.title
      }
    },
    methods: {
      back() {
        this.$router.push({ path: '/view/pos-dashboard' })
      }
    }
  }
</script>

<style scoped>

</style>