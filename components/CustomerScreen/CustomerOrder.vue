<template>
  <div class="row-flex h-100">
    <div class="image col-6"></div>
    <div class="customer-order col-6">
      <div class="customer-order__top">
        <div class="customer-order__top--title">Pizza Hut - Berlin</div>
        <div>
          <p>May 20, 2019</p>
          <p class="ta-right">16:43</p>
        </div>
      </div>
      <div class="customer-order__table">
        <g-simple-table striped fixed-header style="height: 100%">
          <thead>
          <tr>
            <th>Name</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Each(€)</th>
            <th>Total(€)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in productList">
            <td>
              <p>{{product.name}}</p>
              <p v-if="product.promotion" class="promotion ml-3">{{product.promotion}}</p>
            </td>
            <td>{{product.unit}}</td>
            <td>{{product.quantity}}</td>
            <td>
              <p>{{product.price.toFixed(2)}}</p>
              <p v-if="product.promotion" class="promotion line-through">{{product.discount.toFixed(2)}}</p>
            </td>
            <td>
              <p class="fw-700">{{(product.price * product.quantity).toFixed(2)}}</p>
              <p v-if="product.promotion" class="promotion line-through">{{(product.discount *
                product.quantity).toFixed(2)}}</p>
            </td>
          </tr>
          <tr v-for="row in 10">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </g-simple-table>
      </div>
      <div class="customer-order__bottom">
        <div class="customer-order__bottom--left">
          <p>Discount(€)</p>
          <p class="ta-right">- 1.20</p>
          <p>Tax(€)</p>
          <p class="ta-right">2.56</p>
          <p>Sub-total(€)</p>
          <p class="fw-700 ta-right">25.58</p>
          <p class="fw-700">Total(€)</p>
          <p class="fw-700 fs-large-3 ta-right" style="color: #1271FF">28.14</p>
        </div>
        <g-divider vertical/>
        <div class="customer-order__bottom--right">
          <p>Payment method:</p>
          <p class="fw-700">Cash</p>
          <div class="row-flex justify-between align-items-center">
            <p>Received(€)</p>
            <p>50</p>
          </div>
          <div class="row-flex justify-between align-items-center">
            <p>Change due(€)</p>
            <p class="fw-700 fs-large-3" style="color: #1271FF">21.86</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CustomerOrder",
    data() {
      return {
        productList: [
          {
            name: 'Bread', unit: 'piece', quantity: 3, price: 0.75
          },
          {
            name: 'Butter', unit: 'piece', quantity: 2, price: 2.50
          },
          {
            name: 'Coca-cola', unit: 'bottle', quantity: 1, price: 2.00
          },
          {
            name: 'Egg', unit: 'piece', quantity: 12, price: 0.5, promotion: 'Promotion A', discount: 0.10
          },
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  .image {
    background-image: url("/plugins/pos-plugin/assets/customer-order.png");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .customer-order {
    display: flex;
    flex-direction: column;
    font-size: 15px;
    color: #1d1d26;

    &__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      font-weight: 700;

      &--title {
        font-size: 18px;
      }
    }

    &__table {
      flex: 1;
      border-radius: 6px;
      border: 1px solid #E8E8E8;
      margin: 8px;
      overflow: auto;
      contain: content;

      .g-table {
        border-radius: inherit;

        ::v-deep .g-data-table__wrapper {
          border-radius: inherit;
          overflow: visible;
        }

        ::v-deep table {
          table-layout: fixed;

          th, td {
            padding: 12px;
            color: #1d1d26;
            text-align: center;

            &:first-child {
              width: 50%;
              text-align: left;
            }
          }

          th {
            font-weight: 700;
            background-color: white;
          }
        }
      }

      .promotion {
        color: #979797;

        &.line-through {
          text-decoration: line-through;
        }
      }
    }

    &__bottom {
      display: flex;
      padding: 12px;
      justify-content: space-between;

      &--left {
        display: grid;
        flex-grow: 1;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(4, 1fr);
        align-items: center;
        margin-right: 24px;
      }

      &--right {
        display: grid;
        flex-grow: 1;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr);
        align-items: center;
        margin-left: 24px;
      }
    }
  }
</style>
