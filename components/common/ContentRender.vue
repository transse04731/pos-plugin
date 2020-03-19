<template>
  <div style="height: 100vh; width: 100%">
    <slot :name="viewName" v-bind="viewParams"/>
  </div>
</template>

<script>
  export default {
    name: 'ContentRender',
    props: {
      value: {
        type: Object,
        default: () => ({ name: '', params: '' })
      },
    },
    computed: {
      viewName() {
        if (this.value)
          return this.value.name
      },
      viewParams() {
        if (this.value)
          return this.value.params
      }
    }
  }
</script>
