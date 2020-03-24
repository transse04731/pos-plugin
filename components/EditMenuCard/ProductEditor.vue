<template>
  <div class="product-editor">
    <!-- Product basic info -->
    <div class="product-editor__prop-grid">
      <template v-if="types">
        <div>Type:</div>
        <g-select v-model="type" :items="types"/>
      </template>
      <template v-if="isProductLayout">
        <div>ID: </div>
        <g-text-field v-model="selectedProduct.id"/>

        <div>Name *:</div>
        <g-text-field v-model="selectedProduct.name" @click="dialog.showProductNameKbd = true"/>

        <div>Price:</div>
        <g-text-field v-model="selectedProduct.price" @input="updateProduct({ price: $event })" />

        <g-switch :value="selectedProduct.isModifier" @change="updateProduct({ isModifier: $event })" />
        <div>Is Modifier</div>
      </template>
      <template v-else>
        <div>Name *:</div>
        <g-text-field v-model="selectedProductLayout.text" @click="dialog.showTextKbd = true"/>
      </template>
    </div>
    <template v-if="isProductLayout">
      <!-- Printer -->
      <div>
        <div class="product-editor__prop">
          <span class="product-editor__label">Printer</span>
          <span v-if="showAddPrinter2" class="prop-option" @click="isPrinter2Select = true">+2. Printer</span>
        </div>
        <div>
          <span v-for="(item, index) in printers"
                :key="index"
                :class="getPrinterClass(item._id)"
                @click="selectPrinter(item._id)">
            {{ item.name }}
          </span>
          <span v-if="!isPrinter2Select" :class="itemNoteClasses" @click="setAsItemNote">Note Item</span>
          <span v-if="!isPrinter2Select" :class="noPrintClasses" @click="setAsNoPrint">No Print</span>
        </div>
      </div>

      <!-- Tax -->
      <div style="display: flex">
        <div style="width: 50%">
          <div>Dine in Tax</div>
          <g-grid-select mandatory v-model="selectedProduct.tax" :items="dineInTaxes">
            <template #default="{ toggleSelect, item, index }">
              <div class="prop-option" @click="toggleSelect(item)">{{item.name}}</div>
            </template>
            <template #selected="{ toggleSelect, item, index }">
              <div class="prop-option prop-option--1" @click="toggleSelect(item)">{{item.name}}</div>
            </template>
          </g-grid-select>
        </div>

        <div style="width: 50%">
          <div>Take Away Tax</div>
          <g-grid-select mandatory v-model="selectedProduct.tax2" :items="takeAwayTaxes">
            <template #default="{ toggleSelect, item, index }">
              <div class="prop-option" @click="toggleSelect(item)">{{item.name}}</div>
            </template>
            <template #selected="{ toggleSelect, item, index }">
              <div class="prop-option prop-option--1" @click="toggleSelect(item)">{{item.name}}</div>
            </template>
          </g-grid-select>
        </div>
      </div>

      <!-- Color -->
      <div>
        <div>Color</div>
        <color-selector :value="selectedProduct.color" :colors="colors" :item-size="25" @input="updateProductLayout({ color: $event })"/>
      </div>

      <!-- Happy hour -->
      <div v-if="isProductLayout">
        <div>Happy Hour</div>
        <div>14:00 - 17:00 : 20%</div>
        <div>Mo Di Mi Do Fr Sa So</div>
      </div>

      <!-- Category -->
      <div>
        <div>Category</div>
        <div>
          <g-grid-select madatory multiple v-model="selectedProduct.category" item-text="name" item-value="value" :items="categories">
            <template #default="{ toggleSelect, item, index }">
              <g-btn style="margin-right: 4px" @click="toggleSelect(item), changeCategory(item)">{{item.name}}</g-btn>
            </template>
            <template #selected="{ toggleSelect, item, index }">
              <g-btn style="margin-right: 4px"  @click="toggleSelect(item), changeCategory(item)" background-color="blue" text-color="white">{{item.name}}</g-btn>
            </template>
          </g-grid-select>
        </div>
      </div>
    </template>
    <template>
      <dialog-text-filter
          v-if="isProductLayout"
          label="Product name"
          :default-value="selectedProduct.name"
          v-model="dialog.showProductNameKbd"
          @submit="updateProduct({ name: $event }, $event)"/>
      <dialog-text-filter
          v-else
          label="Text"
          :default-value="selectedProductLayout.text"
          v-model="dialog.showTextKbd"
          @submit="updateProductLayout({ text: $event, type: 'Text' }, $event)"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import ColorSelector from '../common/ColorSelector';
  import GGridItemSelector from '../FnButton/components/GGridItemSelector';
  import TableExpansionRow from '../Order/components/TableExpansionRow';
  import { createEmptyProductLayout } from '../posOrder/util'

  const toGSelectModel = item => ({ text: item, value: item })

  export default {
    name: 'ProductEditor',
    components: { TableExpansionRow, GGridItemSelector, ColorSelector },
    props: {
      orderLayout: Object,
      selectedCategoryLayout: Object,
      selectedProductLayout: Object,
    },
    data: function () {
      return {
        colors: '#FFFFFF,#CE93D8,#B2EBF2,#C8E6C9,#DCE775,#FFF59D,#FFCC80,#FFAB91'.split(','),
        // Product layout types
        types: _.map([ 'Article', 'Div.Article', 'Text', 'Menu' ], toGSelectModel),
        dineInTaxes: [{ text: '19%', value: 19 }, { text: '7%', value: 7 }],
        takeAwayTaxes: [{ text: '19%', value: 19 }, { text: '7%', value: 7 }],
        // indicate whether the +2. Printer button has been clicked or not
        isPrinter2Select: false,
        // GroupPrinter collection data
        printers: null,
        // Category collection data
        categories: null,
        //
        dialog: {
          showProductNameKbd: false,
          showTextKbd: false,
        },
      }
    },
    computed: {
      selectedProduct() {
        return this.selectedProductLayout.product
      },
      showAddPrinter2() {
        return (this.selectedProduct.groupPrinter
            && !this.selectedProduct.groupPrinter2
            && !this.selectedProduct.isItemNote
            && !this.selectedProduct.isNoPrint
            && !this.isPrinter2Select
        )
      },
      type: {
        get() {
          return this.selectedProductLayout.type
        },
        set(value) {
          this.changeType(value)
        }
      },
      isProductLayout() {
        return this.type !== 'Text'
      },
      noPrintClasses() {
        return {
          'prop-option': true,
          'prop-option--1': this.selectedProduct.isNoPrint,
        }
      },
      itemNoteClasses() {
        return {
          'prop-option': true,
          'prop-option--1': this.selectedProduct.isItemNote,
        }
      }
    },
    async created() {
      await this.loadPrinters()
      await this.loadCategories()
    },
    methods: {
      // categories
      async loadCategories() {
        this.categories = await cms.getModel('Category').find({})
      },
      async changeCategory(category) {
        await this.updateProduct({ category: category._id })
      },

      // printers
      async loadPrinters() {
        this.printers = await cms.getModel('GroupPrinter').find({})
      },
      getPrinterClass(printer) {
        return {
          'prop-option': true,
          'prop-option--1': this.selectedProduct.groupPrinter && this.selectedProduct.groupPrinter._id === printer,
          'prop-option--2': this.selectedProduct.groupPrinter2 && this.selectedProduct.groupPrinter2._id === printer,
        }
      },
      async selectPrinter(id) {
        const printer = _.find(this.printers, p => p._id === id)
        const change = {
          isItemNote: false,
          isNoPrint: false
        }
        if (this.isPrinter2Select) {
          if (this.selectedProduct.groupPrinter !== printer) {
            change.groupPrinter2 = printer;
          }
          this.isPrinter2Select = false;
        } else {
          change.groupPrinter = printer;
          change.groupPrinter2 = null;
        }
        await this.updateProduct(change)
      },
      async setAsItemNote() {
        await this.updateProduct({
          groupPrinter: null,
          groupPrinter2: null,
          isItemNote: true,
          isNoPrint: false,
        })
      },
      async setAsNoPrint() {
        await this.updateProduct({
          groupPrinter: null,
          groupPrinter2: null,
          isNoPrint: true,
          isItemNote: false
        });
      },
      // end printers

      // ----
      async changeType(type) {
        if (!this.selectedProductLayout._id)
          return

        if (this.selectedProductLayout.type === type)
          return

        if (type === 'Text') {
          if (['Article', 'Div.Article'].includes(this.selectedProductLayout.type)) {
            // TODO: Article -> Text
            // pseudo:
            // 1. remove linked product
            // 2. add text to product layout
            await this.updateProductLayout({type})
          }
        } else if (['Article', 'Div.Article'].includes(type)) {
          if (this.selectedProductLayout.type === 'Text') {
            // TODO: Text -> Article, Div.Article
            // pseudo:
            // 1. clear product layout text
            // 2. add new product
            await this.updateProductLayout({type: type, product: createEmptyProductLayout()})
          } else {
            // Art, Div.Art -> Div.Art, Art
            await this.updateProduct({ isDivArticle: type === 'Div.Article' })
          }
        }
      },

      // update color, update text
      async updateProductLayout(change, forceCreate) {
        console.log('Store change into this.selectedProductLayout')
        _.assign(this.selectedProductLayout, change)

        if (this.selectedProductLayout._id) {
          console.log('UpdateProductLayout', change)
          console.log('Update product layout with id', this.selectedProductLayout._id)
          const qry = { 'categories.products._id': this.selectedProductLayout._id }
          const set =  { $set: _.reduce(change, (result, value, key) => {
              result[`categories.$[cate].products.$[product].${key}`] = value
              return result
            }, {}) };
          const filter = [{ 'cate._id': this.selectedCategoryLayout._id }, { 'product._id': this.selectedProductLayout._id }]
          await cms.getModel('OrderLayout').findOneAndUpdate(qry, set, { arrayFilters: filter,  new: true });
        } else {
          if (forceCreate) {
            await this.createNewProductLayout(null, change)
          } else {
            console.log('ProductLayout is not existed yet. skipped')
          }
        }
      },

      // update ...
      async updateProduct(change, forceCreate) {
        console.log('storing change to internal variable this.selectedProduct')
        _.assign(this.selectedProduct, change)

        if (this.selectedProduct._id) {
          console.log('updateProduct', change)
          await cms.getModel('Product').findOneAndUpdate({_id: this.selectedProduct._id}, change)
        } else {
          if (forceCreate) {
            console.log('Create new Product')
            const product = await cms.getModel('Product').create({ ...this.selectedProduct });
            console.log('Create new ProductLayout linked to Product with id: ', product._id)
            await this.createNewProductLayout(product._id)
          } else {
            console.log('Product is not existed yet. skipped')
          }
        }
      },

      async createNewProductLayout(productId, extraInfo) {
        const productLayout = {
          product: productId,
          ..._.pick(this.selectedProductLayout, ['top', 'left', 'color', 'type', 'text']),
          ...extraInfo
        }
        const result = await cms.getModel('OrderLayout').findOneAndUpdate(
            { 'categories._id' : this.selectedCategoryLayout._id },
            { $push: { 'categories.$.products' : productLayout } },
            { new: true });
        // TODO: BUG: new orderLayout has been emitted but the result doesn't change in GUI
        this.$emit('update:orderLayout', result)
      },
    }
  }
</script>
<style scoped lang="scss">
  .product-editor {
    padding-left: 20px;
    padding-right: 20px;

    &__prop-grid {
      display: grid;
      grid-template-columns: 60px 1fr;
      grid-auto-rows: 50px;
      align-items: center;
    }

    &__label {
      height: 30px;
      line-height: 30px;
      margin-bottom: 5px;
    }

    &__printer {
      padding: 4px;
      margin-right: 4px;
      border-radius: 4px;
      border: 1px solid #000;
      cursor: pointer;
    }
  }

  .prop-option {
    display: inline-block;
    padding-left: 4px;
    padding-right: 4px;
    cursor: pointer;
    border: 1px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 2px;

    &--1 {
      background: #E3F2FD;
      border: 1px solid #90CAF9;
    }

    &--2 {
      background: #ffab91;
      border: 1px solid #e6724b;
    }

  }
</style>
