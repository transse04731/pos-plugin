<template>
  <div class="po-order-table">
    <div class="po-order-table__header">
      <!-- header image -->
      <img src="/plugins/pos-plugin/assets/samples/image%205.png" class="po-order-table__header__image"/>
    </div>
  
    <div style="margin-left: 20px; margin-right: 20px">
      <!-- header text -->
      <div class="po-order-table__header__text">
        <g-icon v-if="confirmView" color="#424242" @click="view = 'order'">arrow_back_ios</g-icon>
        <div style="font-weight: bold; font-size: 25px;">{{ confirmView ? 'Confirm Order' : 'Order List' }}</div>
        <g-spacer/>
        <div v-if="orderView">Total items: {{ totalItems }}</div>
      </div>
  
      <!-- separator line -->
      <div style="width: 100%; height: 1px; border-top: 1px solid #D8D8D8"></div>
  
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
            <div>{{ item.note || '...' }}</div>
          </div>
  
          <g-spacer/>
          
          <div class="po-order-table__item__price">{{ item.price | currency }}</div>
  
          <div class="item-action">
            <g-icon @click.stop="removeItem(item)" style="margin-right: 3px;">remove_circle_outline</g-icon>
            <span style="margin-right: 3px;">{{item.quantity || 1}}</span>
            <g-icon @click.stop="addItem(item)">add_circle_outline</g-icon>
          </div>
        </div>
    
        <!-- Confirm -->
        <div v-if="confirmView">
          <div class="section-header">CONTACT INFORMATION</div>
          <g-radio-group v-model="orderType" row class="radio-option">
            <g-radio label="Pick-up" value="pick-up" disabled/>
            <g-radio label="Delivery" value="delivery"/>
          </g-radio-group>
          <div>
            <g-text-field v-model="customer.name" label="Name" prepend-icon="person_outline"/>
            <g-text-field v-model="customer.phone" label="Phone" prepend-icon="fas fa-phone-alt"/>
            <g-text-field v-model="customer.address" label="Address" prepend-icon="fas fa-map-marker-alt"/>
            <g-text-field v-model="customer.zipCode" label="Zip code" prepend-icon="mdi-qrcode-edit"/>
            <g-text-field type="datetime-local" label="datetime-local" prepend-icon="mdi-car-estate"/>
            <g-textarea v-model="customer.note" label="Note..." row="3" outlined background-color="#FFF"/>
          </div>
      
          <div class="section-header">PAYMENT</div>
          <g-radio-group v-model="paymentType" row class="radio-option">
            <g-radio label="Cash" value="cash"/>
            <g-radio label="Credit" value="credit" disabled/>
          </g-radio-group>
      
          <div class="section-header">ORDER DETAILS</div>
          <div v-for="(item, index) in orderItems" :key="index" class="order-item-detail">
            <div class="order-item-detail__index" >{{ index + 1 }}</div>
            <div class="order-item-detail__name">{{ item.name }}</div>
            <g-spacer/>
            <div>{{ item.price * (item.quantity || 1) | currency }}</div>
          </div>
          <div class="order-item-summary">
            <span>Total {{ totalItems }} items</span>
            <g-spacer/>
            <span>{{ totalPrice | currency }}</span>
          </div>
          <div class="order-item-summary order-item-summary--end" >
            <span>Shipping fee:</span>
            <g-spacer/>
            <span>$1</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- footer -->
    <div class="po-order-table__footer">
      <div>Total: <span>{{ totalPrice | currency }}</span></div>
      <g-spacer/>
      <g-btn v-if="orderView" rounded background-color="#2979FF" text-color="#FFF" @click="view = 'confirm'">Payment</g-btn>
      <g-btn v-if="confirmView" rounded background-color="#2979FF" text-color="#FFF" @click="confirmPayment" :elevation="5">Confirm</g-btn>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'PosOrderTable',
    props: {
      orderItems: Array,
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
        }
      }
    },
    filters: {
      currency(value) {
        return '$' + value
      }
    },
    computed: {
      confirmView() { return !this.orderView },
      orderView() { return this.view === 'order' },
      noMenuItem() { return !this.hasMenuItem },
      hasMenuItem() { return this.orderItems.length > 0 },
      totalItems() { return this.orderItems.length },
      totalPrice() {
        // TODO
        return _.sumBy(this.orderItems, item => item.price * (item.quantity || 1))
      },
    },
    methods: {
      removeItem(item) {
      
      },
      addItem(item) {
      
      },
      confirmPayment() {
      
      }
    }
  }
</script>
<style scoped lang="scss">
  .po-order-table {
    position: relative;
    width: 430px;
    background-color: #F8F8F8;
    
    &__header {
      &__image {
        width: 430px;
        height: 205px;
        margin-bottom: 20px;
      }
      
      &__text {
        display: flex;
        align-items: center;
      }
    }
    
    &__content {
      flex: 1;
      margin-bottom: 100px;
      max-height: calc(100vh - 225px - 37px - 100px);
      overflow-x: hidden;
      overflow-y: scroll;
      
      .radio-option {
        padding-top: 20px;
        text-align: center;
      }
      
      .section-header {
        padding-top: 20px;
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
      border-bottom: 1px dashed #424242;
      
      &__name {
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
      }
      
      &__price {
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
        margin-right: 5px;
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
    }
  }
</style>
