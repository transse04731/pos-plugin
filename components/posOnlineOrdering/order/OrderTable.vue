<template>
  <div>
    <div class="po-order-table">
      <div v-if="store.orderHeaderImageSrc" class="po-order-table__header">
        <!-- header image -->
        <img :src="store.orderHeaderImageSrc" class="po-order-table__header__image"/>
      </div>
      <div class="po-order-table__main">
        <!-- header text -->
        <div class="po-order-table__header__text">
          <g-icon class="po-order-table__header__icon--mobile" @click="changeView">arrow_back</g-icon>
          <g-icon class="po-order-table__header__icon" v-if="confirmView" color="#424242" @click="view = 'order'" size="20">arrow_back_ios</g-icon>
          <div class="po-order-table__header__text--main">{{ confirmView ? 'Confirm Order' : 'Order List' }}</div>
          <div class="po-order-table__header__total" v-if="orderView">Total items: {{ totalItems }}</div>
        </div>
      
        <!-- content -->
        <div class="po-order-table__content">
          <!-- 0 items -->
          <div v-if="orderView && noMenuItem" style="margin-top: 100px; display: flex; justify-content: center; flex-direction: column">
            <img src="/plugins/pos-plugin/assets/empty-order.svg">
            <div style="margin-top: 10px; font-size: 15px; text-align: center; color: #757575;">
              You haven't ordered any food yet. Click "<span stype="color: #2979FF; font-weight: bold;">List Food</span>" to get started.
            </div>
          </div>
        
          <!-- > 0 items -->
          <div v-if="orderView && hasMenuItem"
               v-for="(item, index) in orderItems" :key="index"
               class="po-order-table__item">
            <div>
              <div class="po-order-table__item__name">{{ item.name }}</div>
              <div class="po-order-table__item__note">
                <g-icon size="16">icon-note</g-icon>
                {{ item.note || 'Note ...' }}
              </div>
            </div>
          
            <g-spacer/>
          
            <div class="po-order-table__item__price">{{ item.price | currency }}</div>
          
            <div class="po-order-table__item__action">
              <g-icon @click.stop="removeItem(item)" color="#424242" size="28">remove_circle_outline</g-icon>
              <span>{{item.quantity}}</span>
              <g-icon @click.stop="addItem(item)" color="#424242" size="28">add_circle</g-icon>
            </div>
          </div>
        
          <!-- Confirm -->
          <template v-if="confirmView">
            <div class="section-header">CONTACT INFORMATION</div>
            <g-radio-group v-model="orderType" row class="radio-option">
              <g-radio color="#1271ff" label="Pick-up" value="pick-up" :disabled="!store.pickup"/>
              <g-radio color="#1271ff" label="Delivery" value="delivery" :disabled="!store.delivery"/>
            </g-radio-group>
            <div class="section-form">
              <g-text-field v-model="customer.name" label="Name" clearable clear-icon="icon-cancel@16" prepend-icon="icon-person@16"/>
              <g-text-field v-model="customer.phone" label="Phone" clearable clear-icon="icon-cancel@16" prepend-icon="icon-phone2@16"/>
              <template v-if="orderType === 'delivery'">
                <g-text-field v-model="customer.address" label="Address" clearable clear-icon="icon-cancel@16" prepend-icon="icon-place@16"/>
                <g-text-field v-model="customer.zipCode" label="Zip code" clearable clear-icon="icon-cancel@16" prepend-icon="icon-zip-code@16"/>
                <g-text-field type="time" label="Delivery time" clearable clear-icon="icon-cancel@16" prepend-icon="icon-delivery-truck@16"/>
              </template>
              <g-textarea v-model="customer.note" placeholder="Note..." rows="3" no-resize/>
            </div>
          
<!--            <div class="section-header">PAYMENT</div>-->
<!--            <g-radio-group v-model="paymentType" row class="radio-option">-->
<!--              <g-radio color="#1271ff" label="Cash" value="cash" class="mr-5"/>-->
<!--              <g-radio color="#1271ff" label="Credit" value="credit"/>-->
<!--            </g-radio-group>-->
          
            <div class="section-header">ORDER DETAILS</div>
            <div v-for="(item, index) in orderItems" :key="index" class="order-item-detail">
              <div class="order-item-detail__index" >{{ item.quantity || 1}}</div>
              <div class="order-item-detail__name">{{ item.name }}</div>
              <g-spacer/>
              <div>{{ item.price * (item.quantity || 1) | currency }}</div>
            </div>
            <div class="order-item-summary">
              <span>Total <b>{{ totalItems }}</b> items</span>
              <g-spacer/>
              <span>{{ totalPrice | currency }}</span>
            </div>
            <div class="order-item-summary order-item-summary--end" >
              <span>Shipping fee:</span>
              <g-spacer/>
              <span>{{ shippingFee | currency }}</span>
            </div>
          </template>
        </div>
      </div>
      <!-- footer -->
      <div class="po-order-table__footer">
        <div>Total: <span style="font-weight: 700; font-size: 18px; margin-left: 4px">{{ (totalPrice + shippingFee) | currency }}</span></div>
        <g-spacer/>
        <g-btn-bs v-if="orderView" large rounded background-color="#2979FF" @click="view = 'confirm'" :disabled="orderItems.length === 0">PAYMENT</g-btn-bs>
        <g-btn-bs v-if="confirmView" large rounded background-color="#2979FF" @click="confirmPayment" elevation="5">CONFIRM</g-btn-bs>
      </div>
      <div class="po-order-table__footer--mobile" v-if="orderItems.length > 0">
        <g-badge :value="true" color="#4CAF50" overlay>
          <template v-slot:badge>
            {{orderItems.length}}
          </template>
          <div style="width: 40px; height: 40px; background-color: #ff5252; border-radius: 8px; display: flex; align-items: center; justify-content: center">
            <g-icon>icon-menu2</g-icon>
          </div>
        </g-badge>
        <div class="po-order-table__footer--mobile--total">{{(totalPrice + shippingFee) | currency}}</div>
        <g-spacer/>
        <g-btn-bs v-if="orderView" rounded background-color="#2979FF" @click="view = 'confirm'" style="padding: 8px 16px">PAYMENT</g-btn-bs>
        <g-btn-bs v-if="confirmView" rounded background-color="#2979FF" @click="confirmPayment" style="padding: 8px 16px" elevation="5">CONFIRM</g-btn-bs>
      </div>
    </div>
    
    <!-- Order created -->
    <template v-if="showOrderSuccess">
      <order-created v-if="isMobileView()" class="order-created--mobile" @close="closeOrderSuccess" @subscribe="subscribe"/>
      <g-dialog  v-else v-model="showOrderSuccess" class="dlg-order-created">
        <order-created class="order-created" @close="closeOrderSuccess" @subscribe="subscribe"/>
      </g-dialog>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash'
  import OrderCreated from './OrderCreated';

  export default {
    name: 'OrderTable',
    components: { OrderCreated },
    props: {
      store: Object
    },
    data: function () {
      return {
        view: 'order',
        orderType: 'delivery', // delivery || pick-up
        paymentType: 'cash', // cash || credit
        customer: {
          name: '',
          phone: '',
          address: '',
          zipCode: '',
          deliveryTime: new Date(),
          note: ''
        },
        showOrderSuccess: false,
        currency: $t('common.currency')
      }
    },
    injectService: ['PosOnlineOrderStore:(orderItems,decreaseOrRemoveItems,increaseOrAddNewItems,clearOrder)'],
    filters: {
      currency(value) {
        return $t('common.currency') + value.toFixed(2)
      }
    },
    computed: {
      confirmView() { return !this.orderView },
      orderView() { return this.view === 'order' },
      noMenuItem() { return !this.hasMenuItem },
      hasMenuItem() { return this.orderItems.length > 0 },
      totalItems() { return this.orderItems.length },
      totalPrice() {
        return _.sumBy(this.orderItems, item => item.price * item.quantity)
      },
      shippingFee() {
        if (this.orderBy === 'pick-up')
          return 0
        
        // empty order list
        if (!this.orderItems.length)
          return 0
        
        // calculate zip code from store setting
        for(let deliveryFee of this.store.deliveryFee.fees) {
         if (_.lowerCase(_.trim(deliveryFee.zipCode)) === _.lowerCase(_.trim(this.customer.zipCode)))
           return deliveryFee.fee
        }
        
        // other zip code will get default fee if store accept order from another zip code
        if (this.store.delivery.acceptOrderInOtherZipCodes)
          return this.store.delivery.defaultFee
        
        return 0
      }
    },
    methods: {
      changeView() {
        if(this.view === 'order') {
          this.$emit('back')
        }
        this.view = 'order'
      },
      removeItem(item) {
        this.decreaseOrRemoveItems(item)
      },
      addItem(item) {
        this.increaseOrAddNewItems(item)
      },
      confirmPayment() {
        const {socket} = window.cms

        const {note, deliveryTime, ...customer} = this.customer;

        const products = _.map(this.orderItems, orderItem => {
          return {
            ..._.omit(orderItem, ['_id', 'desc', 'image', 'category', 'groupPrinters']),
            groupPrinter: orderItem.groupPrinters[0],
            groupPrinter2: this.store.useMultiplePrinters && orderItem.groupPrinters.length >= 2 && orderItem.groupPrinters[1],
            category: orderItem.category.name,
          }
        })
        
        const orderData = {
          orderType: this.orderType,
          paymentType: this.paymentType,
          customer,
          products,
          deliveryTime,
          note,
          createdDate: new Date(),
          shippingFee: this.shippingFee,
          totalPrice: this.totalPrice,
          takeOut: true,
        }

        socket.emit('createOrder', this.store._id, orderData)
        
        this.clearOrder()
        
        this.showOrderSuccess = true
      },
      closeOrderSuccess() {
        this.showOrderSuccess = false
      },
      async subscribe(email) {
        const response = (await axios.post('/store/subscribe', { email, storeId: this.store._id })).data
        alert(response.message)
        this.closeOrderSuccess()
      },
      isMobileView() {
        return window.screen.width < 600
      },
    }
  }
</script>
<style scoped lang="scss">
  .po-order-table {
    position: relative;
    width: 430px;
    height: 100vh;
    background-color: #F8F8F8;
    display: flex;
    flex-direction: column;

    &__main {
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    &__header {
      &__image {
        width: 430px;
        height: 205px;
        margin-bottom: 20px;
      }

      &__text {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        font-size: 18px;
        font-weight: 700;

        &--main {
          display: flex;
          flex: 1;
        }
      }

      &__icon--mobile {
        display: none;
      }

      &__total {
        font-size: 15px;
        font-weight: 400;
      }
    }

    &__content {
      flex: 1;
      margin-bottom: 100px;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: none; // firefox

      &::-webkit-scrollbar {
        display: none;
      }

      .radio-option {
        padding-top: 20px;
        text-align: center;
      }

      .section-header {
        padding-top: 20px;
        font-weight: 700;
      }

      .section-form {
        .g-textarea  {
          border: 1px solid #EFEFEF;
          border-radius: 4px;
          background-color: #fff;
          padding: 8px;

          ::v-deep .g-tf {
            &:before, &:after {
              display: none;
            }
          }

          ::v-deep .g-tf-append__inner {
            display: none;
          }

          textarea {
            user-select: text !important;
          }
        }

        .g-textarea ::v-deep textarea,
        .g-tf-wrapper ::v-deep input {
          user-select: text !important;
        }
      }

      .order-item-detail {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #D8D8D8;
        padding-top: 5px;
        padding-bottom: 5px;

        &__index {
          width: 20px;
          height: 20px;
          line-height: 20px;
          font-style: normal;
          font-weight: bold;
          font-size: 13px;
          margin-right: 10px;
          background-color: #424242;
          box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1398);
          color: #FFF;
          text-align: center;
          border-radius: 50%;
        }

        &__name {
          font-style: normal;
          font-weight: bold;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .order-item-summary {
        @extend .order-item-detail;
        border-bottom: 1px solid transparent;

        &--end {
          margin-bottom: 100px;
        }
      }
    }

    &__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 74px;
      border-bottom: 1px dashed #d8d8d8;

      &__name {
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
      }

      &__price {
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
        margin-right: 8px;
      }

      &__note {
        font-size: 12px;
        color: #9E9E9E;
        margin-top: 8px;
      }

      &__action {
        flex: 0 0 20%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        & > span {
          min-width: 20px;
          text-align: center;
        }
      }
    }

    &__footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 100px;
      border-radius: 0 25px 0 0;
      display: flex;
      align-items: center;
      background-color: #E9E9E9;
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;

      .g-btn-bs {
        padding: 8px 40px;
      }

      &--mobile {
        display: none;
      }
    }


  }
  .order-created {
    width: 464px;
    height: 363px;
    padding: 30px;
    border-radius: 5px;
    margin: 0 auto;
  
    &--mobile {
      display: none;
    }
  }
  
  @media screen and (max-width: 1040px) {
    .po-order-table {
      background: #F2F2F2;

      &__main {
        padding: 0;
        height: 100%;
      }

      &__header {
        display: none;

        &__text {
          padding: 16px;
          font-size: 16px;
          background-color: white;
          box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.2);

          &--main {
            justify-content: center;
          }
        }

        &__icon {
          display: none;

          &--mobile {
            display: inline-flex;
            color: #000;
          }
        }

        &__total {
          display: none;
        }
      }

      &__content {
        margin-top: 16px;
        margin-bottom: 0;
        background-color: white;
        padding: 0 16px;
        height: calc(100% - 50px);

        &::-webkit-scrollbar {
          display: none;
        }
      }

      &__footer {
        display: none;

        &--mobile {
          display: flex;
          position: fixed;
          bottom: 0;
          width: 100%;
          border-top-right-radius: 32px;
          background-color: white;
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
          padding: 16px 24px;
          z-index: 20;

          &--total {
            font-size: 18px;
            font-weight: 700;
            align-self: center;
            margin-left: 16px;
          }
        }
      }
    }
  
    .dlg-order-created {
      display: none;
    }
    .order-created {
      display: none;
    
      &--mobile {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
      }
    }
    ::v-deep {
      .cpn-order-created {
        &__body {
          padding-left: 40px;
          padding-right: 40px;
        }
      
        &__actions {
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
          padding: 20px;
          border-radius: 0 25px 0 0;
        }
      }
    }
  }
</style>
