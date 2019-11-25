<template>
  <div>
    <g-simple-table striped fixed-header style="height: 100%">
      <thead>
      <tr>
        <th style="color: inherit; padding: 0">
          <div class="row-flex" style="line-height: 1.75">
            <span class="flex-grow-1 pa-2 ta-left">Name</span>
            <span class="w-10 pa-2 ta-center">Unit</span>
            <span class="w-10 pa-2 ta-right">Qty</span>
            <span class="w-12 pa-2 ta-right">Each(€)</span>
            <span class="W-12 pa-2 ta-right">Total(€)</span>
          </div>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in paymentOrderDetail">
        <td style="color: inherit; padding: 0">
          <div class="row-flex" style="line-height: 1.75">
            <div class="flex-grow-1 pa-2 ta-left" style="font-size: 15px">
              <p>{{order.name}}
                <g-icon v-if="order.edited" small color="#f44336" style="margin-bottom: 5px">edit</g-icon>
              </p>
              <p v-if="order.promotion" class="promotion">{{order.promotion}}</p>
            </div>
            <div class="w-10 pa-2 ta-center">{{order.unit}}</div>
            <div class="w-10 pa-2 ta-right">{{order.quantity}}</div>
            <div class="w-12 pa-2 ta-right">
              <p :class="[order.edited && 'text__edited']">{{order.price}}</p>
              <p v-if="order.promotion && order.oldPrice" class="promotion-price">{{order.oldPrice}}</p>
            </div>
            <div class="W-12 pa-2 ta-right">
              <p :class="[order.edited && 'text__edited']">{{order.price * order.quantity}}</p>
              <p v-if="order.promotion && order.oldPrice" class="promotion-price">{{order.oldPrice * order.quantity}}</p>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </g-simple-table>
  </div>
</template>

<script>
  import GSimpleTable from 'pos-vue-framework/src/components/GSimpleTable/GSimpleTable';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  export default {
    name: 'PosPaymentScreenTable',
    components: { GIcon, GSimpleTable },
    injectService: [
      'PosStore:paymentOrderDetail'
    ]
  }
</script>

<style scoped lang="scss">
  .table {
    margin: 6px;
    overflow: hidden;

    .g-table {
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      font-size: 13px;
    }

    .g-data-table__striped {
      tr:nth-child(odd) {
        background: rgba(242, 242, 242, 0.5);
      }

      tr:nth-child(even) {
        background: white !important;
      }

      thead tr:last-child {
        background: white !important;

        th {
          border: 0 !important;
          box-shadow: none !important;
        }
      }

      td {
        border-bottom: none !important;
      }

      .text__edited {
        color: #F44336;
      }

      .promotion {
        color: #979797;
        margin-left: 8px;
        line-height: 1;

        &-price {
          color: #979797;
          text-decoration: line-through;
          margin-top: 4px;
          line-height: 1;
        }
      }
    }

    .g-data-table__wrapper {
      border-radius: inherit;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    a:visited, a:link {
      text-decoration: none;
    }
  }
</style>