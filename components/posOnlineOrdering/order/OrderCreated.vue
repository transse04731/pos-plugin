<template>
  <div class="cpn-order-created">
    <g-spacer/>
    <div class="cpn-order-created__body">
      <img src="/plugins/pos-plugin/assets/empty-order.svg">
      <div class="cpn-order-created__header">Order Successfully</div>
      <div class="cpn-order-created__content">Please enter your email address if you would like to receive notifications for future discount & promotion.</div>
      <g-text-field v-model="email" prepend-icon="email" label="Email"/>
    </div>
    <g-spacer/>
    <div class="cpn-order-created__actions">
      <g-btn flat rounded @click="close"  class="mr-2">Close</g-btn>
      <g-btn flat background-color="#536DFE" text-color="#FFF" rounded @click="subscribe">Subscribe</g-btn>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OrderCreated',
    data() {
      return {
        email: '',
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      subscribe() {
        this.$emit('subscribe', this.email)
      }
    }
  }
</script>
<style scoped lang="scss">
  .cpn-order-created {
    background-color: #FFF;
    
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
