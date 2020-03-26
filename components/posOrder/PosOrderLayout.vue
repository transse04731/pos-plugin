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
             v-on="getProductListeners(productLayout)">
          <g-icon class="mr-1" v-if="productLayout.icon">{{productLayout.icon}}</g-icon>
          <span style="transform: skewX(-15deg)" v-if="productLayout.product && productLayout.product.isModifier">{{ getProductName(productLayout) }}</span>
          <template v-else>{{ getProductName(productLayout) }}</template>
        </div>
        <pos-order-keyboard v-if="showCalculator" :keyboard-config="keyboardConfig"/>
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
      productDblClicked: null,
    },
    data() {
      return {
        // touch helper
        isTouchEventHandled: null,
        doubleClicked: false,
        lastSelectMoment: null,
        keyboardConfig: {
          active: false,
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          onlyShowInFirstPage: false
        },
        highlightSelectedProduct: false
      }
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
      calculatorStyle() {
        const { top, left, width, height } = this.keyboardConfig
        const gridArea = `${top} / ${left} / ${top + height + 1} / ${left + width + 1}`
        console.log(gridArea)
        return {
          gridArea,
          backgroundColor: 'red'
        }
      },
      showCalculator() {
        if (!this.selectedCategoryLayout)
          return false

        let show = this.keyboardConfig.active
        if (this.keyboardConfig.onlyShowInFirstPage) {
          const {top, left} = this.selectedCategoryLayout
          if (top !== 0 || left !== 0)
            show = false
        }

        return show
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
      },
    },
    async created() {
      this.loadKeyboardConfig();
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
      loadKeyboardConfig() {
        this.$set(this, 'keyboardConfig', cms.getList('PosSetting')[0].keyboardConfig)
      },
      //
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
        if (isProductSelected && this.highlightSelectedProduct)
          style.boxShadow = '0px 0px 3px #0091FF';
        if (product.type === 'Text') {
          style.fontSize = '12px'
          style.backgroundColor = 'transparent'
          style.fontWeight = '400'
          style.color = '#212121'
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
        }
        this.highlightProduct(productLayout)
      },

      highlightProduct(productLayout) {
        if (!this.editable && productLayout.type === 'Text')
          return

        this.highlightSelectedProduct = true

        if (!this.editable) {
          // flash in view mode
          setTimeout(() => {
            this.highlightSelectedProduct = false
          }, 200)
        }
      },

      onProductSelect(productLayout) {
        if (this.editable) {
          // Known issues:
          //    + if user do n click/tab in short time, (n-1) double tab event will be raised
          //    + if user double click on item x, then click very fast to another item y,
          //      switch item action will not be executed because of the click event to item y has been omitted.
          // TODO: Fix known issues
          this.doubleClicked = false
          this.lastSelectMoment = new Date().getTime()
          // double click is ~300->350ms
          const timeout = 400
          setTimeout(() => {
            if (new Date().getTime() - this.lastSelectMoment < timeout) {
              console.log('emit double click')
              this.doubleClicked = true
              this.selectProduct(productLayout);
              this.$emit('update:productDblClicked', true)
            } else {
              if (!this.doubleClicked) {
                console.log('emit click')
                this.selectProduct(productLayout);
                this.addProductToOrder(productLayout);
                this.$emit('update:productDblClicked', false)
              }
            }
          }, timeout)
        } else {
          this.selectProduct(productLayout);
        }
      },

      addProductToOrder({ product }) {
        // Handle these stuff in productSelected event.
        // work-around
        if (!product || !product._id)
          return
        if (product.isModifier) {
          this.$emit('addModifierToProduct', {
            name: product.name,
            price: product.price
          })
        } else {
          this.$emit('addProductToOrder', product)
        }
      },

      onClick(productLayout) {
        if (!this.isTouchEventHandled) {
          console.log('onclick')
          this.onProductSelect(productLayout)
        }
      },

      onTouchStart(productLayout) {
        console.log('touch start')
        this.isTouchEventHandled = true
        this.onProductSelect(productLayout)
      },

      getProductListeners(productLayout) {
        return this.editable
          ? { click: () => this.onClick(productLayout), touchstart: () => this.onTouchStart(productLayout)}
          : { click: () => this.addProductToOrder(productLayout) }
      }
    }
  }
</script>
<style scoped lang="scss">
  .pol {
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);

    &__cate {
      border-radius: 4px;
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: center;
      padding: 8px;
      font-size: 13px;
      font-weight: 700;
    }

    &__prod {
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: center;
      font-size: 14px;
      line-height: 0.9;
      font-weight: 700;
      color: #1d1d26;
      padding: 0 8px;
      word-break: break-word;
    }
  }
</style>
