<template>
  <g-simple-table striped fixed-header ref="table">
    <thead>
    <tr>
      <th style="color: inherit; padding: 0; background-color: white; border-radius: inherit">
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
    <table-expansion-row
        v-model="activeTableProduct"
        :items="formattedOrder"
        @click:remove="removeItemQuantity"
        @click:add="addItemQuantity"
    />
    <template v-if="formattedOrder.length < 12">
      <tr v-for="i in (12 - formattedOrder.length)" class="empty-row">
        <td></td>
      </tr>
    </template>
  </g-simple-table>
</template>

<script>
  import GSimpleTable from 'pos-vue-framework/src/components/GSimpleTable/GSimpleTable';
  import TableExpansionRow from './components/TableExpansionRow';

  export default {
    name: 'PosOrderScreenTable',
    components: { GSimpleTable, TableExpansionRow },
    injectService: ['PosStore:(currentOrder,addItemQuantity,removeItemQuantity,activeTableProduct)'],
    data() {
      return {
        // activeTableProduct: null
      }
    },
    computed: {
      formattedOrder() {
        if (this.currentOrder) {
          return this.currentOrder.map(item => ({
            _id: item.product._id,
            name: item.product.name,
            unit: item.product.unit,
            quantity: item.quantity,
            price: item.product.price,
          }))
        }
      }
    },
    watch: {
      currentOrder: function (newVal) {
        console.log(this.$refs.table)
      }
    }
  }
</script>

<style scoped lang="scss">
  .table {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    font-size: 13px;
    margin: 6px;

    ::v-deep .g-data-table__wrapper {
      border-radius: inherit;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .empty-row td {
      height: 44px;
    }
  }

  .g-table {

  }
</style>