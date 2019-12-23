<template>
  <div>
    <g-simple-table striped fixed-header style="height: 100%">
      <thead>
      <tr>
        <th style="color: inherit; padding: 0; background-color: white">
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
      <tr v-for="product in productList">
        <td style="color: inherit; padding: 0">
          <div style="line-height: 1.75"
               :class="{'row-flex': true, ...product.edited ? {'text__edited': true} : null}"
          >
            <div class="flex-grow-1 pa-2 ta-left" style="font-size: 15px">
              <p>{{product.name}}
              <p v-if="product.attributes" class="promotion">{{product.attributes}}</p>
            </div>
            <div class="w-10 pa-2 ta-center">{{product.unit}}</div>
            <div class="w-10 pa-2 ta-right">{{product.quantity}}</div>
            <div class="w-12 pa-2 ta-right">
              <p>{{product.price}}</p>
              <p v-if="product.promotion && product.originalPrice" class="promotion-price">{{product.originalPrice}}</p>
            </div>
            <div class="w-12 pa-2 ta-right">
              <p :class="[product.edited && 'text__edited']">{{product.price * product.quantity}}</p>
              <p v-if="product.promotion && product.originalPrice" class="promotion-price">{{product.originalPrice * product.quantity}}</p>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </g-simple-table>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenTable',
    injectService: [
      'PosStore:currentOrder'
    ],
    computed: {
      productList() {
        return this.currentOrder.items.map(product => ({
          ..._.omit(product, 'attributes'),
          attributes: this.getAttributes(product),
          edited: product.price !== product.originalPrice
        }))
      }
    },
    methods: {
      getAttributes: item => {
        if (!item.attributes) return
        const attrStringArr = item.attributes.map(attr => `${attr.key}: ${attr.value}`)
        return attrStringArr.join(', ')
      },
    }
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

      ::v-deep .g-data-table__wrapper {
        border-radius: inherit;
      }
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
        color: #4CAF50;
      }

      .promotion {
        text-transform: capitalize;
        color: #979797;
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