<template>
  <div style="padding: 3px 5px 20px 15px">
    <p-o-s-text-field label="Value" placeholder="Fill your value"></p-o-s-text-field>
  </div>
</template>

<script>
  import POSTextField from 'pos-vue-framework/src/POSComponents/POSInput/POSTextField';
  export default {
    name: 'FnAction',
    components: { POSTextField }
  }
</script>

<style scoped>

</style>
