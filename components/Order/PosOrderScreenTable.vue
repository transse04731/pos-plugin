<template>
  <g-simple-table striped fixed-header>
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
    <table-expansion-row v-model="product" :items="orderDetail"/>
    <template v-if="orderDetail.length < 12 && orderDetail.length > 0">
      <tr v-for="i in (10 - orderDetail.length)" class="empty-row">
        <td></td>
      </tr>
    </template>
  </g-simple-table>
</template>

<script>
  import GSimpleTable from 'pos-vue-framework/src/components/GSimpleTable/GSimpleTable';
  import TableExpansionRow from 'pos-vue-framework/src/POSComponents/TableExpansionRow';

  export default {
    name: 'PosOrderScreenTable',
    components: { GSimpleTable, TableExpansionRow },
    data() {
      return {
        orderDetail: [
          {
            id: 1,
            name: 'Product item 1',
            unit: 'piece',
            quantity: 1,
            price: '5.52',
          },
          {
            id: 2,
            name: 'Product item 1',
            unit: 'piece',
            quantity: 1,
            price: '5.52',
          },
          {
            id: 3,
            name: 'Product item 1',
            unit: 'piece',
            quantity: 1,
            price: '5.52',
          },
          {
            id: 4,
            name: 'Product item 1',
            unit: 'piece',
            quantity: 1,
            price: '5.52',
          },
          {
            id: 5,
            name: 'Product item 1',
            unit: 'piece',
            quantity: 1,
            price: '5.52',
          },
          {
            id: 6,
            name: 'Product item 1',
            unit: 'piece',
            quantity: 1,
            price: '5.52',
            oldPrice: '7.52',
            promotion: 'Promotion A',
          },
        ],
        product: null,
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

  .empty-row {
    height: 42px;
  }
  }
</style>