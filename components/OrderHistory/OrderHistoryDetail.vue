<template>
  <div v-if="orderHistoryCurrentOrder" class="wrapper">
    <div>
      <span class="order-title">Order No.</span>
      <span class="order-id">{{orderHistoryCurrentOrder.id}}</span>
    </div>
    <g-simple-table striped>
      <tr v-for="product in orderHistoryCurrentOrder.items">
        <td>{{product.quantity}}x</td>
        <td>{{product.name}}</td>
        <td class="ta-right">€ {{product.price}}</td>
      </tr>
    </g-simple-table>
    <g-divider/>
    <div class="order-info mt-3">
      <span class="fw-700">Promotional
        Applied </span>
      <span class="order-info-number__big">-{{promotionTotal > 0 ? (' € ' + promotionTotal) : ''}}</span>
    </div>
    <div class="order-info order-info__sub" v-for="promotion in orderHistoryCurrentOrder.promotions">
      <span class="order-info__important">{{promotion.name}}</span>
      <span class="order-info__important order-info-number">- € {{promotion.amount}}</span>
    </div>
    <g-divider/>
    <div class="order-info mt-2">
      <span>Sub Total</span>
      <span class="order-info-number">€ {{subTotal.toFixed(2)}}</span>
    </div>
    <div class="order-info mb-2">
      <span>Tax</span>
      <span class="order-info-number">€ {{orderHistoryCurrentOrder.tax.toFixed(2)}}</span>
    </div>
    <g-divider/>
    <div class="total">
      <span>Total </span>
      <span class="total__important">€ {{orderHistoryCurrentOrder.amount.toFixed(2)}}</span>
    </div>
    <g-divider/>
  </div>
</template>

<script>

  export default {
    name: 'OrderHistoryDetail',
    props: {},
    injectService: [
      'PosStore:orderHistoryCurrentOrder'
    ],
    data() {
      return {}
    },
    computed: {
      promotionTotal() {
        return this.orderHistoryCurrentOrder && this.orderHistoryCurrentOrder.promotions.reduce((acc, val) => (acc + val.amount), 0);
      },
      subTotal() {
        return this.orderHistoryCurrentOrder && this.orderHistoryCurrentOrder.amount - this.promotionTotal - this.orderHistoryCurrentOrder.tax;
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    padding: 16px 8px;
    box-shadow: -1px 0px 6px rgba(0, 0, 0, 0.25);
    overflow: auto;
    z-index: 2;

    &::-webkit-scrollbar {
      display: none;
    }

    .order-title {
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #9E9E9E;
    }

    .order-id {
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
      margin-left: 4px;
    }

    .g-table {
      margin-top: 16px;
      margin-bottom: 16px;

      tr td {
        height: 28px;
        padding: 0 4px 0 2px;
        font-size: 12px;
        line-height: 28px;
        white-space: nowrap;
        max-width: 0;
      }

      tr td:first-child {
        width: 15%;
      }

      tr td:nth-child(2) {
        width: 60%;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-left: 8px;
        font-weight: bold;
      }
    }

    .order-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      line-height: 15px;
      margin: 4px;
      font-weight: 700;

      &__sub {
        padding-left: 8px;
      }

      &__important {
        color: #ff4552;
      }

      &-number {
        font-size: 13px;
        line-height: 16px;
        font-weight: 400;

        &__big {
          font-size: 16px;
          line-height: 20px;
          font-weight: 400;
        }
      }
    }

    .total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      line-height: 15px;
      margin: 16px 4px;
      font-weight: 700;

      &__important {
        color: #1271ff;
        font-size: 18px;
        line-height: 24px;
      }
    }
  }
</style>