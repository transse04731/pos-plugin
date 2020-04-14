<template>
  <g-dialog>
    <div class="dlg-order-created">
      <div class="dlg-order-created__body">
        <img src="/plugins/pos-plugin/assets/empty-order.svg">
        <div class="dlg-order-created__header">Order Successfully</div>
        <div class="dlg-order-created__content">Please enter your email address if you would like to receive notifications for future discount & promotion.</div>
        <g-text-fields-bs prepend-icon="email" label="Email"/>
      </div>
      <div class="dlg-order-created__actions">
        <g-btn-bs @click="close">Close</g-btn-bs>
        <g-btn-bs @click="subscribe">Subscribe</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogOrderCreated',
    props: {},
    data: function () {
      return {}
    },
    computed: {},
    methods: {
      close() {
      
      },
      subscribe() {
      
      }
    }
  }
</script>
<style scoped lang="scss">
  .dlg-order-created {
    
    &__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    &__header {
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      color: #536DFE;
    }
    
    &__content {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      color: #9E9E9E;
    }
    
    &__actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
</style>
