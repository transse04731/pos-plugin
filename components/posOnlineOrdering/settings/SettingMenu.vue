<template>
  <div class="menu-setting">
    <div class="menu-setting__title mb-3">Settings Menu</div>
    <!-- empty -->
    <div v-if="!categories || !categories.length" class="menu-setting--empty">
      <img src="/plugins/pos-plugin/assets/folk_knife.svg">
      <p>Menu is currently empty.</p>
      <p><span style="color: #536DFE">"Add new category"</span> to get started.</p>
      <div class="btn-add" @click="addNewCategory">+ Add New Category</div>
    </div>
    <div class="menu-setting__main" v-else>
      <div class="row-flex justify-end mb-2">
        <g-btn-bs background-color="#2979FF" icon="add_circle"
          @click="dialog.addNewCategory = true">
          Add new category
        </g-btn-bs>
      </div>
      <!-- categories -->
      <div class="menu-setting__category">
        <!-- Category -->
        <div v-for="(cate, index) in categories" :key="index" class="mb-1">
          <!-- header -->
          <div @click="cate.toggleCollapse()" class="menu-setting__category__header">
            <div class="menu-setting__title">{{cate.name}}</div>
            <g-icon v-if="cate.showProducts">fas fa-chevron-up</g-icon>
            <g-icon v-else>fas fa-chevron-down</g-icon>
          </div>
          <!-- Menu item -->
          <template v-if="cate.showProducts">
            <div style="border-bottom: 1px solid #E0E0E0">
              <!-- product panels -->
              <template v-if="cate.products && cate.products.length > 0">
                <setting-menu-item v-for="(product, index) in cate.products" v-bind="product" :index="index" @delete="openDeleteDialog($event)"/>
              </template>
              <!-- empty product -->
              <div v-else style="height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fff;">
                <img src="/plugins/pos-plugin/assets/no-items.svg" class="mb-2"/>
                <div class="text-grey">No item in this group.</div>
              </div>
              <!-- add new panel -->
              <div v-if="addNewProductPanel">
                <setting-new-menu-item
                    :index="cate.products.length"
                    @cancel="addNewProductPanel = false"
                    @save="addNewProduct($event)"/>
              </div>
            </div>
            
            <!-- Add New Product activator -->
            <div style="height: 40px; background-color: #fff; display: flex; align-items: center; justify-content: center;">
              <g-btn-bs text-color="#2979FF"
                     @click="addNewProductPanel = true"
                     :disabled="addNewProductPanel">
                + Add New Item
              </g-btn-bs>
            </div>
          </template>
        </div>
      </div>
    </div>
    <dialog-delete-item v-model="dialog.deleteProduct" @confirm="deleteProduct"/>
  </div>
</template>
<script>
  export default {
    name: 'SettingMenu',
    props: {},
    data: function () {
      return {
        categories: [
          {
            name: "Pizza",
            showProducts: false,
            toggleCollapse: function() {
              this.showProducts = !this.showProducts
            },
            products: [
              {
                name: 'Prime Beef',
                image: '/plugins/pos-plugin/assets/images/product.png',
                desc: 'Mozzarella cheese, Pizza Sauce, Onion, Tomato, Cheese Sauce, Meat ball, Mexico Beef',
                tax: 7,
                price: 7.99,
              },
              {
                name: 'Prime Beef',
                image: '/plugins/pos-plugin/assets/images/product.png',
                desc: 'Mozzarella cheese, Pizza Sauce, Onion, Tomato, Cheese Sauce, Meat ball, Mexico Beef',
                tax: 7,
                price: 7.99,
              },
              {
                name: 'Prime Beef',
                image: '/plugins/pos-plugin/assets/images/product.png',
                desc: 'Mozzarella cheese, Pizza Sauce, Onion, Tomato, Cheese Sauce, Meat ball, Mexico Beef',
                tax: 7,
                price: 7.99,
              }
            ]
          },
          {
            name: "Drink",
            showProducts: false,
            toggleCollapse: function() {
              this.showProducts = !this.showProducts
            },
            products: []
          }
        ],
        addNewProductPanel: false,
        dialog: {
          addNewCategory: false,
          deleteProduct: false,
        },
        selectToDeleteItem: null,
      }
    },
    computed: {},
    methods: {
      addNewCategory() {
      
      },
      addNewProduct({ name, desc, price, tax }) {
        // TODO: Add new product
        // extra info: restaurent id
      },
      deleteProduct() {
        //
      },
      openDeleteDialog(item) {
        this.selectToDeleteItem = item
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
      margin-top: 50%;
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
      height: calc(100% - 36px - 8px);
      overflow: hidden scroll;

      &__header {
        display: flex;
        height: 48px;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        background-color: #E1E8F0;
        cursor: pointer;
      }
    }
  }
</style>
