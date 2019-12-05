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
        //article view
        productFilters: [],
        listProducts: [],
        selectedProduct: [],
        totalProducts: null,
        productPagination: { limit: 10, currentPage: 1 },
        //order history screen variables
        orderHistoryOrders: [],
        orderHistoryFilters: [],
        orderHistoryCurrentOrder: null,
        //article screen
        articleSelectedColor: null,
        articleSelectedProductButton: null,
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
        this.activeCategoryProducts = products.sort((current, next) => this.getProductGridOrder(current) - this.getProductGridOrder(next))
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
      //order history
      updateOrderHistoryFilter(filter) {
        const index = this.orderHistoryFilters.findIndex(f => f.title === filter.title);
        if(index > -1)
          this.orderHistoryFilters.splice(index, 1, filter);
        else
          this.orderHistoryFilters.unshift(filter);
      },
      async getOrderHistory() {
        const orderModel = cms.getModel('Order');
        const condition = this.orderHistoryFilters.reduce((acc, filter) => ({...acc, ...filter['condition']}), { status: 'paid' });
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
      //article view
      updateProductFilters (filter) {
        const index = this.productFilters.findIndex(f => f.title === filter.title);
        if(index > -1)
          this.productFilters.splice(index, 1, filter);
        else
          this.productFilters.unshift(filter);
      },
      async getListProducts() {
        const productModel = cms.getModel('Product');
        const condition = this.productFilters.reduce((acc, filter) => ({...acc, ...filter['condition']}), {});
        const {limit, currentPage} = this.productPagination;
        const products = await productModel.find(condition).skip(limit * (currentPage - 1)).limit(limit);
        this.listProducts =  products.map(p => ({
          _id: p._id,
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category._id,
          plastic: p.plastic,
          barcode: p.barcode
        }))
      },
      async getTotalProducts() {
        const productModel = cms.getModel('Product');
        const condition = this.productFilters.reduce((acc, filter) => ({...acc, ...filter['condition']}), {});
        this.totalProducts = await productModel.countDocuments(condition);
      },
      async deleteSelectedProducts() {
        const productModel = cms.getModel('Product');
        if(this.selectedProduct && this.selectedProduct.length > 0) {
          await productModel.deleteMany({'_id': {"$in": this.selectedProduct}});
        }
        await this.getListProducts();
        await this.getTotalProducts();
        this.selectedProduct = [];
      },

      //article screen
      selectArticle(item) {
        if(this.articleSelectedProductButton && item._id === this.articleSelectedProductButton._id) {
          this.articleSelectedProductButton = null;
          this.articleSelectedColor = null;
          return;
        }
        this.articleSelectedProductButton = item;
        this.articleSelectedColor = this.articleSelectedProductButton.layouts[0].color;
      },

      async setSelectedArticleColor() {
        if (!this.articleSelectedColor || !this.articleSelectedProductButton) {
          return
        }

        //Update to db
        const productModel = cms.getModel('Product')
        const layoutID = this.articleSelectedProductButton.layouts[0]._id;
        //Update current product
        let foundItem = this.activeCategoryProducts.find((item) => item._id === this.articleSelectedProductButton._id);
        if (foundItem) {
          foundItem.layouts[0].color = this.articleSelectedColor;
        }
        await productModel.findOneAndUpdate({ 'layouts._id': layoutID }, {
          '$set': {
            'layouts.$.color': this.articleSelectedColor
          }
        }, function (err, model) {
          if (err) {
            console.log(err);
          }
        });
      },
      async switchProductOrder(direction) {
        if (!this.articleSelectedProductButton || !direction) {
          return;
        }

        let dir = direction === 'right' ? 1 : -1;
        let foundItem = this.activeCategoryProducts.find((item) => item._id === this.articleSelectedProductButton._id);
        if (foundItem) {
          let foundNextItem = this.activeCategoryProducts.find((item) => item.layouts[0].order === this.articleSelectedProductButton.layouts[0].order + dir);
          if (foundNextItem) {
            //Update order on current product list
            let temp = foundNextItem.layouts[0].order;
            foundNextItem.layouts[0].order = foundItem.layouts[0].order;
            foundItem.layouts[0].order = temp;
            //Update db order
            const productModel = cms.getModel('Product')
            const nextProductLayoutID = foundNextItem.layouts[0]._id;
            const currentProductLayoutID = foundItem.layouts[0]._id;

            await productModel.findOneAndUpdate({ 'layouts._id': currentProductLayoutID }, {
              '$set': {
                'layouts.$.order': foundItem.layouts[0].order
              }
            }, function (err) {
              if (err) {
                console.log(err);
              }
            });

            await productModel.findOneAndUpdate({ 'layouts._id': nextProductLayoutID }, {
              '$set': {
                'layouts.$.order': foundNextItem.layouts[0].order
              }
            }, function (err) {
              if (err) {
                console.log(err);
              }
            });
            this.activeCategoryProducts = this.activeCategoryProducts.sort((current, next) => this.getProductGridOrder(current) - this.getProductGridOrder(next))
          }
        }
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
        //article view
        getListProducts: this.getListProducts,
        listProducts: this.listProducts,
        productFilters: this.productFilters,
        updateProductFilters: this.updateProductFilters,
        selectedProduct: this.selectedProduct,
        deleteSelectedProducts: this.deleteSelectedProducts,
        totalProducts: this.totalProducts,
        getTotalProducts: this.getTotalProducts,
        //order history screen
        orderHistoryOrders: this.orderHistoryOrders,
        orderHistoryFilters: this.orderHistoryFilters,
        orderHistoryCurrentOrder: this.orderHistoryCurrentOrder,
        deleteOrder: this.deleteOrder,
        getOrderHistory: this.getOrderHistory,
        updateOrderHistoryFilter: this.updateOrderHistoryFilter,

        //article screen
        selectArticle: this.selectArticle,
        articleSelectedProductButton: this.articleSelectedProductButton,
        setSelectedArticleColor: this.setSelectedArticleColor,
        articleSelectedColor: this.articleSelectedColor,
        switchProductOrder: this.switchProductOrder

      }
    }
  }
</script>

<style scoped>

</style>
