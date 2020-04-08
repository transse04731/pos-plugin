<template>
  <div class="online-order-list">
    <div class="online-order-list__title">
      {{status}} orders
    </div>
    <div class="online-order-list__table">
      <g-table elevation="2" fixed-header>
        <thead>
          <tr>
            <th v-for="header in headers">{{header}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in computedItems" :key="i">
            <td class="fw-700">
              #{{item.id}}
            </td>
            <td>
              <p>{{item.customer.name}}</p>
              <p>{{item.customer.phone}}</p>
            </td>
            <td>
              <div v-if="item.address">
                <p>{{item.address.detail}}</p>
                <p>{{item.address.code}}</p>
              </div>
              <div v-else>--</div>
            </td>
            <td>
              <p class="fw-700">€{{item.amount.value}}</p>
              <p>{{item.amount.type}}</p>
            </td>
            <td>{{item.received}}</td>
            <td>{{item.delivery}}</td>
            <td class="fw-700">{{item.type}}</td>
            <td :class="statusClass">{{item.status}}</td>
          </tr>
        </tbody>
      </g-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OnlineOrderList",
    props: {
      status: String
    },
    data() {
      return {
        headers: ['No.', 'Customer', 'Address', 'Amount', 'Received', 'Delivery', 'Type', 'Status'],
        items: [
          {
            id: 1,
            customer :{
              name: 'Carilyn',
              phone: '086 333 333'
            },
            address: {
              detail: 'Kurfuerstendamm 29 Muchen',
              code: '80017'
            },
            amount: {
              value: 790,
              type: 'Cash'
            },
            received: '16:45',
            delivery: '17:00',
            type: 'Pickup',
          },
          {
            id: 23,
            customer :{
              name: 'Claudia C Braun',
              phone: '085 431 431'
            },
            amount: {
              value: 790,
              type: 'Cash'
            },
            received: '17:30',
            delivery: '17:30',
            type: 'Delivery',
          },
          {
            id: 5,
            customer :{
              name: 'Carilyn',
              phone: '034 090 029'
            },
            address: {
              detail: 'Kurfuerstendamm 29 Muchen',
              code: '80017'
            },
            amount: {
              value: 790,
              type: 'Paid'
            },
            received: '18:00',
            delivery: '18:00',
            type: 'Delivery',
          },
          {
            id: 3,
            customer :{
              name: 'Claudia C Braun',
              phone: '025 312 321'
            },
            address: {
              detail: 'Kurfuerstendamm 29 Muchen',
              code: '80017'
            },
            amount: {
              value: 790,
              type: 'Cash'
            },
            received: '15:00',
            delivery: '15:00',
            type: 'Delivery',
          },
          {
            id: 2,
            customer :{
              name: 'Carilyn',
              phone: '893 314 431'
            },
            address: {
              detail: 'Kurfuerstendamm 29 Muchen',
              code: '80017'
            },
            amount: {
              value: 790,
              type: 'Paid'
            },
            received: '15:00',
            delivery: '15:00',
            type: 'Delivery',
          },
          {
            id: 8,
            customer :{
              name: 'Claudia CBraun',
              phone: '024 021 432'
            },
            amount: {
              value: 790,
              type: 'Paid'
            },
            received: '08:00',
            delivery: '08:00',
            type: 'Pickup',
          },
          {
            id: 18,
            customer :{
              name: 'Claudia CBraun',
              phone: '024 021 432'
            },
            amount: {
              value: 790,
              type: 'Cash'
            },
            received: '07:00',
            delivery: '07:00',
            type: 'Delivery',
          },
          {
            id: 10,
            customer :{
              name: 'Claudia CBraun',
              phone: '024 021 432'
            },
            amount: {
              value: 790,
              type: 'Paid'
            },
            received: '06:30',
            delivery: '06:30',
            type: 'Delivery',
          },
        ]
      }
    },
    computed: {
      computedItems() {
        return this.items.map(i => ({...i, status: this.status}))
      },
      statusClass() {
        return this.status
      }
    }
  }
</script>

<style scoped lang="scss">
  .online-order-list  {
    background-image: url('/plugins/pos-plugin/assets/out.png');
    width: 100%;
    height: 100%;
    padding: 24px 16px;

    &__title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 16px;
      text-transform: capitalize;
    }

    &__table {
      height: calc(100% - 40px);
      width: 100%;

      .g-table {
        th, td {
          height: 69px;
          padding: 8px 8px 0;
          vertical-align: top;
          font-size: 14px;
        }

        thead th {
          background: #EFEFEF;
          font-size: 12px;
          color: #757575;
          height: 38px;
        }

        tr:nth-child(even) {
          td {
            background: #F8F8FB;
          }
        }

        .completed {
          color:#4CAF50;
          text-transform: capitalize;
        }

        .declined {
          color:#FF5252;
          text-transform: capitalize;
        }
      }
    }
  }
</style>
