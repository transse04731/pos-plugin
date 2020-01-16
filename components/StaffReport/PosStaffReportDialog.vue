<template>
  <div class="staff-report-dialog">
    <div class="staff-report-content">
      <g-tabs :items="staffs"
              :show-arrows="false"
              :vertical="true"
              color='#F2F2F2'
              slider-color="#2979FF"
              slider-size="4px"
              text-color="#000000"
              v-if="staffs.length"
              v-model="selectedStaff"
      >
        <g-tab-item :item="item" :key="i" v-for="(item, i) in staffs">
          <div class="detail-header">Staff Name: {{item.name}}</div>
          <div v-if="orderSalesByStaff && orderSalesByStaff.user[orderSalesByStaff.name]">
            <div class="detail-header">Report Date: {{reportDate}}</div>
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
        </g-tab-item>
        <template #tab="{item, index}">
          <g-tab :item="item" :key="index" active-text-color="#000000">
            <p class="tab-username">{{item.name}}</p>
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

  export default {
    name: 'PosStaffReportDialog',
    props: {
      value: null
    },
    injectService: ['PosStore:( getListUsers, listUsers, getOrderSalesByStaff, systemDate )'],
    data: () => ({
      selectedStaff: null,
      staffs: [],
      orderSalesByStaff: null,
    }),
    computed: {
      reportDate() {
        return dayjs(this.systemDate).format('DD/MM/YYYY')
      }
    },
    watch: {
      selectedStaff: {
        handler: async function (newVal) {
          if (!newVal) {
            return []
          }
          this.orderSalesByStaff = await this.$getService('PosStore:getOrderSalesByStaff')(newVal.name, this.systemDate)
        },
        sync: true
      }
    },
    methods: {
      back() {
        this.$router.push({ path: '/view/pos-dashboard' })
      },
      async print() {
        if (!this.orderSalesByStaff) {
          return
        }
        return await this.$getService('PosStore:printStaffReport')(this.orderSalesByStaff)
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
        return isNaN(val) ? '0.00' : val.toFixed(2)
      },
      formatTime: (val) => {
        return val ? dayjs(val).format('DD/MM HH:mm') : ''
      }
    },
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
      }

      .tab-username {
        text-transform: uppercase;
        white-space: normal;
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
