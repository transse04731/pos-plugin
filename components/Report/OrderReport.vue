<template>
  <div class="main-container">
    <div class="header-container">
      <div class="card">
        <div class="store-name text-center">
          <span>{{companyName}}</span>
        </div>

        <div class="store-details text-center">
          <p>{{companyAddress}}</p>
          <p>Tel: {{companyTel}}</p>
          <p>VAT Reg No: {{companyVatNumber}}</p>
        </div>
      </div>
    </div>

    <div class="body-container">
      <div class="col col-12 text-center">
        <span class="invoice-title">Invoice</span>
      </div>

      <div class="col col-12 invoice-id">
        <p>Date: {{orderDate}}</p>
        <p>Time: {{orderTime}}</p>
        <p>Invoice No: {{orderNumber}}</p>
      </div>

      <div class="col col-12 invoice-products">
        <table>
          <thead>
          <tr>
            <th width="40%">Item</th>
            <th width="10%">Q.ty</th>
            <th width="20%">Unit price</th>
            <th width="20%">Total</th>
          </tr>
          <tr class="divider-row">
            <th colspan="4">
              <div class="divider divider-dashed"/>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(item, index) in orderProductList" :key="index">
            <td width="40%">{{item.name}}</td>
            <td width="10%">{{item.quantity}}</td>
            <td width="20%">{{item.price}}</td>
            <td width="20%">{{(item.quantity * item.price).toFixed(2)}}</td>
          </tr>
          <tr class="divider-row">
            <td colspan="4">
              <div class="divider divider-dashed"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="col col-12 checkout-details">
        <div>
          <span>Subtotal</span>
          <span class="float-right">{{(orderSum - orderTax).toFixed(2)}}</span>
        </div>
        <div style="margin: 12px 0;">
          <span>Discount</span>
          <span class="float-right">(0.00)</span>
        </div>
        <div v-for="(taxGroup, index) in orderTaxGroups" :key="index" :style="index !== (orderTaxGroups.length - 1) ? 'margin: 12px 0;' : ''">
          <span v-if="taxGroup.taxType > 0">Tax ({{taxGroup.taxType}}%)</span>
          <span v-if="taxGroup.taxType > 0" class="float-right">{{taxGroup.tax.toFixed(2)}}</span>
        </div>
        <div class="divider divider-dashed"/>
        <div class="total">
          <span>Total</span>
          <span class="float-right">${{orderSum.toFixed(2)}}</span>
        </div>
        <div style="margin: 12px 0;">
          <span>Cash tend</span>
          <span class="float-right">${{orderCashReceived}}</span>
        </div>
        <div class="divider divider-dashed"/>
        <div class="due" style="margin: 12px 0;">
          <span>Change due</span>
          <span class="float-right">${{orderCashback.toFixed(2)}}</span>
        </div>
      </div>

      <div class="col col-12 checkout-details payment-method">
        <span>Payment method: {{orderPaymentType}}</span>
      </div>
    </div>

    <div class="justify-content-center footer-container">
      <div class="full-width text-center">
        <barcode :value="orderBookingNumber" :width="3.5" :height="80" font="Verdana"
                 :font-size="23" :text-margin="8" :text="`Invoice ID: ${orderBookingNumber}`"/>
      </div>
      <div class="text-center thankyou-message full-width">
        <span>Thank you for choosing {{companyName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Barcode from './barcode';

  export default {
    name: "OrderReport.vue",
    components: {
      Barcode
    },
    props: {
      companyName: String,
      companyAddress: String,
      companyTel: String,
      companyVatNumber: String || Number,
      orderDate: String,
      orderTime: String,
      orderNumber: Number,
      orderProductList: Array,
      orderSum: Number,
      orderTax: Number,
      orderTaxGroups: Array,
      orderCashReceived: Number,
      orderCashback: Number,
      orderPaymentType: String,
      orderBookingNumber: String,
    }
  }
</script>

<style scoped lang="scss">
  * {
    font-family: Verdana, sans-serif;
    color: #000000 !important;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: #ffffff;
  }

  p {
    margin: 0;
  }

  .full-width {
    width: 100%;
  }

  .float-left {
    float: left;
  }

  .float-right {
    float: right;
  }

  .col {
    padding: 12px;

    &-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  .card {
    width: 100%;

    div {
      width: 100%;
    }
  }

  .spacer {
    flex-grow: 1;
    visibility: hidden;
  }

  .jusify-content-center {
    justify-content: center;
  }

  .m {
    &t-4 {
      margin-top: 1.5rem;
    }

    &y-4 {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  .text-center {
    text-align: center;
  }

  .divider {
    border-width: 1px;
    margin: 12px 0;
    align-self: center;
    width: 100%;

    &-dashed {
      border-style: dashed;
    }
  }

  .main-container {
    width: 100%;
    padding: 0;
  }

  .header-container {
    .store-name {
      font-weight: bold;
      font-size: 30px;
      line-height: 36px;
      margin-bottom: 10px;
    }

    .store-details {
      font-weight: normal;
      font-size: 20px;
      line-height: 24px;
      margin-bottom: 12px;
    }
  }

  .body-container {
    .invoice-title {
      font-weight: bold;
      font-size: 40px;
      line-height: 49px;
    }

    .invoice-id {
      font-weight: normal;
      font-size: 25px;
      line-height: 30px;

      p:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    .invoice-products {
      padding: 12px 0 0;

      table {
        text-align: left;
        width: 100%;
        border: none;
        border-spacing: 0;

        thead, tbody, tr {
          width: 100%;
        }

        .divider-row {
          td, th {
            height: auto;
          }
        }

        thead {
          th {
            font-weight: bold;
            font-size: 24px;
            line-height: 29px;
            text-align: left;
            padding: 0 12px;
          }
        }

        tbody {
          td {
            word-break: break-all;
            font-weight: normal;
            font-size: 20px;
            line-height: 24px;
            height: 32px;
            padding: 0 12px;
          }
        }
      }
    }

    .checkout-details {
      padding-top: 0;

      div {
        &:not(.total):not(.due) {
          span {
            font-weight: normal;
            font-size: 24px;
            line-height: 29px;
          }
        }
      }

      .total, .due {
        font-weight: bold;
        font-size: 30px;
        line-height: 36px;
      }
    }

    .payment-method {
      font-weight: normal;
      font-size: 25px;
      line-height: 30px;
      padding-bottom: 0;
    }
  }

  .footer-container {
    margin-top: 30px;
    margin-bottom: 10px;

    .thankyou-message {
      font-weight: bold;
      font-size: 25px;
      line-height: 30px;
      margin-top: 20px;
    }
  }
</style>
