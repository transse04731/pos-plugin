<template>
  <div style="padding: 45px 5px 20px 15px">
    <g-btn background-color="white" elevation="0" :disabled="value" width="140" text-color="red">
      <g-icon class="g-icon__left" size="16">mdi-minus-circle</g-icon>
      Remove button
    </g-btn>
  </div>
</template>

<script>
  export default {
    name: 'FnButtonAction',
    props: {
      value: true
    }
  }
</script>

<style scoped>

</style>
