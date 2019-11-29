<template>
  <div style="padding: 12px 10px 12px 13px;">
    <p-o-s-text-field label="Button Name" placeholder="Fill your text">
      <template v-slot:append>
        <g-icon color="red">mdi-keyboard</g-icon>
      </template>
    </p-o-s-text-field>
  </div>
</template>

<script>
  import POSTextField from 'pos-vue-framework/src/POSComponents/POSInput/POSTextField';
  export default {
    name: 'FnButtonName',
    components: { POSTextField }
  }
</script>

<style scoped>

</style>
