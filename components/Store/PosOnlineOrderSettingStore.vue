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
        setting: null,
        categories: null,
        products: null,
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
    async created() {
      await this.loadSetting()
    },
    methods: {
      async createSetting() {
        await cms.getModel('PosOnlineOrderSetting').create({
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
          openHours: []
        })
      },
      async loadSetting() {
        this.$set(this, 'setting', ...await cms.getModel('PosOnlineOrderSetting').findOne({}))
      },
      async changeRestaurantInfo(change) {
        await cms.getModel('PosOnlineOrderSetting').findOneAndUpdate({_id: this.setting._id}, change)
        await this.loadSetting()
      },
      async addNewOpenHours(openHour) {
        this.setting.openHours.push(openHour)
        await cms.getModel('PosOnlineOrderSetting').findOneAndUpdate({_id: this.setting._id}, { openHours: this.setting.openHours } )
        await this.loadSetting()
      },
      async updateOpenHours(_id, change) {
        const openHour = _.find(this.setting.openHours, oh => oh._id === _id)
        _.assign(openHour, change)
        await cms.getModel('PosOnlineOrderSetting').findOneAndUpdate({_id: this.setting._id}, { openHours: this.setting.openHours })
        await this.loadSetting()
      },
      async deleteOpenHour(_id) {
        const openHourIndex = _.findIndex(this.setting.openHours, oh => oh._id === _id)
        this.setting.openHours.splice(openHourIndex, 1)
        await cms.getModel('PosOnlineOrderSetting').findOneAndUpdate({ _id: this.setting._id }, { openHours: this.setting.openHours })
        await this.loadSetting()
      },
      async changeDeliveryServiceStatus(enable) {
        await cms.getModel('PosOnlineOrderSetting').findOneAndUpdate({_id: this.setting._id}, { delivery: enable })
        await this.loadSetting()
      },
      async changePickUpServiceStatus(enable) {
        await cms.getModel('PosOnlineOrderSetting').findOneAndUpdate({_id: this.setting._id}, { pickup : enable })
        await this.loadSetting()
      },
      async loadCategories() {
        this.$set(this, 'categories', await cms.getModel('Category').find({}))
      },
      async loadProducts() {
        this.$set(this, 'products', await cms.getModel('Product').find({}))
      },
      async addNewCategory(name) {
        await cms.getModel('Category').create({name})
        await this.loadCategories()
      },
      async addNewProduct(product) {
        await cms.getModel('Product').create(product)
        await this.loadProducts()
      },
      async updateProduct(_id, change) {
        await cms.getModel('Product').findOneAndUpdate({_id}, change)
        await this.loadProducts()
      },
      async removeProduct(_id) {
        await cms.getModel('Product').remove({_id})
        await this.loadProducts()
      }
    }
  }
</script>
<style scoped>
</style>
