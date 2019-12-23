<template>
  <div style="position:relative;">
    <div style="position:absolute; contain:content; width:100%; height:100%; overflow: scroll" class="table-wrapper">
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
        <table-expansion-row v-for="(item, index) in formattedProducts"
                             :key="index"
                             :ref="`row_${index}`"
                             v-bind="item"
                             @toggle="toggle(index)"
                             @click:remove="removeItemQuantity(index, $event)"
                             @click:add="addItemQuantity(index)"
        ></table-expansion-row>
        <template v-if="formattedProducts.length < viewportRows">
          <tr v-for="(i, index) in (viewportRows - formattedProducts.length)" :key="`empty_${index}`" class="empty-row">
            <td></td>
          </tr>
        </template>
      </g-simple-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenTable',
    injectService: ['PosStore:(currentOrder)'],
    data() {
      return {
        viewportRows: 0,
      }
    },
    computed: {
      formattedProducts() {
        return this.currentOrder.items.map(item => ({
          ..._.omit(item, 'attributes'),
          attributes: this.getAttributes(item),
          originalTotal: (item.quantity * item.originalPrice).toFixed(2),
          total: (item.quantity * item.price).toFixed(2)
        }))
      }
    },
    methods: {
      getAttributes: item => {
        if (!item.attributes) return
        const attrStringArr = item.attributes.map(attr => `${attr.key}: ${attr.value}`)
        return attrStringArr.join(', ')
      },
      toggle(index) {
        const posStore = this.$getService('PosStore')
        if (index === posStore.activeTableProduct) {
          posStore.activeTableProduct = undefined
        } else if (!_.isNil(index)) {
          posStore.activeTableProduct = index
        }
      },
      addItemQuantity(index) {
        this.$getService('PosStore:addItemQuantity')(this.currentOrder.items[index])
      },
      removeItemQuantity(index, removeAll) {
        this.$getService('PosStore:removeItemQuantity')(this.currentOrder.items[index], removeAll)
      }
    },
    mounted() {
      const posStore = this.$getService('PosStore')

      posStore.$watch('currentOrder.items', items => {
        if (this.$el) {
          const tableWrapper = this.$el.querySelector('.table-wrapper')
          if (items) {
            tableWrapper.scrollTop = items.length >= this.viewportRows
              ? tableWrapper.scrollHeight
              : 0
          }
        }
      }, { deep: true })

      posStore.$watch('activeTableProduct', (newValue, oldValue) => {
        if (!_.isNil(newValue) && newValue > -1 && this.$refs[`row_${newValue}`].length > 0) {
          this.$refs[`row_${newValue}`][0].$el.classList.add('g-expansion__active')
        }
        if (!_.isNil(oldValue) && oldValue > -1 && this.$refs[`row_${oldValue}`].length > 0) {
          this.$refs[`row_${oldValue}`][0].$el.classList.remove('g-expansion__active')
        }
      })

      this.$nextTick(() => {
        this.viewportRows = Math.floor(this.$el.querySelector('.table-wrapper').clientHeight / 44)
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
