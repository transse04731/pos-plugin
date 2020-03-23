<template>
  <div class="product-editor">
    <div class="product-editor__prop-grid">
      <div>Type:</div>
      <g-select v-model="selectedProduct.type" :items="types" @input="updateProduct({ type: $event })"/>

      <div>ID: </div>
      <g-text-field v-model="selectedProduct.id"/>

      <div>Name *:</div>
      <g-text-field v-model="selectedProduct.name" @input="updateProduct({ name: $event })"/>

      <div>Price:</div>
      <g-text-field v-model="selectedProduct.price" @input="updateProduct({ price: $event })"/>

      <g-switch :value="selectedProduct.isModifier" @change="updateProduct({ isModifier: $event })"/>
      <div>Is Modifier</div>
    </div>

    <!-- Printer -->
    <div class="product-editor__prop">
      <span class="product-editor__label">Printer</span> <g-btn @click="add2Printer">+2.Printer</g-btn>
    </div>
    <div>
      <g-grid-select mandatory multiple v-model="selectedProduct.groupPrinter" item-text="name" item-value="_id" :items="printers">
        <template #default="{ toggleSelect, item, index }">
          <g-btn style="margin-right: 4px" @click="toggleSelect(item)">{{item.name}}</g-btn>
        </template>
        <template #selected="{ toggleSelect, item, index }">
          <g-btn style="margin-right: 4px"  @click="toggleSelect(item)" background-color="blue" text-color="white">{{item.name}}</g-btn>
        </template>
      </g-grid-select>
    </div>

    <!-- -->
    <div style="display: flex">
      <div style="width: 50%">
        <div>Dine in Tax</div>
        <g-grid-select mandatory v-model="selectedProduct.tax" :items="dineInTaxes">
          <template #default="{ toggleSelect, item, index }">
            <g-btn style="margin-right: 4px" @click="toggleSelect(item)">{{item.name}}</g-btn>
          </template>
          <template #selected="{ toggleSelect, item, index }">
            <g-btn style="margin-right: 4px"  @click="toggleSelect(item)" background-color="blue" text-color="white">{{item.name}}</g-btn>
          </template>
        </g-grid-select>
      </div>

      <div style="width: 50%">
        <div>Take Away Tax</div>
        <g-grid-select mandatory multiple v-model="selectedProduct.tax2" item-text="name" item-value="value" :items="takeAwayTaxes">
          <template #default="{ toggleSelect, item, index }">
            <g-btn style="margin-right: 4px" @click="toggleSelect(item)">{{item.name}}</g-btn>
          </template>
          <template #selected="{ toggleSelect, item, index }">
            <g-btn style="margin-right: 4px"  @click="toggleSelect(item)" background-color="blue" text-color="white">{{item.name}}</g-btn>
          </template>
        </g-grid-select>
      </div>
    </div>

    <div>Color</div>
    <color-selector :value="selectedProduct.color" :colors="colors" :item-size="25" @input="updateProductLayout({ color: $event })"/>

    <div>Happy Hour</div>
    <div>14:00 - 17:00 : 20%</div>
    <div>Mo Di Mi Do Fr Sa So</div>

    <div>Category</div>
    <div>
      <g-grid-select madatory multiple v-model="selectedProduct.category" item-text="name" item-value="value" :items="categories">
        <template #default="{ toggleSelect, item, index }">
          <g-btn style="margin-right: 4px" @click="toggleSelect(item)">{{item.name}}</g-btn>
        </template>
        <template #selected="{ toggleSelect, item, index }">
          <g-btn style="margin-right: 4px"  @click="toggleSelect(item)" background-color="blue" text-color="white">{{item.name}}</g-btn>
        </template>
      </g-grid-select>
    </div>

    <template>
      <dialog-text-filter label="Product name" :default-value="selectedProduct.name" v-model="dialog.showProductNameKbd" @submit="changeProductName"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import ColorSelector from '../common/ColorSelector';

  export default {
    name: 'ProductEditor',
    components: { ColorSelector },
    props: {
      orderLayout: Object,
      selectedCategoryLayout: Object,
      selectedProductLayout: Object,
    },
    data: function () {
      const toGSelectModel = (item, index) => ({ id: index, text: item, value: item })
      return {
        colors: ['#FFFFFF', '#CE93D8', '#B2EBF2', '#C8E6C9', '#DCE775', '#FFF59D', '#FFCC80', '#FFAB91'],
        //
        types: _.map([ 'Article', 'Div.Article', 'Text', 'Menu' ], toGSelectModel),
        //
        printers: [{ id:1, name:'Bar', value: 'Bar'}, { id: 2, name: 'Kitchen', value: 'Kitchen'}, { id: 3, name: 'No Printer', value: 'No Printer' }],
        //
        dineInTaxes: [{ id: 1, name: '19%', value: '19%' }, { id: 1, name: '7%', value: '7%' }],
        takeAwayTaxes: [{ id: 1, name: '19%', value: '19%' }, { id: 1, name: '7%', value: '7%' }],
        //
        categories: [],
        //
        dialog: {
          showProductNameKbd: false,
        },
      }
    },
    computed: {
      selectedProduct() {
        return this.selectedProductLayout.product
      },
      selectedPrinters: {
        get() {
          return [
            { _id: this.selectedProduct.groupPrinter._id, name: this.selectedProduct.groupPrinter.name },
            { _id: this.selectedProduct.groupPrinter._id, name: this.selectedProduct.groupPrinter.name }
          ]
        },
        set(values) {

        }
      }
    },
    methods: {
      add2Printer() {

      },

      async changeProductName(name) {
        this.selectedProduct.name = name
        await this.updateProduct({ name })
      },

      async updateProductLayout(change) {
        if (this.selectedProductLayout._id) {
          const qry = { 'categories.products._id': this.selectedProductLayout._id }
          const set =  { $set: _.reduce(change, (result, value, key) => {
              result[`categories.products.$.${key}`] = value
              return result
            }, {}) };
          console.log('update', qry, 'set', set);
          await cms.getModel('OrderLayout').findOneAndUpdate(qry, set);
        }
        _.assign(this.selectedProductLayout, change)
      },

      async updateProduct(change) {
        // skip update db in case is empty
        if (!this.selectedProduct._id) {
          if (!this.selectedProduct.name) return;
          // add new product info: name, price, tax, tax2, category, groupPrinter, isModifier
          const product = await cms.getModel('Product').create({ ...this.selectedProduct });
          // add new product layout
          const orderLayout = await cms.getModel('OrderLayout').findOneAndUpdate(
              { 'categories._id' : this.selectedCategoryLayout._id },
              { $push: { 'categories.$.products' : { product: product._id, ..._.pick(this.selectedProductLayout, ['top', 'left', 'color']) } } },
              { new: true });
          this.$emit('update:orderLayout', orderLayout)
        } else {
          await cms.getModel('Product').findOneAndUpdate({_id: this.selectedProduct._id}, change)
        }
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
  }
</style>
