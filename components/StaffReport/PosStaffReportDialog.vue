<template>
  <div class="staff-report-dialog">
    <div class="staff-report-content">
      <g-tabs :items="staffs"
              :show-arrows="false"
              :vertical="true"
              color='#F2F2F2'
              slider-size="0"
              text-color="#000000"
              v-if="staffs.length"
              v-model="selectedStaff"
      >
        <g-tab-item :item="item" :key="i" v-for="(item, i) in staffs">
          <div class="detail-header">Staff Name: {{item.name}}</div>
          <div class="detail-header">Report Date: {{reportDate}}</div>
          <div class="detail-time">First Order: {{computedFirstOrderTime}}</div>
          <div class="detail-time">Last Order: {{computedLastOrderTime}}</div>
          <div class="sales-details-header">Sales</div>
          <p><span class="sales-entry sales-type">Total</span> <span class="sales-entry sales-amount">{{computedTotal | formatNumber}}</span></p>
          <p><span class="sales-entry sales-type">Sub-total</span> <span class="sales-entry sales-amount">{{(computedTotal - computedTax) |
            formatNumber}}</span>
          </p>
          <p><span class="sales-entry sales-type">Tax</span> <span class="sales-entry sales-amount">{{computedTax | formatNumber}}</span></p>
          <div class="tax-detail">
            <div v-for="(entry, key, index) in computedTaxByCategory">
              <p class="sales-entry sales-type">Tax {{key}}%:</p>
              <p><span class="sales-entry sales-type">Total</span> <span class="sales-entry sales-amount">{{entry.total | formatNumber}}</span></p>
              <p><span class="sales-entry sales-type">Sub-total</span> <span class="sales-entry sales-amount">{{(entry.total - entry.tax) |
                formatNumber}}</span>
              </p>
              <p><span class="sales-entry sales-type">Tax</span> <span class="sales-entry sales-amount">{{entry.tax | formatNumber}}</span></p>
              <br/>
            </div>

            <p><span class="sales-entry sales-type">Vouchers Sold</span> <span class="sales-entry sales-amount">0.00</span></p>
            <p><span class="sales-entry sales-type">Vouchers Used</span> <span class="sales-entry sales-amount">0.00</span></p>
            <p><span class="sales-entry sales-type">Discount</span> <span class="sales-entry sales-amount">{{computedDiscount | formatNumber}}</span></p>
          </div>
          <div class="sales-details">
            <p :key="index" v-for="(sale, key, index) in computedSalesByPayment">
              <span class="sales-entry sales-type">{{key}} Sales: </span><span class="sales-entry">{{sale | formatNumber}}</span>
            </p>
            <p><span class="sales-entry sales-type">Returned Total: </span> <span class="sales-entry">{{computedCashBack | formatNumber}}</span></p>
          </div>
        </g-tab-item>
        <template #tab="{item, index}">
          <g-tab :item="item" :key="index" active-text-color="#000000">
            <p style="text-transform: uppercase; overflow: hidden; text-overflow: ellipsis;">{{item.name}}</p>
          </g-tab>
        </template>
      </g-tabs>
    </div>

    <g-toolbar bottom color="#EEEEEE">
      <g-btn :uppercase="false" @click="back" width="94px">
        <g-icon class="mr-2" svg>icon-back</g-icon>
        Back
      </g-btn>
      <g-spacer/>
      <g-btn :uppercase="false" @click="print" background-color="#2979FF" text-color="#FFFFFF" width="94px">
        <g-icon class="mr-2" svg>icon-print2</g-icon>
        Print
      </g-btn>
    </g-toolbar>
  </div>

</template>

<script>
  import _ from 'lodash'
  import dayjs from 'dayjs'
  import orderUtil from '../logic/orderUtil';

  export default {
    name: 'PosStaffReportDialog',
    props: {
      value: null
    },
    injectService: ['PosStore:( orderHistoryOrders, getListUsers, listUsers, getOrdersByStaff, systemDate )'],
    data: () => ({
      selectedStaff: null,
      staffs: [],
      ordersByStaffs: [],
      salesByPayments: null,
      firstOrderTime: null,
      lastOrderTime: null,
    }),
    computed: {
      computedTotal() {
        return (this.ordersByStaffs && _.sumBy(this.ordersByStaffs, (order) => order.amount)) || 0;
      },
      computedTax() {
        return (this.ordersByStaffs && _.sumBy(this.ordersByStaffs, (order) => order.tax)) || 0;
      },
      computedDiscount() {
        return (this.ordersByStaffs && _.sumBy(this.ordersByStaffs, (order) => order.discount)) || 0;
      },
      computedCashBack() {
        return (this.ordersByStaffs && _.sumBy(this.ordersByStaffs, (order) => order.cashback)) || 0;
      },
      computedFirstOrderTime() {
        return (this.ordersByStaffs.length && this.ordersByStaffs[0].dateTime) || null;
      },
      computedLastOrderTime() {
        return (this.ordersByStaffs.length && this.ordersByStaffs[this.ordersByStaffs.length - 1].dateTime) || null;
      },
      computedSalesByPayment() {
        if (!this.ordersByStaffs || !this.ordersByStaffs.length) {
          return []
        }
        let payments = _(this.ordersByStaffs).map(order => order.payment).flatten().groupBy('type').value();
        for (const key in payments) {
          if (payments.hasOwnProperty(key)) {
            payments[key] = _.reduce(payments[key], (acc, curr) => {
              return acc + curr.value
            }, 0);
          }
        }
        return payments;
      },
      computedTaxByCategory() {
        let taxCategories = _(this.ordersByStaffs).map((order) => order.items).flatten().groupBy('tax').value()
        for (const key in taxCategories) {
          if (taxCategories.hasOwnProperty(key)) {
            taxCategories[key] = {
              total: _.sumBy(taxCategories[key], (item) => +(item.quantity * item.price)),
              tax: orderUtil.calOrderTax(taxCategories[key])
            };
          }
        }
        return taxCategories
      },
      reportDate() {
        return dayjs(this.systemDate).format('DD/MM/YYYY')
      }
    },
    watch: {
      async selectedStaff(newVal) {
        if (!newVal) {
          return []
        }
        this.ordersByStaffs = await this.getOrdersByStaff(newVal.name);
      }
    },
    methods: {
      back() {
        this.$router.push({ path: '/view/pos-dashboard' })
      },
      calTax(price, tax) {
        return price * (1 - 1 / (1 + tax / 100))
      },
      calItemTax(item) {
        return +(this.calTax(item.price, item.tax) * item.quantity).toFixed(2);
      },
      calOrderTax(items) {
        return _.sumBy(items, this.calItemTax);
      },
      async print() {
        const report = {
          name: this.selectedStaff.name,
          reportDate: this.reportDate,
          computedFirstOrderTime: this.computedFirstOrderTime,
          computedLastOrderTime: this.computedLastOrderTime,
          computedTotal: this.computedTotal,
          computedTax: this.computedTax,
          computedSubTotal: this.computedTotal - this.computedTax,
          computedDiscount: this.computedDiscount,
          computedSalesByPayment: this.computedSalesByPayment,
          computedCashBack: this.computedCashBack,
          computedTaxByCategory: this.computedTaxByCategory
        }
        await this.$getService('PosStore:printStaffReport')(report)
      }
    },
    async mounted() {
      await this.getListUsers();
      this.staffs = this.listUsers;
      this.selectedStaff = this.staffs.length && this.staffs[0]
    },
    async activated() {
      await this.getListUsers();
      this.staffs = this.listUsers;
      this.selectedStaff = this.staffs.length && this.staffs[0]
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
  .staff-report-dialog {
    width: 100%;
    background-color: #fff;
    position: relative;
    height: 100%;

    .staff-report-content {
      height: 100%;

      .detail-header {
        font-weight: bold;
        font-size: 16px;
        line-height: 27px;
      }

      .detail-time {
        font-size: 14px;
        line-height: 25px;
        font-family: "Muli", sans-serif;
      }

      .sales-details {
        border-top: 1px dashed #000000;
      }

      .sales-details-header {
        font-weight: bold;
        font-size: 16px;
        line-height: 33px;
        border-top: 1px dashed #000000;
      }

      .tax-detail {
        border-top: 1px dashed #000000;
      }

      .sales-entry {
        font-size: 14px;
        line-height: 25px;
      }

      .sales-type {
        text-transform: capitalize;
      }

      .sales-amount {
        float: right;
      }

      .g-tab {
        height: 99px;
        width: 190px;
        background-color: #ffffff;
      }

      .g-tab:hover:before {
        opacity: 0;
      }

      .g-tab:not(.g-tab__active) {
        height: 99px;
        width: 190px;
        background-color: #F9F9F9;
        border-left: 4px solid transparent;
      }

      .g-tab.g-tab__active {
        border-left: 4px solid #2979FF;
      }


      ::v-deep .g-tabs-wrapper {
        height: calc(100% - 64px);

        .g-tabs__vertical {
          .g-tabs-bar {
            overflow-y: auto;
            -ms-overflow-style: none;
          }

          /* Hide scrollbar for Chrome, Safari and Opera */
          .g-tabs-bar::-webkit-scrollbar {
            display: none;
          }
        }

        .g-tab-items {
          height: 100%;
          overflow-y: auto;

          .g-tab-item {
            padding: 40px 50px;
            background-color: #ffffff;
          }

        }
      }

    }
  }
</style>
