<template>

</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'PosOnlineOrderSettingStore',
    domain: 'PosOnlineOrderSettingStore',
    props: {},
    data: function () {
      return {
        storeId: null,
        setting: null,
        categories: null,
        products: null,
      }
    },
    async created() {
      console.log('create setting store')
      const storeIdOrAlias = this.$route.params.storeIdOrAlias
      if (storeIdOrAlias) {
        // try to find by id
        const store = await cms.getModel('Store').findOne({alias: storeIdOrAlias})
        const storeGroups = _.map(store.groups, g => g._id)
        const userStoreGroups = _.map(this.$getService('PosStore').user.storeGroups, g => g._id)
        const userManageStore = _.unique(storeGroups, userStoreGroups).length > 0
        if (userManageStore) {
          this.storeId = store._id
          await this.loadSetting()
          await this.loadCategories()
          await this.loadProducts()
        } else {
          prompt('Permission denied!')
        }
      }
    },
    computed: {
      menuModel() {
        const categories = _.cloneDeep(this.categories)
        const products = _.cloneDeep(this.products)
        // TODO: Collapse, expand state
        _.each(categories, cate => {
          cate.products = _.filter(products, p => p.category._id === cate._id)
        })
      }
    },
    methods: {
      async createSetting() {
        await cms.getModel('Store').create({
          name: '',
          phone: '',
          address: '',
          zipCode: '',
          townCity: '',
          country: '',
          currency: '',
          timeZone: '',
          logoImageSrc: '',
          orderHeaderImageSrc: '',
          // services
          delivery: false,
          pickup: false,
          // open hours
          openHours: [],
          store: this.storeId
        })
      },
      async loadSetting() {
        const setting = await cms.getModel('Store').findOne({ store: this.storeId })
        this.$set(this, 'setting', setting)
      },
      async changeRestaurantInfo(change) {
        await cms.getModel('Store').findOneAndUpdate({_id: this.setting._id}, change)
        await this.loadSetting()
      },
      async addNewOpenHours(openHour) {
        this.setting.openHours.push(openHour)
        await cms.getModel('Store').findOneAndUpdate({_id: this.setting._id}, { openHours: this.setting.openHours } )
        await this.loadSetting()
      },
      async updateOpenHours(_id, change) {
        const openHour = _.find(this.setting.openHours, oh => oh._id === _id)
        _.assign(openHour, change)
        await cms.getModel('Store').findOneAndUpdate({_id: this.setting._id}, { openHours: this.setting.openHours })
        await this.loadSetting()
      },
      async deleteOpenHour(_id) {
        const openHourIndex = _.findIndex(this.setting.openHours, oh => oh._id === _id)
        this.setting.openHours.splice(openHourIndex, 1)
        await cms.getModel('Store').findOneAndUpdate({ _id: this.setting._id }, { openHours: this.setting.openHours })
        await this.loadSetting()
      },
      async changeDeliveryServiceStatus(enable) {
        await cms.getModel('Store').findOneAndUpdate({_id: this.setting._id}, { delivery: enable })
        await this.loadSetting()
      },
      async changePickUpServiceStatus(enable) {
        await cms.getModel('Store').findOneAndUpdate({_id: this.setting._id}, { pickup : enable })
        await this.loadSetting()
      },
      async loadCategories() {
        this.$set(this, 'categories', await cms.getModel('Category').find({ store: this.storeId }))
      },
      async loadProducts() {
        this.$set(this, 'products', await cms.getModel('Product').find({ store: this.storeId }))
      },
      async addNewCategory(name) {
        await cms.getModel('Category').create({name, store: this.storeId})
        await this.loadCategories()
      },
      async addNewProduct(product) {
        await cms.getModel('Product').create({...product, store: this.storeId})
        await this.loadProducts()
      },
      async updateProduct(_id, change) {
        await cms.getModel('Product').findOneAndUpdate({_id, store: this.storeId}, change)
        await this.loadProducts()
      },
      async removeProduct(_id) {
        await cms.getModel('Product').remove({_id, store: this.storeId})
        await this.loadProducts()
      }
    },
    provide() {
      return {
        createSetting: this.createSetting,
        loadSetting: this.loadSetting,
        changeRestaurantInfo: this.changeRestaurantInfo,
        addNewOpenHours: this.addNewOpenHours,
        updateOpenHours: this.updateOpenHours,
        deleteOpenHour: this.deleteOpenHour,
        changeDeliveryServiceStatus: this.changeDeliveryServiceStatus,
        changePickUpServiceStatus: this.changePickUpServiceStatus,
        addNewCategory: this.addNewCategory,
        addNewProduct: this.addNewProduct,
        updateProduct: this.updateProduct,
        removeProduct: this.removeProduct,
      }
    }
  }
</script>
<style scoped>
</style>
