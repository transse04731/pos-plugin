<template>
  <div class="month-report-wrapper">
    <div class="header">{{date}}</div>
    <div class="report-content">
      <div class="report__sales">
        <div class="title">Sales</div>
        <div class="detail" v-for="(amount, payment) in salesByPayment" :key="`sales${payment}`">
          <span>{{payment}}</span>
          <span class="float-right">{{amount | convertMoney}}</span>
        </div>
        <div class="total">
          <span>Total</span>
          <span class="float-right"><u>{{total | convertMoney}}</u></span>
        </div>
      </div>
      <div v-if="zNumbers" class="report__z-number">
        <table>
          <tr v-for="(z, i) in zNumbers" :key="`zNumber${i}`" class="z-number">
            <td>
              <div class="row-flex justify-between">
                <span>Z-Number {{z.z}}:</span>
                <span class="ml-2 float-right">{{z.sum | convertMoney}}</span>
              </div>
            </td>
            <td>Date: {{z.date}}</td>
          </tr>
        </table>
      </div>
      <div v-if="salesByCategory" class="report__product">
        <div class="title">Product Sold</div>
        <div v-for="({products, sum}, category) in salesByCategory" :key="`category${category}`">
          <p class="category">
            {{category}} ({{sum | convertMoney}})
          </p>
          <p class="product" v-for="{product, quantity} in products" :key="`item${product}`">
            {{quantity}} x {{product}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MonthReport',
    props: {
      date: String,
      salesByCategory: null,
      salesByPayment: null,
      zNumbers: {
        type: Array,
        default: null
      },
      total: Number
    },
    filters: {
      convertMoney(value) {
        return !isNaN(value) ? value.toFixed(2) : value
      }
    }
  }
</script>

<style lang="scss">
  .month-report-wrapper {
    background: white;
    width: 100%;
    font-family: Verdana;
    font-style: normal;
    box-sizing: border-box;

    .float-right {
      float: right;
    }

    .ml-2 {
      margin-right: 8px !important;
    }

    .header {
      font-weight: bold;
      font-size: 35px;
      text-align: center;
    }

    .report-content {
      padding: 32px;
      color: black;
      overflow: auto;
      height: 100%;

      .title {
        font-weight: bold;
        font-size: 30px;
        line-height: 35px;
        margin-bottom: 12px;
        margin-top: 8px;
        border-bottom: dashed 1px black;
      }

      .report__sales {

        .detail {
          text-transform: capitalize;
          padding-left: 16px;
          padding-top: 8px;
          font-size: 25px;
        }

        .total {
          font-weight: bold;
          font-size: 25px;
          line-height: 35px;
          padding: 12px 0;
        }
      }

      .report__z-number {
        margin: 16px 0 32px;
        border-top: dashed 1px black;
        border-bottom: dashed 1px black;

        .z-number {
          font-size: 22px;
          line-height: 30px;
        }
      }

      .report__product {
        .category {
          font-weight: bold;
          font-size: 25px;
          line-height: 30px;
          padding-top: 8px;
        }

        .product {
          padding: 0 16px;
          font-size: 22px;
          line-height: 1;
          margin-bottom: -10px;
        }
      }
    }
  }
</style>
