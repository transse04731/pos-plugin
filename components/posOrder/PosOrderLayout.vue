<template>
  <div class="pol" v-if="orderLayout">
    <!-- Categories -->
    <div style="padding: 4px; background-color: #90CAF9">
      <div :style="categoryContainerStyle">
        <div v-for="(category, index) in categories"
             class="pol__cate"
             :key="index"
             :style="[getCategoryStyle(category), getAreaStyle(category)]"
             @click="e => selectCategory(category)">
          {{ getName(category) }}
        </div>
      </div>
    </div>
    <!-- Products -->
    <div style="padding: 4px; background-color: #FFF; flex: 1" v-if="selectedCategoryLayout">
      <div :style="productContainerStyle">
        <div v-for="(productLayout, index) in products"
             class="pol__prod"
             :key="index"
             :style="[getAreaStyle(productLayout), getProductItemStyle(productLayout)]"
             @click="e => selectProduct(productLayout)">
          {{ getName(productLayout.product) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'

  export default {
    name: 'PosOrderLayout',
    props: {
      editable: {
        type: Boolean,
        default: false,
      },
      orderLayout: null,
      selectedCategoryLayout: null,
      selectedProductLayout: null,
    },
    data: function () {
      return {}
    },
    computed: {
      categoryContainerStyle() {
        return {
          display: 'grid',
          'grid-template-columns': this.getGridTemplateFromNumber(this.orderLayout.columns),
          'grid-template-rows': this.getGridTemplateFromNumber(this.orderLayout.rows),
          'grid-gap': '5px',
          height: '90px',
        }
      },
      productContainerStyle() {
        return {
          display: 'grid',
          'grid-template-columns': this.getGridTemplateFromNumber(this.selectedCategoryLayout.columns),
          'grid-template-rows': this.getGridTemplateFromNumber(this.selectedCategoryLayout.rows),
          'grid-gap': '5px',
          height: '100%'
        }
      },
      categories() {
        if (this.editable) {
          return this.fillMissingAreas(
              this.orderLayout.categories,
              this.orderLayout.columns,
              this.orderLayout.rows,
              true);
        }
        return this.orderLayout.categories
      },
      products() {
        if (this.editable) {
          return this.fillMissingAreas(
              this.selectedCategoryLayout.products,
              this.selectedCategoryLayout.columns,
              this.selectedCategoryLayout.rows);
        }
        return this.selectedCategoryLayout.products
      }
    },
    async created() {
      await this.loadOrderLayout();
    },
    methods: {
      getName(item) {
        if (item)
          return item.name
      },
      async loadOrderLayout() {
        this.$emit('update:orderLayout', await cms.getModel('OrderLayout').findOne({}))
      },
      fillMissingAreas(areas, columns, rows, isCategory) {
        // add extra info
        // areas: [ { top, left }, {...} ]
        // generating empty elements
        const allAreas = [];
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            let empty = { top: row, left: column, name: '', isEmpty: true };
            if (isCategory) {
              // apply changes from selected layout
              if (this.selectedCategoryLayout && this.isSameArea(empty, this.selectedCategoryLayout)) {
                empty = this.selectedCategoryLayout;
              } else { // set default
                empty.rows = 10;
                empty.columns = 6;
                empty.color = '#FFF';
              }
            } else {
              // add reference to product object
              empty = {
                ...empty,
                product: {
                  type: null,
                  id: null,
                  name: null,
                  groupPrinter: null,
                  groupPrinter2: null,
                  tax: null,
                  tax2: null,
                  category: null,
                }
              };
              // apply change from selected product
              if (this.selectedProductLayout && this.isSameArea(empty, this.selectedProductLayout)) {
                empty = this.selectedProductLayout
              } else {
                empty.color = '#EAEAEA';
              }
            }
            allAreas.push(empty)
          }
        }
        return this.removeOuterAreas(_.unionWith(areas, allAreas, (area1, area2) => this.isSameArea(area1, area2)), columns, rows)
      },
      isSameArea(area1, area2) {
        return area1.top === area2.top && area1.left === area2.left
      },
      removeOuterAreas(areas, columns, rows) {
        return _.filter(areas, area => area.top < rows && area.left < columns)
      },
      getAreaStyle(item) {
        return {
          'grid-area': `${item.top + 1} / ${item.left + 1} / ${item.top + 2} / ${item.left + 2}`
        }
      },
      getCategoryStyle(category) {
        const isCategorySelected = this.isSelectedCategory(category);
        return {
          backgroundColor: category.color,
          color: '#000',
          border: `1px solid ${isCategorySelected ? 'black' : 'transparent'}`
        }
      },
      getProductItemStyle(product) {
        const isProductSelected = this.selectedProductLayout === product;
        const style = {
          backgroundColor: product.color,
          color: '#000',
          borderRadius: '2px',
        };
        if (isProductSelected)
          style.boxShadow = '0px 0px 3px #0091FF';
        return style;
      },
      getGridTemplateFromNumber(num) {
        return _.join(_.map(_.range(0, num), c => '1fr'), ' ')
      },
      isSelectedCategory(category) {
        return this.selectedCategoryLayout === category
      },
      async selectCategory(categoryLayout) {
        this.$emit('update:selectedCategoryLayout', categoryLayout);
        this.$emit('update:view', { name: 'CategoryEditor' })
      },
      async selectProduct(productLayout) {
        this.$emit('update:selectedProductLayout', productLayout);
        this.$emit('update:view', { name: 'ProductEditor' })
      }
    }
  }
</script>
<style scoped lang="scss">
  .pol {
    display: flex;
    flex-direction: column;

    &__cate {
      border-radius: 4px;
      text-align: center;
      align-items: center;
      padding: 8px;
    }

    &__prod {
      text-align: center;
      align-items: center;
      border-radius: 2px;
    }
  }
</style>
