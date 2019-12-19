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
    <table-expansion-row :items="orderItems"
                         @click:remove="removeItemQuantity"
                         @click:add="addItemQuantity"></table-expansion-row>
    <template v-if="orderItems.length < viewportRows">
      <tr v-for="(i, index) in (viewportRows - orderItems.length)" :key="`empty_${index}`" class="empty-row">
        <td></td>
      </tr>
    </template>
  </g-simple-table>
</template>

<script>
  //import TableExpansionRow from './components/TableExpansionRow';

  export default {
    name: 'PosOrderScreenTable',
    //components: { TableExpansionRow },
    injectService: ['PosStore:(addItemQuantity,removeItemQuantity)'],
    data() {
      return {
        viewportRows: 0,
        orderItems: []
      }
    },
    mounted() {
      const posStore = this.$getService('PosStore')
      posStore.$watch('currentOrder.items', items => {
        if (this.$el) {
          const tableWrapper = this.$el.querySelector('.g-data-table__wrapper')
          if (items) {
            tableWrapper.scrollTop = items.length >= this.viewportRows
              ? tableWrapper.scrollHeight
              : 0
          }
        }
        this.orderItems = items
      }, { deep: true })

      this.$nextTick(() => {
        this.viewportRows = Math.floor(this.$refs.table.$el.clientHeight / 44)
      })
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
