<template>
  <div v-if="selectedCategoryLayout" class="category-editor">
    <!-- TODO: Passing layout columns -->

    <div class="category-editor__label">Number of Category</div>
    <input-number
        :value="orderLayout.columns" :min="1" :max="8"
        width="148"
        @input="changeOrderLayoutColumn"/>

    <div class="category-editor__label">Name</div>
    <g-text-field :value="selectedCategoryLayout.name" @click="dialog.showCategoryNameKbd = true"/>

    <div class="category-editor__label">Color</div>
    <color-selector :value="selectedCategoryLayout.color" :colors="colors" :item-size="25" @input="changeColor"/>

    <div class="category-editor__label">Number of Row</div>
    <input-number
        :value="cateRows" :min="6" :max="10"
        width="148"
        @input="changeRows" />

    <div class="category-editor__label">Number of Column</div>
    <input-number
        :value="cateCols" :min="3" :max="6"
        width="148"
        @input="changeColumns"/>

    <template>
      <dialog-text-filter label="Category name" :default-value="selectedCategoryLayout.name" v-model="dialog.showCategoryNameKbd" @submit="updateCategoryName"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import ColorSelector from '../common/ColorSelector';
  import InputNumber from './InputNumber';
  import PosKeyboardFull from '../pos-shared-components/PosKeyboardFull';

  const defaultRows = 10
  const defaultColumns = 6

  export default {
    name: 'CategoryEditor',
    components: { PosKeyboardFull, InputNumber, ColorSelector },
    props: {
      orderLayout: Object,
      selectedCategoryLayout: Object,
    },
    data: function () {
      return {
        colors: ['#FFFFFF', '#CE93D8', '#B2EBF2', '#C8E6C9', '#DCE775', '#FFF59D', '#FFCC80', '#FFAB91'],

        dialog: {
          showCategoryNameKbd: false
        }
      }
    },
    computed: {
      cateRows(){
        return this.selectedCategoryLayout.rows
      },
      cateCols() {
        return this.selectedCategoryLayout.columns
      },
    },
    methods: {
      async changeOrderLayoutColumn(columns) {
        const result = await cms.getModel('OrderLayout').findOneAndUpdate({_id: this.orderLayout._id}, { columns }, { new: true })
        this.$emit('update:orderLayout', result)
      },
      async changeRows(rows) {
        await this.updateCategory({ rows })
      },
      async changeColumns(columns) {
        await this.updateCategory({ columns });
      },
      async changeColor(color) {
        await this.updateCategory({color})
      },
      async updateCategoryName(name) {
        // skip if name doesn't change or name of empty category is blank
        if ((name === '' && this.selectedCategoryLayout.isEmpty) || this.selectedCategoryLayout.name === name)
          return;

        this.selectedCategoryLayout.name = name;

        if (this.selectedCategoryLayout.isEmpty) {
          console.log('Add new categoryLayout', this.selectedCategoryLayout)
          delete this.selectedCategoryLayout.isEmpty;
          const orderLayout = await cms.getModel('OrderLayout').findOneAndUpdate(
              { _id: this.orderLayout._id },
              { $push: { categories: this.selectedCategoryLayout } },
              { new: true });
          this.$emit('update:orderLayout', orderLayout)
        } else {
          await this.updateCategory({ name })
        }
      },
      async updateCategory(change) {
        if (!this.selectedCategoryLayout.isEmpty) {
          const qry = { 'categories._id': this.selectedCategoryLayout._id }
          const set =  { $set: _.reduce(change, (result, value, key) => {
            result[`categories.$.${key}`] = value;
            return result
          }, {}) };
          console.log('update', qry, 'set', set);
          await cms.getModel('OrderLayout').findOneAndUpdate(qry, set);
        }
        // TODO: Show notification after each update
        // TODO: sync between db and in-memory object
        _.assign(this.selectedCategoryLayout, change)
      },
    }
  }
</script>
<style scoped lang="scss">
  .category-editor {
    padding-left: 20px;
    padding-right: 20px;

    &__label {
      color: #000;
      margin-bottom: 13px;
      margin-top: 25px;
      font-family: Muli;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
    }
  }
</style>
