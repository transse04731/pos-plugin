<template>
  <g-dialog v-model="value">
    <div class="dlg-order-created">
      <div class="dlg-order-created__body">
        <img src="/plugins/pos-plugin/assets/empty-order.svg">
        <div class="dlg-order-created__header">Order Successfully</div>
        <div class="dlg-order-created__content">Please enter your email address if you would like to receive notifications for future discount & promotion.</div>
        <g-text-field prepend-icon="email" label="Email"/>
      </div>
      <div class="dlg-order-created__actions">
        <g-btn flat rounded @click="close"  class="mr-2">Close</g-btn>
        <g-btn flat background-color="#536DFE" text-color="#FFF" rounded @click="subscribe">Subscribe</g-btn>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogOrderCreated',
    props: {
      value: Boolean
    },
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
    background-color: #FFF;
    width: 464px;
    height: 363px;
    padding: 30px;
    border-radius: 5px;
    margin: 0 auto;
    
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
      margin-top: 20px;
      margin-bottom: 20px;
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
