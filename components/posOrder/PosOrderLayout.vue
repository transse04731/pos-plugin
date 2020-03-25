<template>
  <div class="pol" v-if="orderLayout">
    <!-- Categories -->
    <div style="padding: 4px; background-color: #90CAF9">
      <div :style="categoryContainerStyle">
        <div v-for="(category, index) in categories"
             class="pol__cate"
             :key="index"
             :style="[getCategoryStyle(category), getAreaStyle(category)]"
             @click="selectCategory(category)">
          {{ getCategoryName(category) }}
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
             @click="onProductClicked(productLayout); addProductToOrder(productLayout)"
             @dblclick="onProductDbClicked(productLayout)">
          <g-icon class="mr-1" v-if="productLayout.icon">{{productLayout.icon}}</g-icon>
          <span style="transform: skewX(-15deg)" v-if="productLayout.product && productLayout.product.isModifier">{{ getProductName(productLayout) }}</span>
          <template v-else>{{ getProductName(productLayout) }}</template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { createEmptyProductLayout } from './util'

  export default {
    name: 'PosOrderLayout',
    props: {
      editable: {
        type: Boolean,
        default: false,
      },
      view: null,
      orderLayout: null,
      selectedCategoryLayout: null,
      selectedProductLayout: null,
      productDblClicked: null
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
        // remove product layout which is not text but doesn't link to any product
        return _.filter(this.selectedCategoryLayout.products, p => p.type === 'Text' || (p.type !== 'Text' && p.product))
      }
    },
    async created() {
      await this.loadOrderLayout();
    },
    watch: {
      orderLayout() {
        if (this.selectedCategoryLayout) {
          const cateLayout = _.find(this.orderLayout.categories, c => this.isSameArea(this.selectedCategoryLayout, c))
          if (!cateLayout)
            return
          // update category layout
          this.$emit('update:selectedCategoryLayout', cateLayout)
          if (!this.view || this.view.name !== 'ProductEditor' || !this.selectedProductLayout)
            return
          // update product layout
          const prodLayout = _.find(cateLayout.products, pl => this.isSameArea(this.selectedProductLayout, pl))
          if (prodLayout)
            this.$emit('update:selectedProductLayout', prodLayout)
          else if (this.editable) {
            this.$emit('update:view', { name: 'CategoryEditor' })
            this.$emit('update:selectedProductLayout', null)
          }
        } else {
          // automatically select first category
          if (this.orderLayout.categories.length > 0) {
            this.$emit('update:selectedCategoryLayout', _.first(this.orderLayout.categories))
            if (this.editable && (!this.view || this.view.name !== 'CategoryEditor'))
              this.$emit('update:view', { name: 'CategoryEditor' })
          }
        }
      }
    },
    methods: {
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
            let empty = this.createEmptyLayout(row, column);
            if (isCategory) {
              if (this.selectedCategoryLayout && this.isSameArea(empty, this.selectedCategoryLayout))
                empty = this.selectedCategoryLayout;
              else
                empty = {...empty, ...this.createEmptyCategoryLayout()}
            } else {
              if (this.selectedProductLayout && this.isSameArea(empty, this.selectedProductLayout))
                empty = this.selectedProductLayout
              else
                empty = {...empty, ...createEmptyProductLayout()}
            }
            allAreas.push(empty)
          }
        }
        return this.removeOuterAreas(_.unionWith(areas, allAreas, (area1, area2) => this.isSameArea(area1, area2)), columns, rows)
      },
      createEmptyLayout(row, column) {
        return {
          top: row,
          left: column,
          name: ''
        }
      },
      createEmptyCategoryLayout() {
        return {
          rows: 10,
          columns: 6,
          color: '#FFF'
        }
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
        const isCategorySelected = this.selectedCategoryLayout && this.isSameArea(this.selectedCategoryLayout, category);
        return {
          backgroundColor: category.color,
          color: '#000',
          border: `1px solid ${isCategorySelected ? 'black' : 'transparent'}`
        }
      },
      getProductItemStyle(product) {
        const isProductSelected = this.selectedProductLayout && this.isSameArea(this.selectedProductLayout, product);
        const style = {
          backgroundColor: product.color,
          color: '#000',
          borderRadius: '2px',
        };
        if (isProductSelected)
          style.boxShadow = '0px 0px 3px #0091FF';
        if (product.type === 'Text') {
          style.justifyContent = 'flex-start'
          style.fontSize = '12px'
        }
        if (product.product && product.product.isModifier) {
          style.fontStyle = 'italic'
        }
        return style;
      },
      getGridTemplateFromNumber(num) {
        return _.join(_.map(_.range(0, num), c => '1fr'), ' ')
      },
      getCategoryName(item) {
        if (item)
          return item.name
      },
      getProductName(productLayout) {
        if (productLayout.type === 'Text')
          return productLayout.text
        if (productLayout.product && productLayout.product._id)
          return `${productLayout.product.id}. ${productLayout.product.name}`
      },
      async selectCategory(categoryLayout) {
        if (this.editable) {
          this.$emit('update:selectedCategoryLayout', categoryLayout);
          this.$emit('update:view', { name: 'CategoryEditor' })
        } else {
          this.$emit('update:selectedCategoryLayout', categoryLayout);
        }
        this.$emit('update:selectedProductLayout', null)
      },
      async selectProduct(productLayout) {
        if (this.editable) {
          if (this.selectedCategoryLayout._id) {
            this.$emit('update:view', { name: 'ProductEditor' })
            this.$emit('update:selectedProductLayout', productLayout);
          }
        } else {
          this.$emit('update:selectedProductLayout', productLayout);
          this.$emit('productSelected', productLayout.product)
        }
      },
      onProductClicked(productLayout) {
        this.selectProduct(productLayout);
        if (this.editable) {
          this.$emit('update:productDblClicked', false)
        }
      },
      onProductDbClicked(productLayout) {
        if (this.editable) {
          this.selectProduct(productLayout);
          this.$emit('update:productDblClicked', true)
        }
      },
      addProductToOrder({ product }) {
        if (product.isModifier) {
          this.$emit('addModifierToProduct', {
            name: product.name,
            price: product.price
          })
        } else {
          this.$emit('addProductToOrder', product)
        }
      },
    }
  }
</script>
<style scoped lang="scss">
  .pol {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.252295);

    &__cate {
      border-radius: 4px;
      text-align: center;
      align-items: center;
      padding: 8px;
    }

    &__prod {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      line-height: 0.9;
      padding: 0 8px;
      word-break: break-word;
    }
  }
</style>
