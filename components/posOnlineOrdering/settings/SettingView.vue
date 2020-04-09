<template>
  <div style="height: 100vh; width: 100vw; display: flex;">
    <!-- sidebar -->
    <pos-dashboard-sidebar default-path="items.0" :items="sidebarItems" @node-selected="onNodeSelected"/>

    <!-- content -->
    <div style="background-color: #F4F7FB; flex: 1; padding: 50px 10%">
      <restaurant-information
          v-if="view === 'restaurant-info'"
          :store="store"
          @update="updateStore"/>
      <service-and-open-hours
          v-if="view === 'service-and-open-hours'"
          :store="store"
          @update="updateStore"/>
      <setting-menu
          v-if="view === 'settings-menu'"
          :store="store"
          :categories="categories"
          :products="products"
          @add-new-category="addNewCategory"
          @add-new-product="addNewProduct"
          @update-product="updateProduct"
          @delete-product="deleteProduct"
      />
    </div>
  </div>
</template>
<script>
  import _ from 'lodash';
  import RestaurantInformation from './RestaurantInformation';
  import ServiceAndOpenHours from './ServiceAndOpenHours';
  import SettingMenu from './SettingMenu';
  export default {
    name: 'SettingView',
    components: {SettingMenu, ServiceAndOpenHours, RestaurantInformation},
    data: function () {
      return {
        sidebarItems: [
          {title: 'Basics', icon: 'airplay', onClick: () => this.view = 'restaurant-info'},
          {
            title: 'Service & Open hours',
            icon: 'mdi-file-document-outline',
            onClick: () => this.view = 'service-and-open-hours'
          },
          {title: 'Menu', icon: 'filter_list', onClick: () => this.view = 'settings-menu'},
        ],
        view: 'restaurant-info',
        sidebar: '',
        //
        store: null,
        categories: null,
        products: null,
      }
    },
    async created() {
      const storeIdOrAlias = this.$route.params.storeIdOrAlias
      if (storeIdOrAlias) {
        // try to find by id
        const store = await cms.getModel('Store').findOne({alias: storeIdOrAlias})
        const storeGroups = _.map(store.groups, g => g._id)
        const userStoreGroups = _.map(this.$getService('PosStore').user.storeGroups, g => g._id)
        const theUserManageThisStore = _.uniq(storeGroups, userStoreGroups).length > 0
        if (theUserManageThisStore) {
          this.$set(this, 'store', store)
          await this.loadCategories()
          await this.loadProducts()
        } else {
          prompt('Permission denied!')
        }
      }
    },
    methods: {
      onNodeSelected(node) {
        node.onClick && node.onClick.bind(this)();
      },
      async loadStore() {
        this.$set(this, 'store', await cms.getModel('Store').findOne({_id: this.store._id}))
      },
      async updateStore(change) {
        await cms.getModel('Store').updateOne({_id: this.store._id}, change)
        await this.loadStore()
      },
      
      // categories
      async loadCategories() {
        this.$set(this, 'categories', await cms.getModel('Category').find({ store: this.store._id }, { store: 0 }))
      },
      async addNewCategory(name) {
        await cms.getModel('Category').create({name, store: this.store._id})
        await this.loadCategories()
      },
      
      // products
      async loadProducts() {
        this.$set(this, 'products', await cms.getModel('Product').find({ store: this.store._id }, { store: 0 }))
      },
      async addNewProduct(product) {
        await cms.getModel('Product').create({...product, store: this.store._id})
        await this.loadProducts()
      },
      async updateProduct(_id, change) {
        await cms.getModel('Product').updateOne({_id, store: this.store._id}, change)
        await this.loadProducts()
      },
      async deleteProduct(_id) {
        if (!_id) return
        await cms.getModel('Product').remove({_id, store: this.store._id})
        await this.loadProducts()
      }
    }
  }
</script>
<style scoped>
</style>
