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
              { title: 'Menu Layout', icon: 'radio_button_unchecked', iconType: 'small' },
              { title: 'Button Layout', icon: 'radio_button_unchecked', iconType: 'small' },
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
        //category view
        listCategories: [],
        selectedCategory: null,
        isEditCategory: false,
        //order history screen variables
        orderHistoryOrders: [],
        orderHistoryFilters: [],
        orderHistoryCurrentOrder: null,
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
            return acc + (cur.price * cur.tax / 100) * cur.quantity
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
      getAllCategories() {
        return cms.getList('Category')
      },
      getActiveProducts() {
        const products = cms.getList('Product').filter(product => product.category._id === this.activeCategory._id)
        this.activeCategoryProducts = products.map(product => ({
          ..._.omit(product, 'attributes'),
          originalPrice: product.price
        })).sort((current, next) => this.getProductGridOrder(current) - this.getProductGridOrder(next))
      },
      getProductGridOrder(product) {
        const layout = product.layouts.find(layout => this.activeCategory._id === 'Favourite'
          ? layout.favourite
          : !layout.favourite
        );
        return layout ? layout.order : 0
      },
      addProductToOrder(product) {
        if (this.currentOrder && product) {
          if (!Array.isArray(this.currentOrder.items)) this.currentOrder.items = []

          const latestProduct = _.last(this.currentOrder.items);

          if (_.isEqual(_.omit(latestProduct, 'quantity'), _.omit(product, 'quantity'))) {
            latestProduct.quantity = latestProduct.quantity + (product.quantity || 1);
          } else {
            this.currentOrder.items.push(Object.assign({}, { quantity: 1 }, product))
          }
        } else {
          this.currentOrder = { items: [Object.assign({}, { quantity: 1 }, product)] }
        }
      },
      addItemQuantity(item) {
        const itemToUpdate = this.currentOrder.items.find(i => i === item)
        itemToUpdate.quantity++
      },
      removeItemQuantity(item, all = false) {
        const itemToUpdate = this.currentOrder.items.find(i => i === item)
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
          if (changeType === 'new') newPrice = amount

          if (update) {
            this.$set(this.activeProduct, 'price', newPrice)
            this.$set(this.activeProduct, 'discount', changeType === 'new' ? originalPrice - newPrice : amount)
            this.$set(this.activeProduct, 'discountUnit', changeType === 'percentage' ? 'percent' : 'amount')
            this.$set(this.activeProduct, 'vDiscount', originalPrice - newPrice)
          }
          return newPrice
        }
      },
      queryProductsById() {
        let quantity;
        if (this.productIdQuery.includes('x')) {
          const queryStrArr = this.productIdQuery.split(' ')
          quantity = parseInt(queryStrArr[2]);
          this.productIdQuery = queryStrArr[0]
        }
        const results = cms.getList('Product').filter(item => item.id === this.productIdQuery)
        if (results) {
          this.productIdQueryResults = results.map(product => ({
            ...product,
            originalPrice: product.price,
            ...quantity && { quantity }
          }))
        }
      },
      queryProductsByName() {
        const results = cms.getList('Product')
          .filter(product => product.name.toLowerCase().includes(this.productNameQuery.trim().toLowerCase()))
        this.productNameQueryResults = results.map(product => ({
          ...product,
          originalPrice: product.price
        }))
      },
      async getSavedOrders() {
        const orderModel = cms.getModel('Order')
        this.savedOrders = await orderModel.find({ status: 'inProgress' })
      },
      async saveInProgressOrder() {
        if (!this.currentOrder || !this.currentOrder.items.length) return
        const orderModel = cms.getModel('Order')
        const orderItems = this.compactOrder(this.currentOrder.items)

        const order = {
          status: 'inProgress',
          items: orderItems.map(item => ({
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
        if (!this.currentOrder || !this.currentOrder.items.length) return
        const orderModel = cms.getModel('Order')
        const orderItems = this.compactOrder(this.currentOrder.items)

        const order = {
          status: 'paid',
          items: orderItems.map(item => ({
            ...item,
            product: item._id
          })),
          date: new Date(),
          payment: [{ type: this.currentOrder.payment || paymentMethod }],
          vSum: this.paymentTotal
        }
        if (this.currentOrder.status === 'inProgress') {
          await orderModel.findOneAndUpdate({ _id: this.currentOrder._id }, order)
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
      },
      compactOrder(products) {
        let resultArr = [];
        products.forEach(product => {
          const existingProduct = resultArr.find(r =>
            _.isEqual(_.omit(r, 'quantity'), _.omit(product, 'quantity'))
          );
          if (existingProduct) {
            existingProduct.quantity = existingProduct.quantity + product.quantity
          } else {
            resultArr.push(_.cloneDeep(product));
          }
        })
        return resultArr
      },
      async getOrderHistory() {
        const orderModel = cms.getModel('Order');
        const condition = this.orderHistoryFilters.reduce((acc, cur) => {
          if (Array.isArray(cur.value)) {
            if (cur.title === 'Amount') {
              return { ...acc, [cur.property]: { '$gte': cur.value[0], '$lte': cur.value[1] } };
            }
            if (cur.title === 'Datetime') {
              return { ...acc, [cur.property]: { '$gte': new Date(cur.value[0] + ' 00:00:00'), '$lte': new Date(cur.value[1] + ' 23:59:59') } };
            }
          } else if (cur.title === 'Staff') {
            return { ...acc, [cur.property]: { name: { '$regex': cur.value } } }
          } else {
            return { ...acc, [cur.property]: { '$regex': cur.value } }
          }
        }, { status: 'paid' });
        const orders = await orderModel.find(condition);
        this.orderHistoryOrders = orders.map(order => ({
          ...order,
          info: order.note,
          tax: order.items.reduce((acc, item) => (acc + item.tax / 100 * item.quantity * item.price), 0),
          dateTime: dayjs(order.date).format('DD.MM HH:mm'),
          amount: order.vSum ? order.vSum : order.items.reduce((acc, item) => (acc + item.price * item.quantity * (1 + item.tax / 100)), 0),
          staff: '',
          barcode: '',
          promotions: [],
        }));
        this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
      },
      async deleteOrder() {
        const orderModel = cms.getModel('Order');
        await orderModel.deleteOne({ '_id': this.orderHistoryCurrentOrder._id });
        const index = this.orderHistoryOrders.findIndex(o => o._id === this.orderHistoryCurrentOrder._id);
        this.orderHistoryOrders.splice(index, 1);
        this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
      },
      // payment screen

      //setting screen
      //category view
      async updateCategory(oldName, newName) {
        const categoryModel = cms.getModel('Category');
        if (oldName) {
          await categoryModel.deleteOne({ '_id': oldName });
        }
        if (newName) {
          await categoryModel.create({ '_id': newName });
        }
        this.listCategories = await categoryModel.find();
      },
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
        getProductGridOrder: this.getProductGridOrder,

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
        //category view
        listCategories: this.listCategories,
        selectedCategory: this.selectedCategory,
        isEditCategory: this.isEditCategory,
        updateCategory: this.updateCategory,
        //order history screen
        orderHistoryOrders: this.orderHistoryOrders,
        orderHistoryFilters: this.orderHistoryFilters,
        orderHistoryCurrentOrder: this.orderHistoryCurrentOrder,
        deleteOrder: this.deleteOrder,
        getOrderHistory: this.getOrderHistory,
      }
    }
  }
</script>

<style scoped>

</style>
