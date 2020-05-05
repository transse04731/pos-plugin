<template>
  <div>
    <div class="po-order-table">
      <div  class="po-order-table__header">
        <!-- header image -->
        <img :src="`${store.orderHeaderImageSrc}?w=340&h=164` || '/plugins/pos-plugin/assets/images/header.png'" class="po-order-table__header__image"/>
      </div>
      <div class="po-order-table__main">
        <!-- header text -->
        <div class="po-order-table__header__text">
          <g-icon class="po-order-table__header__icon--mobile" @click="changeView">arrow_back</g-icon>
          <g-icon class="po-order-table__header__icon" v-if="confirmView" color="#424242" @click="view = 'order'" size="20">arrow_back_ios</g-icon>
          <div class="po-order-table__header__text--main">{{ confirmView ? $t('store.confirmOrder') : $t('store.orderList') }}</div>
          <div class="po-order-table__header__total" v-if="orderView">{{$t('store.totalItems')}}: {{ totalItems }}</div>
        </div>

        <!-- content -->
        <div id="table-content" class="po-order-table__content">
          <template v-if="!isOpening">
            <div class="message-closed">
              <div class="message-closed__title">Merchant is temporarily closed</div>
              <div class="message-closed__message">{{ merchantMessage }}</div>
            </div>
          </template>
          <template v-else>
            <!-- 0 items -->
            <div v-if="orderView && noMenuItem" style="margin-top: 100px; display: flex; justify-content: center; flex-direction: column">
              <img src="/plugins/pos-plugin/assets/empty_order2.svg">
              <div style="margin-top: 10px; font-size: 15px; text-align: center; color: #616161;">
                Your order list is currently empty.
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
                  {{ item.note || `${$t('store.note')}...` }}
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
              <div class="section-header">{{$t('store.contactInfo')}}</div>
              <g-radio-group v-model="orderType" row class="radio-option">
                <g-radio small color="#1271ff" :label="$t('store.pickup')" value="pickup" :disabled="!store.pickup"/>
                <g-radio small color="#1271ff" :label="$t('store.delivery')" value="delivery" :disabled="!store.delivery"/>
              </g-radio-group>
              <div class="section-form">
                <g-text-field v-model="customer.name" :label="$t('store.name')" required clearable clear-icon="icon-cancel@16" prepend-icon="icon-person@16"/>
                <g-text-field type="number" v-model="customer.phone" :label="$t('store.telephone')" required clearable clear-icon="icon-cancel@16" prepend-icon="icon-phone2@16"/>
                <template v-if="orderType === 'delivery'">
                  <g-text-field v-model="customer.address" :label="$t('store.address')" required clearable clear-icon="icon-cancel@16" prepend-icon="icon-place@16"/>
                  <g-text-field :rules="validateZipcode" type="number" v-model="customer.zipCode" :label="$t('store.zipCode')" required clearable clear-icon="icon-cancel@16" prepend-icon="icon-zip-code@16"/>
<!--                  <g-time-picker-input v-model="customer.deliveryTime" label="Delivery time" required prepend-icon="icon-delivery-truck@16"/>-->
                </template>
                <div>
                  <div v-if="!coupon.active" @click="coupon.active = true"><u>Apply coupon code</u></div>
                  <g-text-field-bs v-if="coupon.active" :rules="validateCoupon" placeholder="COUPON CODE" suffix="Apply" @click:append-outer="applyCoupon" v-model="coupon.value"/>
                </div>
                <g-textarea v-model="customer.note" :placeholder="`${$t('store.note')}...`" rows="3" no-resize/>
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
                <div>{{ item.price * (item.quantity || 1) | currency }}</div>
              </div>
              <div class="order-item-summary">
                <span>{{$t('store.total')}}: <b>{{ totalItems }}</b> {{$t('store.items')}}</span>
                <g-spacer/>
                <span>{{ totalPrice | currency }}</span>
              </div>
              <div class="order-item-summary order-item-summary--end" >
                <span>{{$t('store.shippingFee')}}:</span>
                <g-spacer/>
                <span>{{ shippingFee | currency }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>
      <!-- footer -->
      <div :class="['po-order-table__footer', !isOpening && 'disabled']">
        <div>{{$t('store.total')}}: <span style="font-weight: 700; font-size: 18px; margin-left: 4px">{{ (totalPrice + shippingFee) | currency }}</span></div>
        <g-spacer/>
        <g-btn-bs v-if="orderView" class="r" width="180" large rounded background-color="#2979FF" @click="view = 'confirm'" :disabled="orderItems.length === 0">
          {{$t('store.payment')}}
          <div class="icon-payment">
            <g-icon size="16" color="white" class="ml-1">fas fa-chevron-right</g-icon>
          </div>
        </g-btn-bs>
        <g-btn-bs v-if="confirmView" width="180" :disabled="unavailableConfirm" large rounded background-color="#2979FF" @click="confirmPayment" elevation="5">{{$t('store.confirm')}}</g-btn-bs>
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
        <g-btn-bs v-if="orderView" rounded background-color="#2979FF" @click="view = 'confirm'" style="padding: 8px 16px">{{$t('store.payment')}}</g-btn-bs>
        <g-btn-bs v-if="confirmView" :disabled="unavailableConfirm" rounded background-color="#2979FF" @click="confirmPayment" style="padding: 8px 16px" elevation="5">
          {{$t('store.confirm')}}
        </g-btn-bs>
      </div>
    </div>

    <!-- Order created -->
    <order-created v-model="dialog.value" :order="dialog.order" @close="closeOrderSuccess" @subscribe="subscribe"/>
  </div>
</template>
<script>
  import _ from 'lodash'
  import OrderCreated from './OrderCreated';
  import {disableBodyScroll, enableBodyScroll} from 'pos-vue-framework'

  export default {
    name: 'OrderTable',
    components: { OrderCreated },
    props: {
      store: Object,
      isOpening: Boolean,
      merchantMessage: String,
    },
    data: function () {
      return {
        view: 'order',
        orderType: this.store.delivery ? 'delivery' : 'pickup', // delivery || pick-up
        paymentType: 'cash', // cash || credit
        customer: {
          name: '',
          phone: '',
          address: '',
          zipCode: '',
          deliveryTime: '',
          note: ''
        },
        currency: $t('common.currency'),
        dialog: {
          value: false,
          order: {}
        },
        coupon: {
          active: false,
          value: ''
        }
      }
    },
    injectService: ['PosOnlineOrderStore:(orderItems,decreaseOrRemoveItems,increaseOrAddNewItems,clearOrder)'],
    filters: {
      currency(value) {
        if (value != null)
          return $t('common.currency') + value.toFixed(2)
        return 0
      }
    },
    mounted() {
      // const content = document.getElementById('table-content')
      // content && disableBodyScroll(content)
    },
    beforeDestroy() {
      // const content = document.getElementById('table-content')
      // content && enableBodyScroll(content)
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
        if (!this.orderItems || this.orderItems.length === 0)
          return 0;
        
        if (this.orderType === 'pickup' || this.orderType === 'pickup' || !this.store.deliveryFee)
          return 0

        // calculate zip code from store setting
        for(let deliveryFee of this.store.deliveryFee.fees) {
         if (_.lowerCase(_.trim(deliveryFee.zipCode)) === _.lowerCase(_.trim(this.customer.zipCode)))
           return deliveryFee.fee
        }

        // other zip code will get default fee if store accept order from another zip code
        if (this.store.deliveryFee && this.store.deliveryFee.acceptOrderInOtherZipCodes)
          return this.store.deliveryFee.defaultFee

        return 0
      },
      unavailableConfirm() {
        const check = !this.customer.name || !this.customer.phone || isNaN(this.customer.phone)
        if (this.orderType === 'delivery') {
          for(const fn of this.validateZipcode) {
            if(typeof fn === 'function' && typeof fn(this.customer.zipCode) === "string")
              return true
          }
          return check || !this.customer.address || !this.customer.zipCode || this.customer.zipCode.length < 5
        }
        return check
      },
      validateZipcode() {
        const rules = []
        if (this.store.deliveryFee && !this.store.deliveryFee.acceptOrderInOtherZipCodes) {
          const zipCodes = this.store.deliveryFee.fees.map(f => f.zipCode)
          rules.push((val) => val.length < 5 || zipCodes.includes(val) || 'Shipping service is not available to your zip code!')
        }
        return rules
      },
      validateCoupon() {
        const rules = []

        return rules
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
        if(this.unavailableConfirm) return

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

        //convert delivery time to date
        // const period = deliveryTime.substr(deliveryTime.length - 2, deliveryTime.length)
        // const time = deliveryTime.slice(0, deliveryTime.length - 2).trim().split(':')
        // const date = dayjs().second(0).minute(+time[1]).hour(+time[0]).add(period.toUpperCase() === 'PM' ? 12 : 0, 'hour')

        const orderData = {
          orderType: this.orderType,
          paymentType: this.paymentType,
          customer,
          products,
          // deliveryTime: date.toDate(),
          note,
          createdDate: new Date(),
          shippingFee: this.shippingFee,
          totalPrice: this.totalPrice,
          takeOut: true,
        }

        if(!this.store.useMultiplePrinters) {
          Object.assign(orderData, {printers: [this.store.printers[0]]})
        }

        socket.emit('createOrder', this.store._id, orderData)

        this.dialog.order = {
          items: this.orderItems,
          shippingFee: this.shippingFee,
          totalPrice: this.totalPrice,
        }

        this.customer = {
          name: '',
          phone: '',
          address: '',
          zipCode: '',
          deliveryTime: '',
          note: ''
        }

        this.dialog.value = true
      },
      closeOrderSuccess() {
        this.clearOrder()
        this.view = 'order'
        this.$emit('back') // for mobile
      },
      async subscribe(email) {
        const response = (await axios.post('/store/subscribe', { email, storeId: this.store._id })).data
        alert(response.message)
        this.closeOrderSuccess()
      },
      applyCoupon() {

      }
    }
  }
</script>
<style scoped lang="scss">
  .po-order-table {
    position: relative;
    width: 340px;
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
        width: 340px;
        height: 164px;
        margin-bottom: 20px;
      }

      &__text {
        display: flex;
        align-items: center;
        padding-bottom: 4px;
        margin-bottom: 4px;
        font-size: 18px;
        font-weight: 700;
        border-bottom: 1px solid #D8D8D8;

        &--main {
          display: flex;
          flex: 1;
          font-size: 25px;
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
      overflow: auto;
      scrollbar-width: none; // firefox

      &::-webkit-scrollbar {
        display: none;
      }

      .radio-option {
        padding-top: 20px;
        text-align: center;

        .g-radio-wrapper {
          margin-right: 40px;
          margin-left: 20px;

          ::v-deep .g-radio-label {
            font-weight: 600;
          }
        }
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

        .bs-tf-wrapper {
          margin: 0;
          width: 100%;

          ::v-deep .bs-tf-input-group,
          ::v-deep .bs-tf-input-text {
            background: white;
          }

          ::v-deep .bs-tf-input-group {
            border-color: #efefef
          }

          ::v-deep .bs-tf-input-text {
            font-weight: 600;
            font-size: 15px;
            color: #000000;
            cursor: pointer;
          }

          ::v-deep .bs-tf-inner-input-group__active {
            box-shadow: none;
            border-color: #efefef !important;
          }
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
          flex: 1;
          min-width: 0;
        }
      }

      .order-item-summary {
        @extend .order-item-detail;
        border-bottom: 1px solid transparent;

        &--end {
          margin-bottom: 100px;
        }
      }

      .message-closed {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 150px;

        &__title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          text-align: center;
        }

        &__message {
          color: #424242;
          font-size: 15px;
          text-align: center;
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
        word-break: break-word;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
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
            font-size: 15px;
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

  .icon-payment {
    position: absolute;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<style lang="scss">
  input {
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      animation: autofill 0s forwards !important;
    }

    @keyframes autofill {
      100% {
        background: transparent;
        color: inherit;
      }
    }

    @-webkit-keyframes autofill {
      100% {
        background: transparent;
        color: inherit;
      }
    }
  }

  .g-btn-bs {
    position: relative;

    &:hover:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.12);
    }
  }
</style>
