<template>
  <g-dialog v-model="internalValue" width="464" overlayOpacity="0.2" eager persistent>
    <div class="cpn-order-created">
      <div class="cpn-order-created__header">
        <div class="mt-2">{{$t('store.orderSuccessfully')}}</div>
      </div>
      <div class="cpn-order-created__content">
        <!-- Order progress -->
        <div style="text-align: center">
          <div class="order-progress">
            <div style="position:relative; background-color: #EEEEEE; border-radius: 50%; display: inline-block;">
              <g-progress-circular v-if="inSprint" :rotate="-90" size="80" width="4" :value="inSprintProgress" color="#536DFE"/>
              <g-progress-circular v-if="waitingConfirm" :rotate="-90" size="80" width="4" :value="confirmProgress" color="#536DFE"/>
              <div v-if="waitingConfirm" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #424242; font-weight: bold; font-size: 18px;">{{ remainConfirmTime }}</div>
              <div v-if="orderHasBeenProcessed || orderMissed" style="padding: 4px;">
                <div :style="actResultDivStyle">
                  <img draggable="false" v-if="confirmed" src="/plugins/pos-plugin/assets/order-progress--confirmed.svg">
                  <img draggable="false" v-else-if="cancelled || orderMissed" src="/plugins/pos-plugin/assets/order-progress--cancelled.svg">
                </div>
              </div>
            </div>
            <div style="font-size: 18px; margin-top: 13px; margin-bottom: 30px; max-width: 350px">
              <div v-if="inSprint">Sending your order to the restaurant...</div>
              <div v-else-if="waitingConfirm">{{ waitingConfirmMessage }}</div>
              <div v-else-if="orderMissed">
                <div style="color: #E57373">Order missed</div>
                <div style="color: #747474">We apologize for any convenience caused. You can <a>try again!</a></div>
              </div>
              <div v-else-if="confirmed">
                <div>Your order is confirmed for </div>
                <div style="font-weight: bold">{{ deliveryTime }}</div>
              </div>
              <div v-else-if="cancelled">
                <div style="color: #E57373">Sorry, your order has been cancelled!</div>
                <div style="color: #747474">Reason: {{ cancelledReason }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-for="(item, index) in order.items" :key="index" class="order-detail">
          <div class="order-detail__index" >{{ item.quantity || 1}}</div>
          <div class="order-detail__name">{{ item.name }}</div>
          <div>{{ item.price * (item.quantity || 1) | currency }}</div>
        </div>
        <div class="mt-2 row-flex fs-small">
          <span>{{$t('store.total')}} <b>{{ totalItems }}</b> {{$t('store.items')}}</span>
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
      <div v-if="orderHasBeenProcessed || orderMissed" class="cpn-order-created__actions">
        <g-btn-bs width="98" text-color="#536DFE" rounded @click="close">Close</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'OrderCreated',
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
        deliveryTime: '',
        cancelledReason: '',
        sprintTimeOut: 60,
        orderProcessTimeOut: 180, // 3 minutes
        waited: 0,
        status: 'inProgress', // inProgress, kitchen, declined,
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
      },
      inSprint() {
        return this.order.status === 'inProgress' && this.waited <= this.sprintTimeOut
      },
      inSprintProgress() {
        if (this.inSprint) {
          const x = this.waited / this.sprintTimeOut
          // Refs: https://easings.net/#easeOutSine
          return 100 * Math.sin((x * Math.PI) / 2)
        }
      },
      waitingConfirm() {
        return this.order.status === 'inProgress' && this.waited > this.sprintTimeOut && this.waited < this.orderProcessTimeOut
      },
      totalConfirmTime() {
        return this.orderProcessTimeOut - this.sprintTimeOut
      },
      waitedConfirmTime() {
        return this.waited - this.sprintTimeOut
      },
      remainConfirmTime() {
        return this.totalConfirmTime - this.waitedConfirmTime
      },
      confirmProgress() {
        if (this.waitingConfirm)
          return 100 * this.remainConfirmTime / this.totalConfirmTime
      },
      waitingConfirmMessage() {
        if (this.remainConfirmTime > this.totalConfirmTime / 2)
          return 'Please wait while we proceed your order.'
        else if (this.remainConfirmTime > this.totalConfirmTime / 4)
          return 'The process might take a while...'
        else
          return 'Hold on! The restaurant might be crowded at the moment...'
      },
      orderMissed() {
        return this.order.status === 'inProgress' && this.waited >= this.orderProcessTimeOut
      },
      confirmed() {
        return this.order.status === 'kitchen'
      },
      cancelled() {
        return this.order.status === 'declined' || this.waited > this.orderProcessTimeOut
      },
      actResultDivStyle() {
        return {
          width: '80px',
          height: '80px',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'border-radius': '50%',
          'background-color': this.confirmed ? '#536DFE' : '#E57373',
        }
      },
      totalItems() {
        return this.order.items ? this.order.items.reduce((quan, item) => quan + item.quantity, 0) : 0
      }
    },
    methods: {
      close() {
        this.internalValue = false
      }
    },
    created() {
      window.cms.socket.on('updateOrderStatus', (orderToken, orderStatus, extraInfo) => {
        if (orderToken === this.order.orderToken) {
          this.order.status = orderStatus
          if (orderStatus === 'declined') {
            this.cancelledReason = extraInfo
          } else if (orderStatus === 'kitchen') {
            this.deliveryTime = extraInfo
          }
        }
      })
      this.intervalId = setInterval(() => {
        this.waited++
        if (this.waited === this.orderProcessTimeOut) {
          clearInterval(this.intervalId)
        }
      }, 1000)
    },
    beforeDestroy() {
      window.cms.socket.off('updateOrderStatus')
      clearInterval(this.intervalId)
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

  
  /* Order progress */
  .order-progress {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  ::v-deep {
    .g-progress-circular__underlay {
      stroke: transparent;
    }
  }
</style>
