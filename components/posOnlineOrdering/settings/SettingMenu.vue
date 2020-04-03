<template>
  <div>
    <div style="font-style: normal; font-weight: bold; font-size: 18px;" class="mb-2">Settings Menu</div>
    <!-- empty -->
    <div v-if="!categories || !categories.length">
    
    </div>
    <div v-else>
      <div style="display: flex; justify-content: flex-end" class="mb-2">
        <g-btn @click="dialog.addNewCategory = true"
               background-color="#2979FF"
               text-color="#FFF"
               flat>
          <g-icon color="#FFF" class="mr-1">add_circle</g-icon>
          Add new category
        </g-btn>
      </div>
      <!-- categories -->
      <div>
        <!-- Category -->
        <div v-for="(cate, index) in categories" :key="index" class="mb-1">
          <!-- header -->
          <div
              @click="cate.toggleCollapse()"
              style="display: flex; height: 48px; background-color: #E1E8F0; align-items: center; padding: 0 20px; cursor: pointer;">
            <div style="font-weight: bold; font-size: 18px; color: #212121;">{{cate.name}}</div>
            <g-spacer/>
            <div @click="() => {}">
              <g-icon>fas fa-chevron-down</g-icon>
            </div>
          </div>
          <!-- Menu item -->
          <template v-if="cate.showProducts">
            <div style="border-bottom: 1px solid #E0E0E0">
              <!-- product panels -->
              <template v-if="cate.products && cate.products.length"
                        v-for="(product, index) in cate.products">
                <setting-menu-item v-bind="product" :index="index"/>
              </template>
              <!-- empty product -->
              <div v-else style="height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fff;">
                <img src="/plugins/pos-plugin/assets/no-items.svg" class="mb-2"/>
                <div style="color: #9E9E9E;">No item in this group.</div>
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
              <g-btn text
                     @click="addNewProductPanel = true"
                     :disabled="addNewProductPanel"
                     style="color: #2979FF; font-weight: bold; font-size: 15px;">+ Add New Item</g-btn>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import TableExpansionRow from '../../Order/components/TableExpansionRow';
  import SettingNewMenuItem from './SettingNewMenuItem';
  import SettingMenuItem from './SettingMenuItem';
  export default {
    name: 'SettingMenu',
    components: { SettingMenuItem, SettingNewMenuItem, TableExpansionRow },
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
        }
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
      }
    }
  }
</script>
<style scoped>
</style>
