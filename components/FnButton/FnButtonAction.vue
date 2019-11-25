<template>
  <div style="padding: 45px 5px 20px 15px">
    <g-btn background-color="white" elevation="0" :disabled="value" width="140" text-color="red">
      <g-icon class="g-icon__left" size="16">mdi-minus-circle</g-icon>
      Remove button
    </g-btn>
  </div>
</template>

<script>
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  export default {
    name: 'FnButtonAction',
    components: { GIcon, GBtn },
    props: {
      value: true
    }
  }
</script>

<style scoped>

</style>
