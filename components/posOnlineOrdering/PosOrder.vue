<template>
  <div class="pos-order">
    <!-- -->
    <div class="pos-order__left">
      <div class="pos-order__left__header">
        <img src="/plugins/pos-plugin/assets/images/logo.png"/>
        <g-spacer/>
        <div>
          <div>
            <span style="width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; background-color: #000; border-radius: 100%; margin-right: 10px">
              <img src="/plugins/pos-plugin/assets/phone.svg"/>
            </span>
            <span style="font-size: 23px; font-weight: bold;">073 756 75 75</span>
          </div>
          
          <div style="display: flex; align-items: center">
            <span style="color: #4CAF50; margin-right: 5px;">• Open door</span>
            <span style="margin-right: 3px;">|</span>
            <g-icon>access_time</g-icon>
            <span style="color: #424242; margin-left: 3px">9:00 - 21:00</span>
          </div>
        </div>
      </div>
      <div style="font-size: 30px; font-weight: bold; margin-left: 60px">What you like?</div>
      <div style="display: flex; margin-left: 60px; margin-right: 60px; background-color: #F8F8F8; height: 64px; align-items: center">
        <span style="padding: 20px;"><img src="/plugins/pos-plugin/assets/fork.svg"/></span>
        <span style="width: 1px; height: 80%; border-left: 1px solid #000"/>
        <span v-for="(category, index) in categories"
              :key="index"
              @click="selectedCategoryId = category._id"
              :style="[{ padding: '20px' }, getCategoryStyle(category)]">
          {{ category.name }}
        </span>
      </div>
      <div style="margin-left: 60px; margin-right: 60px; padding-top: 33px;">
        <div style="font-size: 20px; font-weight: 800">{{ selectedCategory && selectedCategory.name }}</div>
        <div style=" max-height: 600px; overflow: scroll; overflow-x: hidden">
          <div v-for="(item, index) in categoryItems" :key="index">
            <menu-item v-bind="item" @menu-item-selected="addItemToOrder(item)"/>
          </div>
        </div>
      </div>
    </div>
    
    <!-- -->
    <pos-order-table/>
  </div>
</template>
<script>
  import _ from 'lodash';
  import PosOrderTable from './PosOrderTable';
  import MenuItem from './MenuItem';

  export default {
    name: 'PosOrder',
    components: { MenuItem, PosOrderTable },
    data: function () {
      return {
        categories: [],
        selectedCategoryId: null,
        selectedMenuItemId: null,
      }
    },
    computed: {
      selectedCategory() {
        return _.find(this.categories, c => c._id === this.selectedCategoryId)
      },
      selectedMenuItem() {
        return _.find(this.selectedCategory.items, item => item._id === this.selectedMenuItem)
      },
      categoryItems() {
        if (this.selectedCategory) {
          return this.selectedCategory.items
        }
      }
    },
    async created() {
      await this.loadCategories()
    },
    methods: {
      async loadCategories() {
        // TODO: or read products -> gen categories???
        const categories = await cms.getList('Category');
        const categoriesId = _.map(categories, c => c._id);
        const products = await cms.getModel('Product').find({ category: { $in: categoriesId } })
        _.each(categories, c => c.items = _.filter(products, p => p.category._id === c._id));
        const filtered = _.filter(categories, c => c.items.length > 0)
        if (filtered.length) {
          this.categories.splice(0, this.categories.length, ...filtered)
          this.selectedCategoryId = filtered[0]._id
        }
      },
      getCategoryStyle(cate) {
        const common = { cursor: 'pointer' };
        return cate._id === this.selectedCategoryId ? { fontWeight: 'bold', borderBottom: '2px solid #000', ...common } : { borderBottom: '2px solid transparent', ...common }
      },
      addItemToOrder(item) {
        this.$getService('PosOnlineOrderStore').increaseOrAddNewItems(item)
      }
    }
  }
</script>
<style scoped lang="scss">
  .pos-order {
    box-sizing: border-box;
    display: flex;
    width: 100vw;
    height: 100vh;
    
    &__left {
      flex: 1;
      
      &__header {
        margin-right: 60px;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
