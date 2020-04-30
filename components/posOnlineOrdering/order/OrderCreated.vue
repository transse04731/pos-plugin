<template>
  <g-dialog v-model="internalValue" width="464" overlayOpacity="0.2" eager persistent>
    <div class="cpn-order-created">
      <div class="cpn-order-created__header">
        <div class="mt-2">{{$t('store.orderSuccessfully')}}</div>
      </div>
      <div class="cpn-order-created__content">
        <div v-for="(item, index) in order.items" :key="index" class="order-detail">
          <div class="order-detail__index" >{{ item.quantity || 1}}</div>
          <div class="order-detail__name">{{ item.name }}</div>
          <div>{{ item.price * (item.quantity || 1) | currency }}</div>
        </div>
        <div class="mt-2 row-flex fs-small">
          <span>{{$t('store.total')}} <b>{{ order.items && order.items.length }}</b> {{$t('store.items')}}</span>
          <g-spacer/>
          <span>{{ order.totalPrice | currency }}</span>
        </div>
        <div class="order-detail">
          <span>{{$t('store.shippingFee')}}:</span>
          <g-spacer/>
          <span>{{ order.shippingFee | currency }}</span>
        </div>
        <div class="mt-2 row-flex fw-700 fs-small">
          <span>{{$t('store.total')}}</span>
          <g-spacer/>
          <span>{{ (order.totalPrice + order.shippingFee) | currency}}</span>
        </div>
        <div class="cpn-order-created__message">Please enter your email address if you would like to receive notifications for future discount & promotion.</div>
        <g-text-field v-model="email" prepend-icon="email" label="Email"/>
      </div>
      <div class="cpn-order-created__actions">
        <g-btn-bs width="98" background-color="#536DFE" text-color="#FFF" rounded @click="confirm">OK</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'OrderCreated',
    filters: {
      currency(value) {
        if (value)
          return $t('common.currency') + value.toFixed(2)
        return 0
      }
    },
    props: {
      value: Boolean,
      order: Object,
    },
    data() {
      return {
        email: '',
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      confirm() {
        if (this.email)
          this.$emit('subscribe', this.email)
        else
          this.$emit('close')
        this.internalValue = false
      }
    }
  }
</script>
<style scoped lang="scss">
  .cpn-order-created {
    background-color: #FFF;
    width: 100%;
    border-radius: 4px;
    box-shadow: 0px 0px 28px rgba(58, 56, 56, 0.15);
    padding: 24px 48px;
    
    &__header {
      font-weight: bold;
      font-size: 20px;
      line-height: 25px;
      color: #536DFE;
      margin-top: 16px;
      margin-bottom: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      & > img {
        max-width: 60px;
      }
    }
    
    &__message {
      margin-top: 24px;
      font-size: 14px;
      line-height: 18px;
      color: #9E9E9E;
    }

    &__content {
      overflow: hidden scroll;
      max-height: calc(100% - 140px);

      .order-detail {
        display: flex;
        border-bottom: 1px solid #D8D8D8;
        padding-top: 8px;
        padding-bottom: 8px;
        font-size: 14px;

        &__index {
          width: 20px;
          height: 20px;
          line-height: 20px;
          font-weight: bold;
          font-size: 13px;
          margin-right: 10px;
          background-color: #424242;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1398);
          color: #FFF;
          text-align: center;
          border-radius: 50%;
        }

        &__name {
          min-width: 0;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
      }

      .g-tf-wrapper ::v-deep input {
        user-select: text !important;
      }
    }
    
    &__actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  @media screen and (max-width: 1040px) {
    .cpn-order-created {
      padding: 24px;
    }
  }
</style>
