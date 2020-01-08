<template>
  <div class="report-wrapper">
    <div class="report-content">
      <div class="report__sales">
        <div class="title">Sales</div>
        <g-divider dashed color="black"/>
        <div class="detail" v-for="(sale, i) in saleDataByPaymentType" :key="`sales`+i">
          <span>{{sale._id | capitalize}}</span>
          <span>€ {{sale.total.toFixed(2)}}</span>
        </div>
        <div class="total">
          <span>Total</span>
          <span><u>€ {{totalSales}}</u></span>
        </div>
      </div>
      <div v-if="showAllZNumber" class="report__z-number">
        <g-divider dashed color="black"/>
        <table>
          <tr v-for="(z, i) in zNumberData" :key="`zNumber`+i" class="z-number">
            <td>
              <div class="row-flex justify-between">
                <span>Z-Number {{z.z}}:</span>
                <span class="ml-2">€ {{z.sum.toFixed(2)}}</span>
              </div>
            </td>
            <td class="pl-2">Date: {{z.date}}</td>
          </tr>
        </table>
        <g-divider dashed color="black"/>
      </div>
      <div v-if="showProductSold" class="report__product">
        <div class="title">Product Sold</div>
        <g-divider dashed color="black"/>
        <div v-for="(category, i) in productsSoldByCategory" :key="`category`+i">
          <p class="category">
            {{category._id}} (€ {{category.total.toFixed(2)}})
          </p>
          <p class="product" v-for="(item, i) in category.items" :key="`item`+i">
            {{item.quantity}}x {{item.name}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PosMonthReport',
    injectService: [
      'PosStore:saleDataByPaymentType',
      'PosStore:zNumberData',
      'PosStore:productsSoldByCategory',
      'PosStore:showAllZNumber',
      'PosStore:showProductSold',
      'PosStore:getMonthReportData',
    ],
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    computed: {
      totalSales() {
        return this.saleDataByPaymentType.reduce((acc, val) => (acc + val.total), 0);
      },
    },
    async created() {
      if(this.saleDataByPaymentType.length === 0) {
        await this.getMonthReportData();
      }
    }
  }
</script>

<style scoped lang="scss">
 .report-wrapper{
   background: #d8d8d8;
   padding: 0 150px;
   z-index: -1;

   .report-content {
     background: white;
     padding: 32px;
     color: #1d1d26;
     overflow: auto;
     height: 100%;

     .title {
       font-weight: 700;
       font-size: 16px;
       line-height: 20px;
       margin-bottom: 12px;
       margin-top: 8px;
     }

     .report__sales {

       .detail {
         display: flex;
         justify-content: space-between;
         padding-left: 16px;
         padding-top: 8px;
         font-size: 14px;
         line-height: 25px;
       }

       .total {
         display: flex;
         justify-content: space-between;
         font-weight: 800;
         font-size: 14px;
         line-height: 30px;
         padding: 12px 0;
       }
     }

     .report__z-number {
       margin: 16px 0 32px;

       .z-number {
         font-size: 14px;
         line-height: 25px;

         + .g-divider {
           margin-top: 16px;
         }
       }

       .g-divider + .z-number {
         margin-top: 16px;
       }
     }

     .report__product {
        .category {
          font-weight: 800;
          font-size: 14px;
          line-height: 30px;
          padding-top: 8px;
        }

       .product {
         padding: 0 16px;
         font-size: 14px;
         line-height: 25px;
       }
     }
   }
 }
</style>