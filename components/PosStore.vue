<template>
  <fragment/>
</template>

<script>
  import _ from 'lodash'

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
        //order history screen variables
        orderHistoryOrders: [
          {
            id: '413431', dateTime: '20.08 18:05', barcode: '19082213050555', amount: 550.00, staff: 'User 1', info: '',
            products: [
              { name: 'Tomaten Suppe', quantity: 1, price: 100 },
              { name: 'Hähnchen Salat', quantity: 2, price: 100 },
              { name: 'Gebackenes Huhn', quantity: 1, price: 100 },
              { name: 'Gebackenes Huhn', quantity: 1, price: 100 },
            ],
            promotions: [
              { name: 'Discount 10%', amount: 50 }
            ],
            tax: 100
          },
          {
            id: '431413', dateTime: '20.08 20:07', barcode: '45174805917450', amount: 31.80, staff: 'Keanu Reeves', info: 'VIP',
            products: [
              { name: 'Tomaten Suppe', quantity: 3, price: 5 },
              { name: 'Hähnchen Salat', quantity: 1, price: 15 },
            ],
            promotions: [],
            tax: 1.80
          },
          {
            id: '641325', dateTime: '20.08 12:05', barcode: '51451451451451', amount: 5411.00, staff: 'Crypto', info: '',
            products: [
              { name: 'Tomaten Suppe', quantity: 1, price: 100 },
              { name: 'Hähnchen Salat', quantity: 1, price: 100 },
              { name: 'Gebackenes Huhn', quantity: 4, price: 25 },
              { name: 'Gebackenes Huhn', quantity: 5, price: 1000 },
              { name: 'Gebackenes Huhn', quantity: 1, price: 111 },
            ],
            promotions: [
              { name: 'Discount € 250', amount: 250 }
            ],
            tax: 250
          },
          {
            id: '414135', dateTime: '20.08 11:03', barcode: '68771457276871', amount: 431.00, staff: 'User 1',
            products: [
              { name: 'Tomaten Suppe', quantity: 1, price: 100 },
              { name: 'Hähnchen Salat', quantity: 2, price: 100 },
              { name: 'Gebackenes Huhn', quantity: 4, price: 25 },
              { name: 'Gebackenes Huhn', quantity: 2, price: 50 },
            ],
            promotions: [
              { name: 'Discount € 50', amount: 50 },
              { name: 'Discount 10%', amount: 50 }
            ],
            tax: 31,
            info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          },
          {
            id: '254131', dateTime: '20.08 18:05', barcode: '51656156156156', amount: 30.00, staff: 'Brad Pitt', info: '',
            products: [
              { name: 'Tomaten Suppe', quantity: 1, price: 30 },
            ],
            promotions: [],
            tax: 0
          },
          {
            id: '413556', dateTime: '20.08 08:32', barcode: '17586218671526', amount: 40.00, staff: 'Angelina Jolie', info: '',
            products: [
              { name: 'Tomaten Suppe', quantity: 1, price: 5 },
              { name: 'Hähnchen Salat', quantity: 1, price: 14 },
              { name: 'Gebackenes Huhn', quantity: 1, price: 17 },
            ],
            promotions: [],
            tax: 4
          },
          {
            id: '152413', dateTime: '20.08 18:05', barcode: '71571575261565', amount: 84.00, staff: 'User 2', info: 'No ketchup, No onion',
            products: [
              { name: 'Tomaten Suppe', quantity: 1, price: 60 },
            ],
            promotions: [],
            tax: 24
          },
        ],
        orderHistoryFilters: [],
        orderHistoryCurrentOrder: null,
        oh_amountFilter: null,
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
        if (parseFloat(this.paymentAmountTendered) > this.paymentTotal) {
          return this.paymentAmountTendered - this.paymentTotal
        }
        return 0
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
            return acc + (cur.price * cur.tax /100) * cur.quantity
          }, 0)
        }
        return 0
      },
      paymentTotal() {
        return this.paymentSubTotal + this.paymentTax
      },
      activeProduct() {
        if (this.currentOrder.items && !_.isNil(this.activeTableProduct)) {
          return this.currentOrder.items[this.activeTableProduct]
        }
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
      calculateNewPrice(changeType, amount, update = false) {
        if (this.activeProduct) {
          let originalPrice = this.activeProduct.originalPrice;
          let newPrice = originalPrice
          if (changeType === 'percentage') {
            newPrice = (originalPrice * (100 - amount)) / 100
          }
          if (changeType === 'amount') newPrice = originalPrice - amount
          if (changeType === 'new') newPrice = parseFloat(amount)

          if (update) {
            this.$set(this.activeProduct, 'price', newPrice)
            this.$set(this.activeProduct, 'discount', originalPrice - newPrice)
          }

          return newPrice
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
      async savePaidOrder(paymentMethod) {
        const orderModel = cms.getModel('Order')
        const order = {
          status: 'paid',
          items: this.currentOrder.items.map(item => ({
            ...item,
            product: item._id
          })),
          date: new Date(),
          payment: [{ type: this.currentOrder.payment || paymentMethod }],
        }
        console.log(order)
        if (this.currentOrder.status === 'inProgress') {
          await orderModel.findOneAndUpdate({_id: this.currentOrder._id}, order)
        } else {
          await orderModel.create(order)
        }
        this.activeTableProduct = null
        this.currentOrder = { items: [] }
        await this.getSavedOrders()
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
        await this.savePaidOrder('Cash')
        this.currentOrder = {
          items: []
        }
      },
      deleteOrder() {
        const index = this.orderHistoryOrders.findIndex(o => o.id === this.orderHistoryCurrentOrder.id);
        this.orderHistoryOrders.splice(index, 1);
        this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
      },
      // payment screen
    },
    mounted() {
    },
    created() {
      this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
    },
    provide() {
      return {
        loginPassword: this.loginPassword,
        //order screen
        activeProductWindow: this.activeProductWindow,
        activeTableProduct: this.activeTableProduct,
        activeProduct: this.activeProduct,
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
        calculateNewPrice: this.calculateNewPrice,
        savePaidOrder: this.savePaidOrder,
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
        sidebarData: this.sidebarData,
        //order history screen
        orderHistoryOrders: this.orderHistoryOrders,
        orderHistoryFilters: this.orderHistoryFilters,
        orderHistoryCurrentOrder: this.orderHistoryCurrentOrder,
        deleteOrder: this.deleteOrder,
      }
    }
  }
</script>

<style scoped>

</style>
