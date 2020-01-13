<template>
  <div class="staff-report-wrapper">
    <div class="report-content">
      <div class="detail-header">Staff Name: {{name}}</div>
      <div class="detail-header">Report Date: {{reportDate}}</div>
      <div class="detail-time">First Order: {{computedFirstOrderTime}}</div>
      <div class="detail-time">Last Order: {{computedLastOrderTime}}</div>
      <div class="sales-details-header">Sales</div>
      <p>
        <span class="sales-entry sales-type">Total</span>
        <span class="sales-entry sales-amount">{{computedTotal | formatNumber}}</span>
      </p>
      <p>
        <span class="sales-entry sales-type">Sub-total</span>
        <span class="sales-entry sales-amount">{{computedSubTotal | formatNumber}}</span>
      </p>
      <p>
        <span class="sales-entry sales-type">Tax</span>
        <span class="sales-entry sales-amount">{{computedTax | formatNumber}}</span>
      </p>
      <div class="tax-detail">
        <div v-for="(entry, key, index) in computedTaxByCategory">
          <p><span class="sales-entry">Tax {{key}}%:</span></p>
          <p><span class="sales-entry sales-type">Total</span><span class="sales-entry sales-amount">{{entry.total | formatNumber}}</span></p>
          <p><span class="sales-entry sales-type">Sub-total</span> <span class="sales-entry sales-amount">{{(entry.total - entry.tax) | formatNumber}}</span></p>
          <p><span class="sales-entry sales-type">Tax</span> <span class="sales-entry sales-amount">{{entry.tax | formatNumber}}</span></p>
          <br/>
        </div>

        <p><span class="sales-entry sales-type">Vouchers Sold</span> <span class="sales-entry sales-amount">0.00</span></p>
        <p><span class="sales-entry sales-type">Vouchers Used</span> <span class="sales-entry sales-amount">0.00</span></p>
        <p><span class="sales-entry sales-type">Discount</span> <span class="sales-entry sales-amount">{{computedDiscount | formatNumber}}</span></p>
      </div>
      <div class="sales-details">
        <p :key="index" v-for="(sale, key, index) in computedSalesByPayment">
          <span class="sales-entry sales-type">{{key}} Sales: </span><span class="sales-entry sales-amount">{{sale | formatNumber}}</span>
        </p>
        <p><span  class="sales-entry sales-type">Returned Total: </span> <span class="sales-entry sales-amount">{{computedCashBack | formatNumber}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StaffReport',
    props: {
      name: String,
      reportDate: String,
      computedFirstOrderTime: String,
      computedLastOrderTime: String,
      computedTotal: Number,
      computedTax: Number,
      computedSubTotal: Number,
      computedDiscount: Number,
      computedSalesByPayment: null,
      computedCashBack: Number,
      computedTaxByCategory: null
    },
    filters: {
      formatNumber: (val) => {
        if (isNaN(val)) {
          return '0.00'
        }
        return val.toFixed(2)
      },
    }
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
