<template>
  <g-simple-table striped fixed-header>
    <thead>
    <tr>
      <th class="ta-right" @click="openOrderNumberLookup">Order No.
        <g-icon size="12">mdi-magnify</g-icon>
      </th>
      <th @click="openDateTimePicker">Date Time
        <g-icon size="12">mdi-filter</g-icon>
      </th>
      <th @click="openBarcodeLookup">Barcode
        <g-icon size="12">mdi-magnify</g-icon>
      </th>
      <th class="ta-right" @click="openAmountFilter">Amount
        <g-icon size="12">mdi-filter</g-icon>
      </th>
      <th class="ta-left" @click="openStaffFilter">Staff
        <g-icon size="12">mdi-magnify</g-icon>
      </th>
      <th>Info</th>
    </tr>
    </thead>
    <tr v-if="orderHistoryFilters && orderHistoryFilters.length > 0" class="bg-grey-lighten-1">
      <td colspan="6">
        <div class="filter-list">
          <span class="ml-1">Filter</span>
          <div class="group-chip">
            <g-chip v-for="filter in orderHistoryFilters" label small background-color="white" close class="ma-1" @close="removeFilter(filter)">
              <div>
                <span class="chip-title">{{filter.title}}: </span>
                <span class="chip-content">{{filter.value}}</span>
              </div>
            </g-chip>
          </div>
          <g-spacer/>
          <g-btn text x-small background-color="white" height="24" @click="clearFilters">
            <g-icon svg size="16">icon-cancel3</g-icon>
          </g-btn>
        </div>
      </td>
    </tr>
    <tr v-for="order in orderHistoryOrders" :class="[order.id === orderHistoryCurrentOrder.id && 'tr__active']" @click="chooseOrder(order)">
      <td class="ta-right">{{order.id}}</td>
      <td class="ta-center">{{order.dateTime}}</td>
      <td class="ta-center">{{order.barcode}}</td>
      <td class="ta-right">€ {{order.amount.toFixed(2)}}</td>
      <td>{{order.staff}}</td>
      <td>{{order.info}}</td>
    </tr>
  </g-simple-table>
</template>
<script>

  export default {
    name: 'OrderTable',
    props: {
      value: null,
    },
    injectService: [
      'PosStore:orderHistoryOrders',
      'PosStore:orderHistoryFilters',
      'PosStore:orderHistoryCurrentOrder',
    ],
    data() {
      return {}
    },
    methods: {
      openAmountFilter() {
        this.$getService('orderHistoryAmountFilter:setActive')(true)
      },
      openBarcodeLookup() {
        this.$getService('orderHistoryBarcodeLookup:setActive')(true)
      },
      openDateTimePicker() {
        this.$getService('orderHistoryDateTimePicker:setActive')(true)
      },
      openStaffFilter() {
        this.$getService('orderHistoryStaffFilter:setActive')(true)
      },
      openOrderNumberLookup() {
        this.$getService('orderHistoryOrderNumberLookup:setActive')(true)
      },
      chooseOrder(order) {
        this.orderHistoryCurrentOrder = order;
      },
      removeFilter(filter) {
        const index = this.orderHistoryFilters.findIndex(f => f.title === filter.title);
        this.orderHistoryFilters.splice(index, 1);
      },
      clearFilters() {
        this.orderHistoryFilters = [];
      }
    }
  }
</script>

<style scoped lang="scss">
  .g-table {
    min-height: 0;

    ::v-deep .g-data-table__wrapper::-webkit-scrollbar {
      display: none;
    }

    ::v-deep table {
      table-layout: fixed;
    }

    thead tr th {
      color: #1271ff;
      cursor: pointer;
      padding: 0 8px;
      background-color: white;
      font-weight: 700;
      white-space: nowrap;
    }

    tr td {
      height: 33px;
      font-size: 13px;
      line-height: 16px;
      padding: 0 8px;
    }

    .tr__active {
      td {
        border-top: 2px solid #1271FF;
        border-bottom: 2px solid #1271FF;
      }

      td:first-child {
        border-left: 2px solid #1271FF;
      }

      td:last-child {
        border-right: 2px solid #1271FF;
      }
    }

    tr th:nth-child(1) {
      width: 13%;
    }

    tr th:nth-child(2) {
      width: 14%;
    }

    tr th:nth-child(3) {
      width: 18%;
    }

    tr th:nth-child(4) {
      width: 12%;
    }

    tr th:nth-child(5) {
      width: 15%;
    }
  }

  .filter-list {
    display: flex;
    align-items: center;
    padding: 8px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;

    .group-chip {
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      margin: 0 4px;

      &::-webkit-scrollbar {
        display: none;
      }

      ::v-deep .g-chip {
        overflow: visible;
      }

      .chip-title {
        color: #97A3B4;
        font-weight: 400;
        font-size: 11px;
      }

      .chip-content {
        color: #1D1D26;
        font-weight: 700;
        font-size: 12px;
      }
    }
  }
</style>