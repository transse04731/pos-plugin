<template>
  <div class="x-report-wrapper">
    <div class="header-container">
      <div class="card">
        <div class="store-name text-center">
          <span>{{name}}</span>
        </div>

        <div class="store-details text-center">
          <div>{{address}}</div>
          <div>Tel: {{telephone}}</div>
          <div>VAT Reg No: {{taxNumber}}</div>
        </div>
      </div>
    </div>

    <p class="header-title">X-Report</p>

    <div class="body-container">
      <div class="report-date">
        <div class="text-bold">Report Date: {{date}}</div>
        <div>First Order: {{getDateTimeString(from)}}</div>
        <div>Last Order: {{getDateTimeString(to)}}</div>
      </div>

      <div class="divider divider-dashed"></div>

      <div class="report-sale">
        <div class="text-bold">Sales</div>
        <div>
          <span>Total</span>
          <span class="float-right">{{sum | convertMoney}}</span>
        </div>
        <div>
          <span>Sub-total</span>
          <span class="float-right">{{net | convertMoney}}</span>
        </div>
        <div>
          <span>Tax</span>
          <span class="float-right">{{tax | convertMoney}}</span>
        </div>
      </div>

      <div class="divider divider-dashed"></div>

      <div class="report-tax">
        <div class="report-tax-group" v-if="sum0">
          <div>Tax 0%:</div>
          <div>
            <span>Total</span>
            <span class="float-right">{{sum0 | convertMoney}}</span>
          </div>
          <div>
            <span>Sub-total</span>
            <span class="float-right">{{net0 | convertMoney}}</span>
          </div>
          <div>
            <span>Tax</span>
            <span class="float-right">{{tax0 | convertMoney}}</span>
          </div>
        </div>

        <div class="report-tax-group" v-if="sum7">
          <div>Tax 7%:</div>
          <div>
            <span>Total</span>
            <span class="float-right">{{sum7 | convertMoney}}</span>
          </div>
          <div>
            <span>Sub-total</span>
            <span class="float-right">{{net7 | convertMoney}}</span>
          </div>
          <div>
            <span>Tax</span>
            <span class="float-right">{{tax7 | convertMoney}}</span>
          </div>
        </div>

        <div class="report-tax-group" v-if="sum19">
          <div>Tax 19%:</div>
          <div>
            <span>Total</span>
            <span class="float-right">{{sum19 | convertMoney}}</span>
          </div>
          <div>
            <span>Sub-total</span>
            <span class="float-right">{{net19 | convertMoney}}</span>
          </div>
          <div>
            <span>Tax</span>
            <span class="float-right">{{tax19 | convertMoney}}</span>
          </div>
        </div>

        <div class="report-discount">
          <span>Discount</span><span class="float-right">{{discount | convertMoney}}</span>
        </div>
      </div>

      <div class="divider divider-dashed"></div>

      <div class="report-payment-methods">
        <div class="" v-for="(paymentValue, paymentName) in sumByPayment">
          <span>{{paymentName}}:</span>
          <span> {{paymentValue | convertMoney}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'XReport',
    props: {
      name: String,
      address: String,
      telephone: String,
      taxNumber: String,
      date: String,
      from: Date,
      to: Date,
      discount: Number,
      sum: Number,
      net: Number,
      tax: Number,
      sum0: Number,
      net0: Number,
      tax0: Number,
      sum7: Number,
      net7: Number,
      tax7: Number,
      sum19: Number,
      net19: Number,
      tax19: Number,
      sumByPayment: null
    },
    filters: {
      convertMoney(value) {
        return !isNaN(value) ? value.toFixed(2) : value
      },
    },
    methods: {
      getDateTimeString(date) {
        return dayjs(date).format('DD.MM HH:mm')
      }
    }
  }
</script>

<style lang="scss">
  .x-report-wrapper {
    padding: 0 1px 0 15px;
    width: calc(100% - 16px);
    background-color: white;
    font-family: Verdana, sans-serif;
    font-style: normal;

    .divider {
      border-width: 1px;
      margin: 12px 0;
      align-self: center;
      width: 100%;

      &-dashed {
        border-style: dashed;
      }
    }

    .float-right {
      float: right;
    }

    .text-bold {
      font-weight: bold;
    }

    .header-container {
      text-align: center;

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
      }
    }

    .header-title {
      font-weight: bolder;
      font-size: 40px;
      line-height: 49px;
      text-align: center;
    }

    .body-container {
      font-size: 25px;

      p {
        margin: 0;
      }

      .report-date {

      }

      .report-tax {
        &-group {
          margin-bottom: 25px;
        }
      }

      .report-discount {

      }

      .report-payment-methods {
        text-transform: capitalize;
      }
    }
  }
</style>