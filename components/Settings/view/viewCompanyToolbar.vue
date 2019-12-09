<template>
  <g-toolbar absolute bottom color="grey lighten 3">
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" @click="back">
      <g-icon class="mr-2" svg>
        icon-back
      </g-icon>
      Back
    </g-btn>
  </g-toolbar>
</template>

<script>
  export default {
    name: 'viewCompanyToolbar',
    data() {
      return {}
    },
    methods: {
      back() {
        this.$router.push({ path: '/view/test-pos-dashboard' })
      },
    }
  }
</script>

<style scoped>

</style>