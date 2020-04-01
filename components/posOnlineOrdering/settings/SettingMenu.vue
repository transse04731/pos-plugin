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
              <template v-if="cate.products && cate.products.length">
                <div v-for="(product, index) in cate.products" :key="index"
                     style="display: grid; grid-template-columns: 40px 106px 1fr 50px; grid-gap: 15px; height: 160px; background-color: #fff; align-items: center; border-bottom: 1px solid #E0E0E0">
                  <div style="text-align: center">{{ index + 1 }}</div>
                  <img :src="product.image" style="width: 106px; height: 106px;"/>
                  <div style="height: 106px">
                    <div style="display: flex; font-weight: bold; font-size: 15px;" class="mb-3">
                      <span>{{product.name}}</span>
                      <g-spacer/>
                      <span>{{product.price | currency}}</span>
                    </div>
                    <div style="font-size: 14px; font-style: italic; color: #757575; max-width: 400px;">
                      {{product.desc}}
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: column; justify-content: flex-end; height: 106px">
                    <div style="background: #616161; border-radius: 2px; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center" class="mb-1">
                      <g-icon color="#FFF" small>edit</g-icon>
                    </div>
                    <div style="background: #616161; border-radius: 2px; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center">
                      <g-icon color="#FFF" small>delete</g-icon>
                    </div>
                  </div>
                </div>
              </template>
              <!-- empty product -->
              <div v-else style="height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #fff;">
                <img src="/plugins/pos-plugin/assets/no-items.svg" class="mb-2"/>
                <div style="color: #9E9E9E;">No item in this group.</div>
              </div>
              <!-- add new panel -->
              <div v-if="addNewProductPanel">
                <div>{{ cate.products.length }}</div>
                <img :src="product.image"/>
                <div>
                  <div>
                    <span>{{product.name}}</span>
                    <span>{{product.price | currency}}</span>
                  </div>
                  <div>
                    {{product.desc}}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Add New Product activator -->
            <div style="height: 40px; background-color: #fff; display: flex; align-items: center; justify-content: center;">
              <div @click="addNewProductPanel = true" style="color: #2979FF; font-weight: bold; font-size: 15px; cursor: pointer;">+ Add New Item</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import TableExpansionRow from '../../Order/components/TableExpansionRow';
  export default {
    name: 'SettingMenu',
    components: { TableExpansionRow },
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
                image: '/plugins/pos-plugin/assets/samples/sample.png',
                desc: 'Mozzarella cheese, Pizza Sauce, Onion, Tomato, Cheese Sauce, Meat ball, Mexico Beef',
                price: 7.99,
              },
              {
                name: 'Prime Beef',
                image: '/plugins/pos-plugin/assets/samples/sample.png',
                desc: 'Mozzarella cheese, Pizza Sauce, Onion, Tomato, Cheese Sauce, Meat ball, Mexico Beef',
                price: 7.99,
              },
              {
                name: 'Prime Beef',
                image: '/plugins/pos-plugin/assets/samples/sample.png',
                desc: 'Mozzarella cheese, Pizza Sauce, Onion, Tomato, Cheese Sauce, Meat ball, Mexico Beef',
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
    filters: {
      currency(value) {
        return '$' + value
      }
    },
    computed: {},
    methods: {
      addNewCategory() {
      
      },
      deleteProduct() {
      
      }
    }
  }
</script>
<style scoped>
</style>
