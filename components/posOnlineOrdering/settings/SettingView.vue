<template>
  <div style="height: 100vh; width: 100vw; display: flex;">
    <template v-if="permissionDenied">
      {{ permissionDeniedMessage }}
    </template>
    <template v-else>
      <!-- sidebar -->
      <pos-dashboard-sidebar default-path="item.0" :items="sidebarItems" @node-selected="onNodeSelected"/>
  
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
            @delete-product="deleteProduct"/>
      </div>
    </template>
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
        permissionDenied: true,
        permissionDeniedMessage: ''
      }
    },
    async created() {
      const storeIdOrAlias = this.$route.params.storeIdOrAlias
      if (storeIdOrAlias) {
        const store = await cms.getModel('Store').findOne({alias: storeIdOrAlias})
        const storeGroups = _.map(store.groups, g => g._id)
        const user = this.$getService('PosStore').user
        let userManageThisStore = false
        if (user.role.name !== 'admin') {
          const userStoreGroups = _.map(user.storeGroups, g => g._id)
          userManageThisStore = _.intersection(storeGroups, userStoreGroups).length > 0
        }
        if (user.role.name === 'admin' || userManageThisStore) {
          this.permissionDenied = false
          this.$set(this, 'store', store)
          await this.loadCategories()
          await this.loadProducts()
        } else {
          this.permissionDenied = true;
          this.permissionDeniedMessage = 'Permission denied!'
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
      async addNewCategory(name, callback) {
        const isDuplicateName = _.find(this.categories, c => c.name === name)
        if (isDuplicateName) {
          callback && callback({ ok: false, message: 'This name is already taken!' })
        } else {
          await cms.getModel('Category').create({name, store: this.store._id})
          await this.loadCategories()
          callback && callback({ok: true})
        }
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
        await cms.getModel('Product').remove({_id: _id, store: this.store._id})
        await this.loadProducts()
      }
    }
  }
</script>
<style scoped>
</style>
