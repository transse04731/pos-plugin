<template>
  <div style="height: 100vh; width: 100%">
    <slot :name="viewName" v-bind="viewParams"/>
  </div>
</template>

<script>
  export default {
    name: 'ContentRender',
    props: {
      view: {
        type: Object,
        default: () => ({ name: '', params: '' })
      },
    },
    computed: {
      viewName() {
        if (this.view)
          return this.view.name
      },
      viewParams() {
        if (this.view)
          return this.view.params
      }
    }
  }
</script>
