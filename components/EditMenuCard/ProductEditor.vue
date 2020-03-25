<template>
  <div class="product-editor">
    <!-- Product basic info -->
    <div class="product-editor__prop-grid">
      <template v-if="types">
        <div>Type</div>
        <g-select text-field-component="GTextFieldBs" v-model="type" :items="types" @input="changeType"/>
      </template>
      <template v-if="isProductLayout">
        <div>ID </div>
        <g-text-field-bs :value="selectedProduct.id" @click="openDialogInfo('id')"/>

        <div>Name <span style="color: #FF4452">*</span></div>
        <g-text-field-bs :value="selectedProduct.name" @click="openDialogInfo('name')"/>

        <div>Price</div>
        <g-text-field-bs :value="selectedProduct.price" @click="openDialogInfo('price')"/>

        <g-switch v-model="selectedProduct.isModifier" @change="updateProduct({ isModifier: $event })" />
        <div style="font-size: 13px">Is Modifier</div>
      </template>
      <template v-else>
        <div>Name <span style="color: #ff4552">*</span></div>
        <g-text-field v-model="selectedProductLayout.text" @click="dialog.showTextKbd = true"/>
      </template>
    </div>

    <template v-if="isProductLayout">
      <!-- Printer -->
      <div v-if="!this.selectedProduct.isModifier">
        <div class="product-editor__prop">
          <span class="product-editor__label">Printer</span>
          <span v-if="showAddPrinter2" class="prop-option--printer" @click="isPrinter2Select = true">+2. Printer</span>
        </div>
        <div>
          <span v-for="(item, index) in printers"
                :key="index"
                :class="getPrinterClass(item._id)"
                @click="selectPrinter(item._id)">
            {{ item.name }}
          </span>
          <span v-if="!isPrinter2Select" :class="noPrintClasses" @click="setAsNoPrint">No Printer</span>
        </div>
      </div>

      <!-- Tax -->
      <div class="row-flex mt-2 product-editor__tax">
        <div class="col-6">
          <div class="product-editor__label">Dine in Tax</div>
          <g-grid-select mandatory v-model="selectedProduct.tax" :items="dineInTaxes" itemCols="auto">
            <template #default="{ toggleSelect, item, index }">
              <div class="prop-option"
                   @click="e => {toggleSelect(item); updateProduct({ tax: item.value })}">
                {{item.text}}
              </div>
            </template>
            <template #selected="{ toggleSelect, item, index }">
              <div class="prop-option prop-option--1"
                   @click="e => {toggleSelect(item); updateProduct({ tax: item.value })}">
                {{item.text}}
              </div>
            </template>
          </g-grid-select>
        </div>

        <div class="col-6">
          <div class="product-editor__label">Take Away Tax</div>
          <g-grid-select mandatory v-model="selectedProduct.tax2" :items="takeAwayTaxes" itemCols="auto">
            <template #default="{ toggleSelect, item, index }">
              <div class="prop-option"
                   @click="e => {toggleSelect(item); updateProduct({ tax2: item.value })}">
                {{item.text}}
              </div>
            </template>
            <template #selected="{ toggleSelect, item, index }">
              <div class="prop-option prop-option--1"
                   @click="e => {toggleSelect(item); updateProduct({ tax2: item.value })}">
                {{item.text}}
              </div>
            </template>
          </g-grid-select>
        </div>
      </div>

      <!-- Color -->
      <div class="mt-2">
        <div class="product-editor__label">Color</div>
        <color-selector :value="selectedProductLayout.color" :colors="colors" :item-size="25" @input="updateProductLayout({ color: $event })"/>
      </div>

      <!-- Happy hour -->
      <div class="mt-2" v-if="isProductLayout">
        <div class="product-editor__label">Happy Hour</div>
        <div class="prop-option i">
          <p>14:00 - 17:00 : 20%</p>
          <p>Mo Di Mi Do Fr Sa So</p>
        </div>
      </div>

      <!-- Category -->
      <div class="mt-2">
        <div class="product-editor__label">Category</div>
        <div>
          <g-grid-select madatory v-model="selectedProduct.category" item-text="name" item-value="_id" :items="categories" itemCols="auto">
            <template #default="{ toggleSelect, item, index }">
              <div class="prop-option" @click="e => { toggleSelect(item); changeCategory(item) }">{{item.name}}</div>
            </template>
            <template #selected="{ toggleSelect, item, index }">
              <div class="prop-option prop-option--1" @click="e => { toggleSelect(item); changeCategory(item) } ">{{item.name}}</div>
            </template>
          </g-grid-select>
        </div>
      </div>
    </template>
    <template>
      <dialog-product-info v-model="dialog.productInfo"
                           :product="selectedProduct"
                           :focus="dialog.focus"
                           @submit="updateProduct($event, $event.name)"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import ColorSelector from '../common/ColorSelector';
  import GGridItemSelector from '../FnButton/components/GGridItemSelector';
  import { createEmptyProductLayout } from '../posOrder/util'

  const toGSelectModel = item => ({ text: item, value: item })

  export default {
    name: 'ProductEditor',
    components: {GGridItemSelector, ColorSelector },
    props: {
      orderLayout: Object,
      selectedCategoryLayout: Object,
      selectedProductLayout: Object,
    },
    data: function () {
      return {
        colors: '#FFFFFF,#CE93D8,#B2EBF2,#C8E6C9,#DCE775,#FFF59D,#FFCC80,#FFAB91'.split(','),
        // Product layout types
        type: this.selectedProductLayout.type,
        types: _.map([ 'Article', 'Div.Article', 'Text', 'Menu' ], toGSelectModel),
        dineInTaxes: [],
        takeAwayTaxes: [],
        // indicate whether the +2. Printer button has been clicked or not
        isPrinter2Select: false,
        // GroupPrinter collection data
        printers: null,
        // Category collection data
        categories: null,
        //
        dialog: {
          productInfo: false,
          focus: 'id'
        },
      }
    },
    computed: {
      selectedProduct() {
        if (!this.selectedProductLayout.product) {
          this.$set(this.selectedProductLayout, 'product', createEmptyProductLayout())
        }
        return this.selectedProductLayout.product
      },
      showAddPrinter2() {
        return (this.selectedProduct.groupPrinter
            && !this.selectedProduct.groupPrinter2
            && !this.selectedProduct.isModifier
            && !this.selectedProduct.isNoPrint
            && !this.isPrinter2Select
        )
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
    watch: {
      selectedProductLayout(value) {
        this.type = value.type
      }
    },
    async created() {
      await this.loadPrinters()
      await this.loadCategories()
      await this.loadTaxes()
    },
    methods: {
      // categories
      async loadCategories() {
        this.categories = await cms.getModel('Category').find({})
      },
      async changeCategory(category) {
        await this.updateProduct({ category: category._id })
      },
      async loadTaxes() {
        const taxes = _.filter(cms.getList('PosSetting')[0].taxCategory, tax => !tax.hideAtEditView)
        const taxModels = _.map(taxes, tax => ({ text: `${tax.value}%`, value: tax.value }))
        this.dineInTaxes.splice(0, this.dineInTaxes.length, ...taxModels)
        this.takeAwayTaxes.splice(0, this.takeAwayTaxes.length, ...taxModels)
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
        if (this.selectedProductLayout.type === type)
          return

        if (type === 'Text') {
          if (_.includes(['Article', 'Div.Article'], this.selectedProductLayout.type)) {
            // TODO: Article -> Text
            // pseudo:
            // 1. remove linked product
            // 2. add text to product layout

          }
        } else if (_.includes(['Article', 'Div.Article'], type)) {
          if (this.selectedProductLayout.type === 'Text') {
            // TODO: Text -> Article, Div.Article
            // pseudo:
            // 1. clear product layout text
            // 2. add new product
          } else {
            // Art, Div.Art -> Div.Art, Art
            await this.updateProduct({ isDivArticle: type === 'Div.Article' })
          }
        }

        await this.updateProductLayout({type})
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
          const result = await cms.getModel('OrderLayout').findOneAndUpdate(qry, set, { arrayFilters: filter,  new: true });
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
        console.log('storing', change ,'to internal variable this.selectedProduct')
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

        this.$emit('update:orderLayout', result)
      },
      openDialogInfo(focus) {
        this.dialog.focus = focus
        this.dialog.productInfo = true
      }
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
      font-size: 15px;
      font-weight: 700;
      color: #1d1d26;
    }

    &__printer {
      padding: 4px;
      margin-right: 4px;
      border-radius: 4px;
      border: 1px solid #000;
      cursor: pointer;
    }

    &__prop {
      display: flex;
      justify-content: space-between;
      padding-bottom: 8px;
    }

    ::v-deep .g-col {
        padding: 0;
    }
  }

  .prop-option {
    display: inline-block;
    padding: 0 6px;
    margin-right: 4px;
    cursor: pointer;
    border: 1px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 2px;
    font-size: 13px;

    &--1 {
      background: #E3F2FD;
      border: 1px solid #90CAF9;
    }

    &--2 {
      background: #ffab91;
      border: 1px solid #e6724b;
    }

    &--printer {
      background: #FFFFFF;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1398);
      border-radius: 2px;
      padding: 0 8px;
      font-size: 13px;
    }
  }
</style>
