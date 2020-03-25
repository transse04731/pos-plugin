<template>
  <div v-if="selectedCategoryLayout" class="category-editor">
    <!-- TODO: Passing layout columns -->

    <div class="category-editor__label">Number of Category</div>
    <input-number
        :value="orderLayout.columns" :min="1" :max="8"
        width="148"
        @input="changeOrderLayoutColumn"/>

    <div class="category-editor__label">Name</div>
    <g-text-field-bs border-color="#979797" :value="selectedCategoryLayout.name" @click="dialog.showCategoryNameKbd = true"/>

    <div class="category-editor__label">Color</div>
    <color-selector
        :value="selectedCategoryLayout.color"
        :colors="colors"
        :item-size="25"
        @input="updateCategory({color: $event})"/>

    <div class="category-editor__label">Number of Row</div>
    <input-number
        :value="cateRows" :min="6" :max="10"
        width="148"
        @input="updateCategory({rows: $event})"/>

    <div class="category-editor__label">Number of Column</div>
    <input-number
        :value="cateCols" :min="3" :max="6"
        width="148"
        @input="updateCategory({columns:$event})"/>

    <template>
      <dialog-text-filter
          label="Category name"
          :default-value="selectedCategoryLayout.name"
          v-model="dialog.showCategoryNameKbd"
          @submit="updateCategory({ name: $event}, $event)"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import ColorSelector from '../common/ColorSelector';
  import InputNumber from './InputNumber';
  import PosKeyboardFull from '../pos-shared-components/PosKeyboardFull';

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
      async updateCategory(change, forceCreate) {
        console.log('Store ', change, ' to this.selectedCategoryLayout')
        _.assign(this.selectedCategoryLayout, change)

        if (this.selectedCategoryLayout._id) {
          const qry = { 'categories._id': this.selectedCategoryLayout._id }
          const set = _.reduce(change, (result, value, key) => {
            result[`categories.$.${key}`] = value;
            return result
          }, {}) ;
          console.log('update', qry, 'set', set);
          await cms.getModel('OrderLayout').findOneAndUpdate(qry, { $set: set });
        } else {
          if (forceCreate) {
            console.log('Create new categoryLayout', this.selectedCategoryLayout)
            const orderLayout = await cms.getModel('OrderLayout').findOneAndUpdate(
                { _id: this.orderLayout._id },
                { $push: { categories: this.selectedCategoryLayout } },
                { new: true });
            this.$emit('update:orderLayout', orderLayout)
          } else {
            console.log('CategoryLayout is not existed. Skip.')
          }
        }
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
      margin-top: 16px;
      margin-bottom: 13px;
      font-weight: 700;
      font-size: 15px;
    }

    .bs-tf-wrapper {
      margin: 0;

      ::v-deep .bs-tf-input {
        color: #000;
      }
    }
  }
</style>
