<template>
  <fragment/>
</template>

<script>
  export default {
    name: 'PosStore',
    props: {},
    data: function () {
      return {
        loginPassword: '',
        // order screen
        activeTableProduct: null,
        currentOrder: { items: [] },
        savedOrders: [],
        activeCategory: null, //todo use fn to load products?
        activeCategoryProducts: [],
        productIdQuery: '',
        productIdQueryResults: [],
        productNameQuery: '',
        productNameQueryResults: [],
        //payment screen variables
        paymentAmountTendered: 0,
        paymentTip: 0,
        lastPayment: 0,
        //settings screen
        sidebarData: [
          {
            title: 'Product', icon: 'icon-liefer_packet', svgIcon: true, badge: '3', badgeColor: '#FF9529',
            items: [
              { title: 'Articles', icon: 'radio_button_unchecked', iconType: 'small', isView: true },
              { title: 'Category', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/category' */ },
              { title: 'Layout', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          },
          { title: 'Reporting', icon: 'icon-bar_chart', svgIcon: true },
          { title: 'User', icon: 'person', isView: true /*href: '/setting/user'*/ },
          {
            title: 'Settings', icon: 'icon-cog', svgIcon: true, badge: '3', badgeColor: '#9C24AC',
            items: [
              { title: 'General', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/general'*/ },
              { title: 'Order Screen', icon: 'radio_button_unchecked', iconType: 'small' },
              { title: 'Print Template', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          },
          {
            title: 'Advanced settings', icon: 'icon-switch', svgIcon: true, badge: '3', badgeColor: '#FF4081',
            items: [
              { title: 'Company Info', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/company'*/ },
              { title: 'Payment', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/payment'*/ },
              { title: 'License', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          },
        ],
      }
    },
    domain: 'PosStore',
    computed: {
      // order screen
      paymentDiscount() {
        if (this.currentOrder.items) {
          return this.currentOrder.items.reduce((acc, cur) => {
            return cur.discount ? acc + (cur.discount * cur.quantity) : acc;
          }, 0)
        }
      },
    	paymentChange() {
    		return this.convertMoney(this.paymentAmountTendered - this.paymentTotal)
      },
      paymentSubTotal() {
        if (this.currentOrder) {
          return this.currentOrder.items.reduce((acc, cur) => {
            const price = cur.price * cur.quantity
            return acc + price
          }, 0)
        }
        return 0
      },
      paymentTax() {
        if (this.currentOrder) {
          return this.currentOrder.items.reduce((acc, cur) => {
            return acc + cur.tax * cur.quantity
          }, 0)
        }
        return 0
      },
      paymentTotal() {
        return this.paymentSubTotal + this.paymentTax
      }
    },
    methods: {
      //order screen
      async getAllCategories() {
        return await cms.getList('Category')
      },
      async getActiveProducts() {
        const productModel = cms.getModel('Product');
        const products = await productModel.find({
          category: this.activeCategory._id
        })
        this.activeCategoryProducts = products.map(product => ({
          ...product,
          originalPrice: product.price
        }))
      },
      addProductToOrder(product) {
        if (this.currentOrder && product) {
          if (!Array.isArray(this.currentOrder.items)) this.currentOrder.items = []

          const existingProduct = this.currentOrder.items.find(i => i._id === product._id);
          if (existingProduct) {
            existingProduct.quantity = existingProduct.quantity + 1;
          } else {
            this.currentOrder.items.push({ ...product, quantity: 1 })
          }
        } else {
          this.currentOrder = { items: [{ ...product, quantity: 1 }] }
        }
      },
      addItemQuantity(item) {
        const itemToUpdate = this.currentOrder.items.find(i => i._id === item._id)
        itemToUpdate.quantity++
      },
      removeItemQuantity(item, all = false) {
        const itemToUpdate = this.currentOrder.items.find(i => i._id === item._id)
        if (all || itemToUpdate.quantity - 1 === 0) {
          this.currentOrder.items.splice(this.currentOrder.items.indexOf(itemToUpdate), 1)
          this.activeTableProduct = null
        } else {
          itemToUpdate.quantity--
        }
      },
      async queryProductsById() {
        const productModel = cms.getModel('Product')
        this.productIdQueryResults = await productModel.find({ id: { $regex: `${this.productIdQuery}`, $options: 'i' } })
      },
      async queryProductsByName() {
        const productModel = cms.getModel('Product')
        this.productNameQueryResults = await productModel.find({ name: { $regex: `${this.productNameQuery}`, $options: 'i' } })
      },
      async getSavedOrders() {
        const orderModel = cms.getModel('Order')
        this.savedOrders = await orderModel.find({ status: 'inProgress' })
      },
      async saveInProgressOrder() {
        const orderModel = cms.getModel('Order')
        const order = {
          status: 'inProgress',
          items: this.currentOrder.items.map(item => ({
            ...item,
            product: item._id
          })),
          date: new Date()
        }
        if (this.currentOrder._id) {
          const existingOrder = await orderModel.findOne({ _id: this.currentOrder._id })
          if (existingOrder) {
            await orderModel.findOneAndUpdate({ _id: this.currentOrder._id }, order)
          } else {
            await orderModel.create(order)
          }
        } else {
          await orderModel.create(order)
        }
        this.currentOrder = {
          items: []
        }
        this.activeTableProduct = null
        await this.getSavedOrders()
      },
      async removeSavedOrder(order) {
        const orderModel = cms.getModel('Order')
        await orderModel.remove({ _id: order._id })
        await this.getSavedOrders()
      },
      async selectSavedOrder(order) {
        const orderModel = cms.getModel('Order')
        this.currentOrder = await orderModel.findOne({ _id: order._id })
      },
      async savePaidOrder() {
        const orderModel = cms.getModel('Order')
        const order = {
          status: 'paid',
          items: this.currentOrder.items.map(item => ({
            ...item,
            product: item._id
          })),
          date: new Date()
        }
        await orderModel.create(order)
        this.activeTableProduct = null
      },
      // order/payment
      convertMoney(val) {
        if (val && typeof (val) === 'number') {
          return val.toFixed(2)
        } else {
          return 0
        }
      },
      async quickCash() {
        this.lastPayment = +this.paymentTotal
        //todo add to order history
        await this.savePaidOrder()
        this.currentOrder = {
          items: []
        }
      }
    },
    provide() {
      return {
        loginPassword: this.loginPassword,
        //order screen
        activeProductWindow: this.activeProductWindow,
        activeTableProduct: this.activeTableProduct,
        listProducts: this.listProducts,
        convertMoney: this.convertMoney,
        //legit
        getAllCategories: this.getAllCategories,
        getActiveProducts: this.getActiveProducts,
        addItemQuantity: this.addItemQuantity,
        removeItemQuantity: this.removeItemQuantity,
        activeCategory: this.activeCategory,
        activeCategoryProducts: this.activeCategoryProducts,
        currentOrder: this.currentOrder,
        saveInProgressOrder: this.saveInProgressOrder,
        removeSavedOrder: this.removeSavedOrder,
        selectSavedOrder: this.selectSavedOrder,
        savedOrders: this.savedOrders,
        productIdQuery: this.productIdQuery,
        productIdQueryResults: this.productIdQueryResults,
        queryProductsById: this.queryProductsById,
        productNameQuery: this.productNameQuery,
        productNameQueryResults: this.productNameQueryResults,
        queryProductsByName: this.queryProductsByName,
        //payment screen
        paymentTotal: this.paymentTotal,
        paymentAmountTendered: this.paymentAmountTendered,
        paymentTip: this.paymentTip,
        paymentChange: this.paymentChange,
        paymentDiscount: this.paymentDiscount,
        paymentTax: this.paymentTax,
        paymentSubTotal: this.paymentSubTotal,
        paymentOrderDetail: this.paymentOrderDetail,
        lastPayment: this.lastPayment,
        //settings screen
        sidebarData: this.sidebarData
      }
    }
  }
</script>

<style scoped>

</style>
