<template>
  <div class="staff-report-wrapper">
    <div class="report-content">
      <div class="detail-header" v-if="orderSalesByStaff">Staff Name: {{orderSalesByStaff.name}}</div>
      <div v-if="orderSalesByStaff && orderSalesByStaff.user[orderSalesByStaff.name]">
        <div class="detail-header">Report Date: {{orderSalesByStaff.from | formatDate }}</div>
        <div class="detail-time">First Order: {{ (orderSalesByStaff.user[orderSalesByStaff.name].from) | formatTime}}</div>
        <div class="detail-time">Last Order: {{ (orderSalesByStaff.user[orderSalesByStaff.name].to) | formatTime}}</div>
      </div>

      <div class="sales-details-header">Sales</div>
      <div v-if="orderSalesByStaff && orderSalesByStaff.user[orderSalesByStaff.name]">
        <p><span class="sales-entry sales-type">Total</span> <span class="sales-entry sales-amount">{{(orderSalesByStaff.user[orderSalesByStaff.name].vSum)
          | formatNumber}}</span></p>
        <p><span class="sales-entry sales-type">Sub-total</span> <span class="sales-entry sales-amount">{{(orderSalesByStaff.user[orderSalesByStaff.name].net)
          | formatNumber}}</span></p>
        <p><span class="sales-entry sales-type">Tax</span> <span class="sales-entry sales-amount">{{(orderSalesByStaff.user[orderSalesByStaff.name].tax)
          | formatNumber}}</span></p>
      </div>

      <div class="tax-detail">
        <div v-if="orderSalesByStaff && orderSalesByStaff['groupByTax']">
          <div v-for="(entry, key, index) in orderSalesByStaff['groupByTax']">
            <p class="sales-entry sales-type">Tax {{key}}%:</p>
            <p><span class="sales-entry sales-type">Total</span> <span class="sales-entry sales-amount">{{entry.gross | formatNumber}}</span></p>
            <p><span class="sales-entry sales-type">Sub-total</span> <span class="sales-entry sales-amount">{{entry.net | formatNumber}}</span></p>
            <p><span class="sales-entry sales-type">Tax</span> <span class="sales-entry sales-amount">{{entry.salesTax | formatNumber}}</span></p>
            <br/>
          </div>
        </div>

        <div v-if="orderSalesByStaff && orderSalesByStaff.user[orderSalesByStaff.name]">
          <p><span class="sales-entry sales-type">Vouchers Sold</span> <span class="sales-entry sales-amount">0.00</span></p>
          <p><span class="sales-entry sales-type">Vouchers Used</span> <span class="sales-entry sales-amount">0.00</span></p>
          <p><span class="sales-entry sales-type">Discount</span> <span class="sales-entry sales-amount">{{orderSalesByStaff.user[orderSalesByStaff.name].discount
            | formatNumber}}</span></p>
        </div>
      </div>
      <div class="sales-details" v-if="orderSalesByStaff && orderSalesByStaff['groupByPayment']">
        <p :key="index" v-for="(sale, key, index) in orderSalesByStaff['groupByPayment']">
          <span class="sales-entry sales-type">{{key}} Sales: </span><span class="sales-entry">{{sale | formatNumber}}</span>
        </p>
        <p><span class="sales-entry sales-type">Returned Total: </span> <span class="sales-entry">{{0 | formatNumber}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StaffReport',
    props: {
      orderSalesByStaff: null
    },
    filters: {
      formatNumber: (val) => {
        return isNaN(val) ? '0.00' : val.toFixed(2)
      },
      formatTime: (val) => {
        return val ? dayjs(val).format('DD/MM HH:mm') : ''
      },
      formatDate: (val) => {
        return val ? dayjs(val).format('DD/MM/YYYY') : ''
      }
    },
  }
</script>

<style lang="scss" scoped>
  .staff-report-wrapper {
    background: white;
    width: 100%;
    font-family: Verdana;
    font-style: normal;
    box-sizing: border-box;
    height: 100%;

    p {
      height: 25px;
    }

    .ml-2 {
      margin-right: 8px !important;
    }

    .report-content {
      padding: 0 0 0 12px;
      color: black;
      height: 100%;

      .detail-header {
        font-weight: bold;
        font-size: 30px;
        line-height: 40px;
      }

      .detail-time {
        font-size: 25px;
        line-height: 35px;
      }

      .sales-details-header {
        margin-top: 10px;
        font-weight: bold;
        font-size: 30px;
        line-height: 45px;
        border-top: 1px dashed #000000;
      }

      .sales-details {
        border-top: 1px dashed #000000;
      }

      .tax-detail {
        border-top: 1px dashed #000000;
      }

      .sales-entry {
        font-size: 25px;
        padding: 1px;
        line-height: 15px;
      }

      .sales-type {
        text-transform: capitalize;
      }

      .sales-amount {
        float: right;
      }
    }
  }
</style>
