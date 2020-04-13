<template>
  <div class="main">
    <div class="pending-orders pr-2">
      <div class="header">
        Pending Orders
        <g-badge inline :value="true" color="#4CAF50" v-if="internalOrders && internalOrders.length">
          <template v-slot:badge>
            <div class="px-2">{{internalOrders.length}}</div>
          </template>
        </g-badge>
      </div>
      <div class="content">
        <template v-if="!internalOrders || !internalOrders.length">
          <div class="pending-orders--empty">
            <img alt src="/plugins/pos-plugin/assets/pending_order.svg"/>
            <p>No Pending orders yet</p>
          </div>
        </template>
        <template v-else>
          <g-card elevation="0" v-for="(order, index) in internalOrders" :key="index">
            <g-card-title>
              <g-icon v-if="order.type === 'delivery'">icon-delivery-man</g-icon>
              <g-icon v-if="order.type === 'pickup'">icon-pickup</g-icon>
              <span class="fs-small-2 ml-1">
                <span class="text-indigo-accent-2">#{{order.id}}</span>
                {{order.customer ? order.customer.name : 'No customer name'}} - {{order.customer ? order.customer.phoneNo : 'No customer phone'}}
              </span>
              <g-spacer/>
              <span class="fw-700 fs-small">{{order.date | formatDate}}</span>
            </g-card-title>
            <g-card-text>
              <div class="row-flex" v-if="order.customer">
                <div class="col-1">
                  <g-icon color="#9E9E9E" size="20">icon-place</g-icon>
                </div>
                <div class="col-10">{{`${order.customer.address} ${order.customer.address}`}}</div>
              </div>
              <div v-if="order.items">
                <div class="row-flex" v-for="item in order.items">
                  <div class="col-1 fw-700">{{item.quantity}}x</div>
                  <div class="col-8 fs-small-2">
                    {{item.id}}. {{item.name}}
                    <template v-if="item.modifiers.length > 0">
                      <span class="i text-grey">(<span v-for="modifier in item.modifiers">{{modifier}}</span>)</span>
                    </template>
                  </div>
                  <div class="col-3 fs-small-2 ta-right">€{{item.price.toFixed(2)}}</div>
                </div>
              </div>
            </g-card-text>
            <g-card-actions v-if="order.declineStep2">
              <g-text-field-bs label="Reason to decline (optional)" v-model="order.declineReason"/>
            </g-card-actions>
            <g-card-actions v-if="order.confirmStep2">
              <value-picker :values="[15, 30, 45, 60]" :default-value="defaultPrepareTime || 30" allow-custom v-model="order.prepareTime"></value-picker>
            </g-card-actions>
            <g-card-actions>
              <g-btn-bs width="60" border-color="#C4C4C4" text-color="black" @click.stop="onClickDecline(order)">
                {{order.confirmStep2 ? 'Back' : 'No'}}
              </g-btn-bs>
              <g-btn-bs icon="icon-printer-setting" background-color="#E0E0E0" text-color="black" style="flex: 1" @click.stop="onClickAccept(order)">
                {{getPaymentTexts(order.payment)}}
              </g-btn-bs>
            </g-card-actions>
          </g-card>
        </template>
      </div>
    </div>
    <div class="kitchen-orders pl-2">
      <div class="header">
        Sent to kitchen
        <g-badge inline :value="true" color="#F9A825" v-if="sortedKitchenOrders && sortedKitchenOrders.length">
          <template v-slot:badge>
            <div class="px-2">{{sortedKitchenOrders.length}}</div>
          </template>
        </g-badge>
      </div>
      <div class="content">
        <template v-if="!sortedKitchenOrders || !sortedKitchenOrders.length">
          <div class="kitchen-orders--empty">
            <p>No orders sent to kitchen</p>
          </div>
        </template>
        <template v-else>
          <g-card elevation="0" v-for="(order, index) in sortedKitchenOrders" :key="index"
                  :style="[order.prepareTime < 10 && {border: '1px solid #FF4452'}]">
            <g-card-title>
              <span class="fs-small-2 ml-1">
                <span class="text-indigo-accent-2">#{{order.id}}</span>
                {{order.customer ? order.customer.name : 'No customer name'}} - {{order.customer ? order.customer.phoneNo : 'No customer phone'}}
              </span>
              <g-spacer/>
              <div class="kitchen-orders__timer" @click.stop="openDialog(order)">
                <g-icon v-if="order.type === 'delivery'">icon-delivery-man</g-icon>
                <g-icon v-if="order.type === 'pickup'">icon-pickup</g-icon>
                <span class="fw-700 fs-small">{{order.deliveryDate | formatDate}}</span>
              </div>
            </g-card-title>
            <g-card-text>
              <div class="row-flex" v-if="order.customer">
                <div class="col-1">
                  <g-icon color="#9E9E9E" size="20">icon-place</g-icon>
                </div>
                <div class="col-10">{{`${order.customer.address} ${order.customer.address}`}}</div>
              </div>
              <div class="row-flex" v-if="order.items">
                <div class="col-1">
                  <g-icon color="#9E9E9E" size="20">icon-food</g-icon>
                </div>
                <div class="row-flex">
                  <template v-for="item in order.items">
                    <div class="fw-700 mr-1">{{item.quantity}}x</div>
                    <div class="mr-3">
                      {{item.id}}. {{item.name}}
                      <template v-if="item.modifiers.length > 0">
                        <span class="i text-grey">(<span v-for="modifier in item.modifiers">{{modifier}}</span>)</span>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </g-card-text>
          </g-card>
        </template>
      </div>
    </div>
    <dialog-complete-order ref="dialog" v-model="showDialog"
                           @completeOrder="completeOrder"
                           @setPendingOrder="setPendingOrder"
                           @declineOrder="declineOrder"
    ></dialog-complete-order>
  </div>
</template>

<script>
  import ValuePicker from './ValuePicker';
  import DialogCompleteOrder from './dialogCompleteOrder';
  export default {
    name: 'OnlineOrderMain',
    components: { DialogCompleteOrder, ValuePicker },
    props: {
      pendingOrders: Array,
      kitchenOrders: Array,
      defaultPrepareTime: Number,
      onlineOrderSorting: String
    },
    filters: {
      formatDate(date) {
        return dayjs(date).format('HH:mm')
      }
    },
    data() {
      return {
        internalOrders: [],
        showDialog: false
      }
    },
    watch: {
      pendingOrders(val) {
        this.internalOrders = val.map(i => ({
          ...i,
          confirmStep2: false,
          declineStep2: false,
          prepareTime: null,
          declineReason: ''
        }))
      }
    },
    computed: {
      sortedKitchenOrders() {
        if (this.onlineOrderSorting) this.internalOrders = this.internalOrders.sort((current, next) => {
          if (!current.id || next.id) return false
          if (this.onlineOrderSorting === 'order') {
            return next.id - current.id
          } else return current.prepareTime - next.prepareTime
        })
        return this.kitchenOrders
      }
    },
    methods: {
      getPaymentTexts(payments) {
        return payments.map(i => `${i.type} - ${i.value}`).join(', ')
      },
      declineOrder(order) {
        this.$emit('declineOrder', order)
      },
      acceptOrder(order) {
        this.$emit('acceptPendingOrder', order)
      },
      setPendingOrder(order) {
        this.$emit('setPendingOrder', order)
      },
      completeOrder(order) {
        this.$emit('completeOrder', order)
      },
      onClickAccept(order) {
        if (order.declineStep2) this.$set(order, 'declineStep2', false)
        if (!order.confirmStep2) return this.$set(order, 'confirmStep2', true)
        if (!order.prepareTime) return
        this.acceptOrder(order)
      },
      onClickDecline(order) {
        if (order.confirmStep2) return this.$set(order, 'confirmStep2', false)
        if (!order.declineStep2) return this.$set(order, 'declineStep2', true)
        this.declineOrder(order)
      },
      openDialog(order) {
        this.$refs.dialog.showDialog(order)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$emit('updateOnlineOrders')
      })
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateOnlineOrders')
      })
    }

  }
</script>

<style scoped lang="scss">
  .main {
    background-image: url('/plugins/pos-plugin/assets/out.png');
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 16px;

    .g-card {
      border-radius: 4px;
      border: solid #9e9e9e 0.05em;
      margin-bottom: 6px;
      font-size: 14px;

      .g-btn-bs {
        border-radius: 2px;
      }

      .g-card-title {
        padding-bottom: 8px;
      }

      .g-card-text {
        padding: 0 16px 16px;
      }

      .g-card-actions {
        padding: 0 8px 16px;

        .g-btn-bs {
          text-transform: capitalize;
        }

        .bs-tf-wrapper {
          width: 120px;
        }
      }
    }
  }

  .header {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .content {
    height: calc(100% - 34px);
    overflow: hidden scroll;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .pending-orders {
    width: 40%;
    height: 100%;
    overflow: hidden;

    &--empty {
      height: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
      border: 0.5px solid #9E9E9E;
      border-radius: 4px;

      p {
        font-size: 12px;
        color: #9E9E9E;
        margin-top: 8px;
      }
    }
  }

  .kitchen-orders {
    width: 60%;

    &--empty {
      height: 30%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 0.5px solid #9E9E9E;
      border-radius: 4px;

      p {
        font-size: 12px;
        color: #9E9E9E;
        margin-top: 8px;
      }
    }

    &__timer {
      background: #EFEFEF;
      border: 1px solid #C4C4C4;
      border-radius: 2px;
      padding: 0 4px;
    }
  }

  .btn-clicked {
    background: #FFFFFF;
    border: 1px solid #536DFE !important;
    border-radius: 2px;
    color: #536DFE !important;
  }

  .options {
    background: #FFFFFF;
    border: 1px solid #D3D3D3;
    border-radius: 2px;

    .option {
      background-color: #FFF;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      text-align: left;
      user-select: none;
      cursor: pointer;
      color: #201F2B;

      &:hover {
        background-color: #EFEFEF;
      }
    }
  }
</style>
