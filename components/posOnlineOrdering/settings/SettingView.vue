<template>
  <div style="height: 100vh; width: 100vw; display: flex;">
    <template v-if="permissionDenied">
      {{ permissionDeniedMessage }}
    </template>
    <template v-else>
      <!-- sidebar -->
      <pos-dashboard-sidebar default-path="item.0" :items="sidebarItems" @node-selected="onNodeSelected"/>
  
      <!-- content -->
      <div style="background-color: #F4F7FB; flex: 1; padding: 50px 5%">
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
            :printers="printers"
            @add-new-category="addNewCategory"
            @change-category-name="changeCategoryName"
            @delete-category="deleteCategory"
            @add-new-product="addNewProduct"
            @update-product="updateProduct"
            @delete-product="deleteProduct"/>
        <device v-if="view === 'setting-device'" :store="store"/>
        <delivery-fee v-if="view === 'setting-delivery-fee'" :store="store" @update="updateStore"/>
        <multiple-printer v-if="view === 'setting-multiple-printer'" :store="store" @update="updateStore"/>
      </div>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import RestaurantInformation from './RestaurantInformation';
  import ServiceAndOpenHours from './ServiceAndOpenHours';
  import SettingMenu from './SettingMenu';
  import DeliveryFee from "./DeliveryFee";
  import MultiplePrinter from "./MultiplePrinter";
  export default {
    name: 'SettingView',
    components: {MultiplePrinter, DeliveryFee, SettingMenu, ServiceAndOpenHours, RestaurantInformation},
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
          {title: 'Device', icon: 'icon-setting-device', onClick: () => this.view = 'setting-device'},
          {title: 'Delivery Fee', icon: 'icon-setting-delivery', onClick: () => this.view = 'setting-delivery-fee'},
          {title: 'Multiple Printer', icon: 'icon-setting-multiple', onClick: () => this.view = 'setting-multiple-printer'},
        ],
        view: 'restaurant-info',
        sidebar: '',
        //
        store: null,
        categories: null,
        products: null,
        permissionDenied: true,
        permissionDeniedMessage: '',
        printers: null
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
          await this.loadPrinters()
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
        console.log('update store', change)
        await cms.getModel('Store').updateOne({_id: this.store._id}, change)
        await this.loadStore()
      },
      
      // printer
      async loadPrinters() {
        const printers = _.map(await cms.getModel('GroupPrinter').find({ store: this.store._id }), printer => ({ text: printer.name, value: printer._id }))
        this.$set(this, 'printers', printers)
      },
      
      // categories
      async loadCategories() {
        this.$set(this, 'categories', await cms.getModel('Category').find({ store: this.store._id }, { store: 0 }))
      },
      async addNewCategory(name, callback) {
        if (_.trim(name) === "") {
          callback && callback({ ok: false, message: 'Category name is missing!' })
          return
        }
        
        const isDuplicateName = _.find(this.categories, c => c.name === name)
        if (isDuplicateName) {
          callback && callback({ ok: false, message: 'This name is already taken!' })
          return
        }

        await cms.getModel('Category').create({name, store: this.store._id})
        await this.loadCategories()
        callback && callback({ok: true})
      },
      async changeCategoryName(_id, name, callback) {
        if (_.trim(name) === "") {
          alert('Category name is missing')
          callback && callback(false)
          return
        }
        
        const category = _.find(this.categories, c => c._id === _id)
        if (category.name === name)
          return
        
        const isDuplicateName = _.find(this.categories, c => c.name === name && c._id !== _id)
        if (isDuplicateName) {
          alert('This name is already taken!')
          callback && callback(false)
          return
        }
        
        await cms.getModel('Category').updateOne({_id}, { name })
        await this.loadCategories()
        callback && callback(true)
      },
      
      async deleteCategory(_id) {
        await cms.getModel('Product').remove({ category: _id })
        await cms.getModel('Category').remove({_id: _id})
        await this.loadCategories()
        await this.loadProducts()
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
