<template>
  <div class="z-report-main-container">
    <div class="header-container">
      <div class="card text-center">
        <div class="store-name">
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
        <span class="invoice-title">Z-Report</span>
      </div>

      <div class="col col-12 invoice-id">
        <p>Report Date: {{reportDate}}</p>
        <p>Z-Number: {{z}}</p>
        <p>First Order: {{firstOrderDateString}}</p>
        <p>Last Order: {{lastOrderDateString}}</p>
      </div>

      <div class="divider divider-dashed"/>

      <div class="col col-12 sales">
        <div>
          <span style="font-weight: bolder">Sales</span>
        </div>
        <div style="margin: 12px 0;">
          <span>Total</span>
          <span class="float-right">{{(sumTotal) | convertMoney}}</span>
        </div>
        <div style="margin: 12px 0;">
          <span>Sub-total</span>
          <span class="float-right">{{(subTotal) | convertMoney}}</span>
        </div>
        <div>
          <span>Tax</span>
          <span class="float-right">{{(taxTotal) | convertMoney}}</span>
        </div>
      </div>

      <div class="divider divider-dashed"/>

      <div class="col col-12 tax-and-discount">
        <div v-for="(value, name) in reportGroups" style="margin-bottom: 50px">
          <div>
            <span>Tax {{name}}%</span>
          </div>
          <div style="margin: 12px 0;">
            <span>Total</span>
            <span class="float-right">{{value[`sum${name}`] | convertMoney}}</span>
          </div>
          <div style="margin: 12px 0;">
            <span>Sub-total</span>
            <span class="float-right">{{value[`net${name}`] | convertMoney}}</span>
          </div>
          <div>
            <span>Tax</span>
            <span class="float-right">{{value[`tax${name}`] | convertMoney}}</span>
          </div>
        </div>

        <div>
          <span>Discount</span>
          <span class="float-right">{{discount | convertMoney}}</span>
        </div>
      </div>

      <div class="divider divider-dashed"/>

      <div class="col col-12 sales">
        <div v-for="(value, name) in reportByPayment">
          <span>{{name}}: {{value | convertMoney}}</span>
        </div>
        <!--        <div>-->
        <!--          <span>Returns Total: 100</span>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ZReport.vue",
    filters: {
      convertMoney(value) {
        return !isNaN(value) ? value.toFixed(2) : value
      }
    },
    props: {
      companyName: String,
      companyAddress: String,
      companyTel: String,
      companyVatNumber: String || Number,
      reportDate: String,
      firstOrderDateString: String,
      lastOrderDateString: String,
      subTotal: Number,
      taxTotal: Number,
      sumTotal: Number,
      discount: {
        type: Number,
        default: 0,
      },
      reportByPayment: Object,
      reportGroups: Object,
      z: Number,
    }
  }
</script>

<style lang="scss">
  .z-report-main-container {
    width: 100%;
    padding: 0;
    background-color: #ffffff;
    font-family: Verdana;
    font-style: normal;
    box-sizing: border-box;

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
      padding: 12px 2px 12px 12px;

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

    .header-container {
      .store-name {
        font-weight: bolder;
        font-size: 30px;
        line-height: 36px;
        margin-bottom: 10px;
      }

      .store-details {
        font-weight: normal;
        font-size: 20px;
        line-height: 24px;
        margin: 0 auto 12px;
        max-width: 75%;
      }
    }

    .body-container {
      .invoice-title {
        font-weight: bolder;
        font-size: 40px;
        line-height: 49px;
      }

      .invoice-id {
        font-size: 25px;
        line-height: 30px;

        p:not(:last-child) {
          margin-bottom: 10px;
        }

        P:not(:first-child) {
          font-weight: normal;
        }

        p:first-child {
          font-weight: bolder;
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
              font-weight: bolder;
              font-size: 24px;
              line-height: 29px;
              text-align: left;
            }
          }

          tbody {
            tr:not(:last-child) {
              td {
                padding-bottom: 12px;
              }
            }

            td {
              word-break: break-all;
              font-weight: normal;
              font-size: 24px;
              line-height: 24px;
              padding: 0;
              vertical-align: top;

              &:first-child {
                padding-left: 12px;
              }

              &:last-child {
                padding-right: 2px;
              }
            }
          }
        }
      }

      .sales, .tax-and-discount, .summary {
        text-transform: capitalize;
        padding-top: 0;

        div {
          &:not(.total):not(.due) {
            span {
              font-weight: normal;
              font-size: 24px;
              line-height: 29px;
            }
          }

          &:not(:last-child) {
            margin: 12px 0;
          }
        }

        .total, .due {
          font-weight: bolder;
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
        font-weight: bolder;
        font-size: 25px;
        line-height: 30px;
        margin-top: 20px;
      }
    }
  }
</style>
