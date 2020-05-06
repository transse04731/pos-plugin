<template>
  <g-dialog v-model="internalValue" width="464" overlayOpacity="0.2" eager persistent>
    <div class="cpn-order-created">
      <div class="cpn-order-created__header">
        <div class="mt-2">{{$t('store.orderSuccessfully')}}</div>
      </div>
      <div class="cpn-order-created__content">
        <!-- Order progress -->
        <div style="text-align: center">
          <order-progress :status="order.status"/>
        </div>
        
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
      </div>
      <div v-if="orderHasBeenProcessed" class="cpn-order-created__actions">
        <g-btn-bs width="98" text-color="#536DFE" rounded @click="close">Close</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  import OrderProgress from './OrderProgress';
  export default {
    name: 'OrderCreated',
    components: { OrderProgress },
    props: {
      value: Boolean,
      order: Object,
    },
    filters: {
      currency(value) {
        if (value)
          return $t('common.currency') + value.toFixed(2)
        return 0
      }
    },
    data() {
      return {
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
      },
      orderHasBeenProcessed() {
        return this.order.status !== 'inProgress'
      }
    },
    methods: {
      close() {
        this.internalValue = false
      }
    },
    created() {
      window.cms.socket.on('updateOrderStatus', (orderToken, orderStatus) => {
        if (orderToken === this.order.orderToken)
          this.order.status = orderStatus
      })
    },
    beforeDestroy() {
      window.cms.socket.off('updateOrderStatus')
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
      margin-bottom: 50px;
      overflow: hidden scroll;
      max-height: calc(100% - 120px);
      scrollbar-width: none; // firefox

      &::-webkit-scrollbar {
        display: none;
      }

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
      padding-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      border-top: 1px solid #eee;
    }
  }

  @media screen and (max-width: 1040px) {
    .cpn-order-created {
      padding: 24px;
    }
  }
</style>
