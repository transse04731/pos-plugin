<template>
  <div class="menu-setting">
    <template v-if="renderPage">
      <div class="menu-setting__title mb-3">Menu Settings</div>
      <div v-if="!categories || !categories.length" class="menu-setting--empty">
        <img src="/plugins/pos-plugin/assets/folk_knife.svg">
        <p>Menu is currently empty.</p>
        <p><span style="color: #536DFE">"Add new category"</span> to get started.</p>
        <div class="btn-add" @click="dialog.addNewCategory = true">+ Add New Category</div>
      </div>
      <div class="menu-setting__main" v-else>
        <div class="row-flex justify-end mb-2">
          <g-btn-bs background-color="#2979FF" icon="add_circle"
                    @click="dialog.addNewCategory = true">
            Add new category
          </g-btn-bs>
        </div>
        <div class="menu-setting__category">
          <div v-for="(cate, index) in categoriesViewModel" :key="index" class="mb-1">
            <div @click="toggleCollapse(cate)" class="menu-setting__category__header">
              <g-edit-view-input
                  @click.native.stop.prevent="() => {}"
                  :value="cate.name"
                  class="menu-setting__title"
                  @input="(name, cb) => changeCategoryName(cate._id, name, cb)"/>
              <g-spacer/>
              <g-icon @click.prevent.stop="openDeleteCategoryDialog(cate)" class="mr-2">mdi-trash-can-outline</g-icon>
              <g-icon v-if="showProducts[cate._id]">fas fa-chevron-up</g-icon>
              <g-icon v-else>fas fa-chevron-down</g-icon>
            </div>
            <g-expand-transition>
              <template v-if="showProducts[cate._id]">
                <div style="border-bottom: 1px solid #E0E0E0">
                  <template v-if="cate.products && cate.products.length > 0">
                    <setting-menu-item
                        v-for="(product, index) in cate.products"
                        v-bind="product"
                        :index="index"
                        :available-printers="store.printers"
                        :use-multiple-printers="store.useMultiplePrinters"
                        :key="`item_${index}`"
                        @editing="setEditing(product._id, $event)"
                        @save="updateProduct(product._id, $event)"
                        @delete="openDeleteProductDialog(product._id)"/>
                  </template>
                  <div v-else-if="!showAddNewProductPanel[cate._id]" style="height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fff;">
                    <img src="/plugins/pos-plugin/assets/no-items.svg" class="mb-2"/>
                    <div class="text-grey">No item in this group.</div>
                  </div>
                  <div v-if="showAddNewProductPanel[cate._id]">
                    <setting-new-menu-item
                        :index="cate.products.length"
                        :available-printers="store.printers"
                        :use-multiple-printers="store.useMultiplePrinters"
                        @cancel="hideAddNewProductPanelForCategory(cate)"
                        @save="addNewProduct({...$event, category: cate._id})"/>
                  </div>
                </div>
                <div style="height: 40px; background-color: #fff; display: flex; align-items: center; justify-content: center;">
                  <g-btn-bs text-color="#2979FF"
                            @click="showAddNewProductPanelForCategory(cate)"
                            :disabled="showAddNewProductPanel[cate._id]">
                    + Add New Item
                  </g-btn-bs>
                </div>
              </template>
            </g-expand-transition>
          </div>
        </div>
      </div>
      <dialog-new-category v-model="dialog.addNewCategory" @submit="addNewCategory"/>
      <dialog-delete-category v-model="dialog.deleteCategory" @confirm="deleteCategory"/>
      <dialog-delete-item v-model="dialog.deleteProduct" @confirm="deleteProduct"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash'
  import DialogNewCategory from './dialogNewCategory';
  import DialogDeleteCategory from './dialogDeleteCategory';
  export default {
    name: 'SettingMenu',
    components: { DialogDeleteCategory, DialogNewCategory },
    props: {
      store: Object,
      categories: Array,
      products: Array,
    },
    data: function () {
      return {
        showProducts: {},
        showAddNewProductPanel: {},
        editingProducts: {},
        selectedCategoryId: null,
        selectedProductId: null,
        renderPage: true,
        dialog: {
          addNewCategory: false,
          deleteCategory: false,
          deleteProduct: false,
        }
      }
    },
    created() {
      if (!this.store.printers || !this.store.printers.length) {
        alert('Navigate to "Multiple Printers" and add a printer before editing menu item')
        this.renderPage = false
      }
    },
    computed: {
      categoriesViewModel() {
        const categories = _.cloneDeep(this.categories)
        const products = _.cloneDeep(this.products)
        _.each(categories, cate => {
          cate.products = _.filter(products, p => p.category._id === cate._id)
        })
        return categories
      }
    },
    methods: {
      setEditing(productId, editing) {
        if (editing)
          this.$set(this.editingProducts, productId, editing)
        else
          this.$delete(this.editingProducts, productId)
      },
      toggleCollapse(category) {
        if (this.showProducts[category._id]) {
          const editingProduct = _.keys(this.editingProducts)
          const productsOfCate = _.map(category.products, p => p._id)
          const intersectProducts = _.intersection(editingProduct, productsOfCate)
          const canCollapse = intersectProducts.length === 0
          if (canCollapse)
            this.$delete(this.showProducts, category._id)
        } else {
          this.$set(this.showProducts, category._id, true)
        }
      },
      showAddNewProductPanelForCategory(cate) {
        this.$set(this.showAddNewProductPanel, cate._id, true)
      },
      hideAddNewProductPanelForCategory(cate) {
        this.$set(this.showAddNewProductPanel, cate._id, false)
      },
      addNewCategory(name, callback) {
        this.$emit('add-new-category', name, callback)
      },
      changeCategoryName(categoryId, name, callback) {
        this.$emit('change-category-name', categoryId, name, callback)
      },
      openDeleteCategoryDialog(cate) {
        this.dialog.deleteCategory = true
        this.selectedCategoryId = cate._id
      },
      deleteCategory() {
        this.$emit('delete-category', this.selectedCategoryId)
      },
      addNewProduct(product) {
        console.log('product', product)
        this.$emit('add-new-product', product )
        this.showAddNewProductPanel[product.category] = false
      },
      updateProduct(productId, change) {
        this.$emit('update-product', productId, change)
      },
      deleteProduct() {
        this.$emit('delete-product', this.selectedProductId)
      },
      openDeleteProductDialog(productId) {
        this.selectedProductId = productId
        this.dialog.deleteProduct = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .menu-setting {
    height: 100%;

    &__title {
      font-size: 18px;
      font-weight: 700;
    }

    &--empty {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-left: 50%;
      margin-top: 25%;
      transform: translate(-50%, -50%);

      p {
        color: #757575;
      }

      .btn-add {
        color: #536DFE;
        cursor: pointer;
        font-weight: 700;
        margin-top: 8px;
      }
    }

    &__main {
      height: calc(100% - 27px - 16px);
    }

    &__category {
      position: relative;
      height: calc(100% - 36px - 8px);
      overflow: hidden auto;
      scrollbar-width: none; // firefox

      &::-webkit-scrollbar {
        display: none;
      }

      &__header {
        position: sticky;
        top: 0;
        display: flex;
        height: 48px;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        background-color: #E1E8F0;
        cursor: pointer;

        .g-edit-view-input {
          ::v-deep .g-icon {
            font-size: 20px !important;
            margin-left: 8px;
          }
        }
      }
    }
  }
</style>
