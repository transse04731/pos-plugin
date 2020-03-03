<template>
  <fragment/>
</template>

<script>
  import _ from 'lodash'
  import * as jsonfn from 'json-fn';
  import orderUtil from './logic/orderUtil';

  export default {
    name: 'PosStore',
    props: {},
    data() {
      return {
        systemDate: new Date(),
        user: null,
        loginPassword: '',
        incorrectPasscode: false,
        // order screen
        activeTableProduct: null,
        currentOrder: { items: [] },
        savedOrders: [],
        activeCategory: null, //todo use fn to load products?
        activeCategoryProducts: [],
        scrollWindowProducts: null,
        productIdQuery: '',
        productIdQueryResults: [],
        productNameQuery: '',
        productNameQueryResults: [],
        //payment screen variables
        paymentAmountTendered: '',
        paymentTip: 0,
        lastPayment: 0,
        //settings screen
        sidebarData: [
          {
            title: 'Product', icon: 'icon-liefer_packet', svgIcon: true, badge: '3', badgeColor: '#FF9529',
            items: [
              { title: 'Articles', icon: 'radio_button_unchecked', iconType: 'small', isView: true },
              { title: 'Category', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/category' */ },
              { title: 'Product Layout', icon: 'radio_button_unchecked', iconType: 'small', href: '/view/pos-article', appendIcon: 'open_in_new' },
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
              { title: 'Payment Layout', icon: 'radio_button_unchecked', iconType: 'small', href: '/view/pos-payment-config', appendIcon: 'open_in_new' },
              { title: 'Function Layout', icon: 'radio_button_unchecked', iconType: 'small', href: '/view/pos-fn-button', appendIcon: 'open_in_new' },
              {
                title: 'Terminal 1', icon: 'radio_button_unchecked', iconType: 'small',
                items: [
                  { title: 'POS', icon: ' ' },
                  { title: 'Thermal Printer', isView: true, icon: ' ' },
                  { title: 'Customer Display', icon: ' ' },
                  { title: 'A4 Printer', icon: ' ' },
                ]
              }
            ]
          },
          {
            title: 'Advanced settings', icon: 'icon-switch', svgIcon: true, badge: '3', badgeColor: '#FF4081',
            items: [
              { title: 'Company Info', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/company'*/ },
              { title: 'Payment', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/payment'*/ },
              { title: 'Tax', icon: 'radio_button_unchecked', iconType: 'small', isView: true },
              { title: 'License', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          },
        ],
        //category view
        listCategories: [],
        selectedCategory: null,
        //article view
        productFilters: [],
        listProducts: [],
        selectedProductIDs: [],
        totalProducts: null,
        productPagination: { limit: 15, currentPage: 1 },
        selectedProduct: null,
        //payment view
        listPayments: [],
        selectedPayment: null,
        //general setting
        generalSetting: null,
        //company info view
        companyInfo: null,
        //user view
        listUsers: [],
        selectedUser: {},
        //printer view
        thermalPrinter: null,
        //tax category view
        selectedTaxCategory: null,
        listTaxCategories: [],
        //order history screen variables
        orderHistoryOrders: [],
        orderHistoryFilters: [],
        orderHistoryCurrentOrder: null,
        totalOrders: null,
        orderHistoryPagination: { limit: 15, currentPage: 1 },
        //article screen
        articleSelectedColor: null,
        articleSelectedProductButton: null,
        //End of day report screen
        selectedReportDate: null,
        listOfDatesWithReports: [],
        reportsFromMonth: [],
        //month report screen
        selectedMonth: null,
        monthReportFrom: null,
        monthReportTo: null,
        showProductSold: true,
        showAllZNumber: false,
        monthReport: null
      }
    },
    domain: 'PosStore',
    computed: {
      // order screen
      paymentDiscount() {
        if (this.currentOrder.items) {
          return orderUtil.calOrderDiscount(this.currentOrder.items);
        }
      },
      paymentChange() {
        if (parseFloat(this.paymentAmountTendered) > this.paymentTotal) {
          return parseFloat(this.paymentAmountTendered) - this.paymentTotal
        }
        return 0
      },
      paymentTotal() {
        if (this.currentOrder) {
          return orderUtil.calOrderTotal(this.currentOrder.items);
        }
        return 0
      },
      paymentTax() {
        if (this.currentOrder) {
          return orderUtil.calOrderTax(this.currentOrder.items);
        }
        return 0
      },
      paymentSubTotal() {
        return this.paymentTotal - this.paymentTax
      },
      activeProducts() {
        return _.groupBy(cms.getList('Product'), 'category._id')
      },
      activeProduct() {
        if (this.currentOrder.items && !_.isNil(this.activeTableProduct)) {
          return this.currentOrder.items[this.activeTableProduct]
        }
      },
    },
    methods: {
      //<!--<editor-fold desc="Login screen">-->
      login() {
        try {
          this.user = _.find(cms.getList('PosSetting')[0].user, user => user.passcode === this.loginPassword)
          if (this.user) {
            this.loginPassword = ''
            return this.$router.push({ path: `/view/pos-dashboard` })
          }
        } catch (e) {
          console.error(e)
        }
        this.incorrectPasscode = true
      },
      resetIncorrectPasscodeFlag() {
        if (this.incorrectPasscode) {
          this.incorrectPasscode = false
        }
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="Order screen">-->
      getAllCategories() {
        const categories = cms.getList('Category')
        const posSettings = cms.getList('PosSetting')[0];
        let favoriteArticle = posSettings.generalSetting.favoriteArticle;
        return favoriteArticle ? categories : categories.filter(cat => cat.name !== 'Favourite')
      },
      async getActiveProducts() {
        // const products = cms.getList('Product').filter(product => product.category._id === this.activeCategory._id)
        let products
        if (this.activeCategory.name === 'Favourite') {
          products = await cms.getModel('Product').find({ 'option.favorite': true })
        } else {
          products = await cms.getModel('Product').find({ 'category': this.activeCategory._id })
        }
        this.activeCategoryProducts = products.sort((current, next) => this.getProductGridOrder(current) - this.getProductGridOrder(next))
      },
      getProductGridOrder(product, isFavourite = false) {
        const layout = product.layouts && product.layouts.find(layout =>
            isFavourite || (this.activeCategory && this.activeCategory.name === 'Favourite')
                ? layout.favourite
                : !layout.favourite
        );
        return layout ? layout.order : 0
      },
      async getScrollWindowProducts() {
        const products = {}
        const allProducts = await cms.getModel('Product').find();
        const groupedProducts = _.groupBy(allProducts, 'category.name')
        const favouriteProducts = allProducts.filter(product => product.option && product.option.favorite)
          .sort((cur, next) => this.getProductGridOrder(cur, true) - this.getProductGridOrder(next, true))
          .map(product => ({
            ..._.omit(product, 'attributes'),
            originalPrice: product.price
          }))
        if (favouriteProducts) {
          Object.assign(products, {
            Favourite: _.chunk(favouriteProducts, 28)
          })
        }
        if (groupedProducts) {
          for (const key in groupedProducts) {
            if (groupedProducts.hasOwnProperty(key)) {
              const isFavourite = key === 'Favourite'
              Object.assign(products, {
                [key]: _.chunk(groupedProducts[key].sort((current, next) => {
                  return this.getProductGridOrder(current, isFavourite) - this.getProductGridOrder(next, isFavourite)
                }).map(product => ({
                  ..._.omit(product, 'attributes'),
                  originalPrice: product.price
                })), 28)
              })
            }
          }
        }
        this.scrollWindowProducts = products
        return products
      },
      addProductToOrder(product) {
        if (this.currentOrder && product) {
          if (!Array.isArray(this.currentOrder.items)) this.currentOrder.items = []

          const latestProduct = _.last(this.currentOrder.items);

          if (_.isEqual(_.omit(latestProduct, 'quantity'), _.omit(product, 'quantity'))) {
            latestProduct.quantity = latestProduct.quantity + (product.quantity || 1);
          } else {
            // this.currentOrder.items.push(Object.assign({}, { quantity: 1 }, product))
            // replace (instead of mutate) to get old value in watcher for scrolling in order table
            this.currentOrder.items = [...this.currentOrder.items, Object.assign({}, { quantity: 1 }, product)]
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

          newPrice = +newPrice.toFixed(2)

          if (update) {
            this.$set(this.activeProduct, 'price', newPrice)
            this.$set(this.activeProduct, 'discountUnit', changeType === 'percentage' ? 'percent' : 'amount')
            this.$set(this.activeProduct, 'vDiscount', originalPrice - newPrice)
          }
          return newPrice
        }
      },
      updateNewPrice({ difference, type, value }) {
        if (this.activeProduct) {
          this.$set(this.activeProduct, 'price', value)
          this.$set(this.activeProduct, 'discountUnit', type === 'percentage' ? 'percent' : 'amount')
          this.$set(this.activeProduct, 'vDiscount', difference)
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
        const results = cms.getList('Product').filter(product => product.name.toLowerCase().includes(this.productNameQuery.trim().toLowerCase()))
        this.productNameQueryResults = Object.freeze(results.map(product => ({
          ...product,
          originalPrice: product.price
        })))
      },
      async getSavedOrders() {
        try {
          const orderModel = cms.getModel('Order')
          this.savedOrders = await orderModel.find({ status: 'inProgress' })
        } catch (e) {
          console.error(e)
        }
      },
      async removeSavedOrder(order) {
        try {
          const orderModel = cms.getModel('Order')
          await orderModel.findOneAndUpdate({ '_id': order._id }, { status: 'cancelled' });
          const index = this.savedOrders.findIndex(o => o._id === order._id);
          this.savedOrders.splice(index, 1);
        } catch (e) {
          console.error(e)
        }
      },
      async selectSavedOrder(order) {
        await this.resetOrderData()
        const orderModel = cms.getModel('Order')
        this.currentOrder = await orderModel.findOne({ _id: order._id })
      },
      async resetOrderData() {
        this.activeTableProduct = null
        this.currentOrder = { items: [] }
        this.paymentAmountTendered = ''
        this.productIdQuery = ''
        await this.getSavedOrders()
      },
      async savePaidOrder(paymentMethod) {
        try {
          if (!this.currentOrder || !this.currentOrder.items.length) return
          const orderModel = cms.getModel('Order')
          const orderDateTime = new Date()
          const id = await this.getLatestOrderId()
          const taxGroups = _.groupBy(this.currentOrder.items, 'tax')
          const vTaxGroups = _.map(taxGroups, (val, key) => ({
            taxType: key,
            tax: orderUtil.calOrderTax(val),
            sum: orderUtil.calOrderTotal(val)
          }))

          const order = {
            id,
            status: 'paid',
            items: this.getComputedOrderItems(this.currentOrder.items, orderDateTime),
            user: this.currentOrder.user
                ? [...this.currentOrder.user, { name: this.user.name, date: orderDateTime }]
                : [{ name: this.user.name, date: orderDateTime }],
            date: orderDateTime,
            vDate: this.getVDate(orderDateTime),
            bookingNumber: this.getBookingNumber(orderDateTime),
            payment: [paymentMethod || { ...this.currentOrder.payment, value: this.paymentTotal }],
            vSum: this.paymentTotal.toFixed(2),
            vTax: this.paymentTax.toFixed(2),
            vTaxGroups,
            vDiscount: this.paymentDiscount.toFixed(2),
            receive: parseFloat(this.paymentAmountTendered),
            cashback: this.paymentChange.toFixed(2)
          }

          const newOrder = this.currentOrder.status === 'inProgress'
            ? await orderModel.findOneAndUpdate({ _id: this.currentOrder._id }, order)
            : await orderModel.create(order);
          newOrder && this.printOrderReport(newOrder._id)
        } catch (e) {
          console.error(e)
          return
        }
        await this.resetOrderData();
      },
      // order/payment
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
      discountCurrentOrder(change) {
        this.$set(this.currentOrder, 'items', orderUtil.applyDiscountForOrder(this.compactOrder(this.currentOrder.items), change));
        this.$set(this.currentOrder, 'isDiscountInTotal', true);
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="Order history screen">-->
      updateOrderHistoryFilter(filter) {
        const index = this.orderHistoryFilters.findIndex(f => f.title === filter.title);
        if (index > -1) {
          this.orderHistoryFilters.splice(index, 1, filter);
        } else {
          this.orderHistoryFilters.unshift(filter);
        }
        this.orderHistoryPagination.currentPage = 1;
      },
      async getOrderHistory() {
        const orderModel = cms.getModel('Order');
        const condition = this.orderHistoryFilters.reduce((acc, filter) => ({ ...acc, ...filter['condition'] }), { status: 'paid' });
        const { limit, currentPage } = this.orderHistoryPagination;
        const orders = await orderModel.find(condition).sort({ date: -1 }).skip(limit * (currentPage - 1)).limit(limit);
        this.orderHistoryOrders = orders.map(order => ({
          ...order,
          info: order.note,
          tax: order.vTax ? order.vTax : orderUtil.calOrderTax(order.items),
          dateTime: dayjs(order.date).format('DD.MM HH:mm'),
          amount: order.vSum ? order.vSum : orderUtil.calOrderTotal(order.items),
          staff: order.user,
          barcode: '',
          promotions: [],
        }));
        this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
      },
      async getTotalOrders() {
        const orderModel = cms.getModel('Order');
        const condition = this.orderHistoryFilters.reduce((acc, filter) => ({ ...acc, ...filter['condition'] }), { status: 'paid' });
        this.totalOrders = await orderModel.count(condition);
      },
      async deleteOrder() {
        try {
          const orderModel = cms.getModel('Order');
          await orderModel.findOneAndUpdate({ '_id': this.orderHistoryCurrentOrder._id }, { status: 'cancelled' });
          const index = this.orderHistoryOrders.findIndex(o => o._id === this.orderHistoryCurrentOrder._id);
          this.orderHistoryOrders.splice(index, 1);
          this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
        } catch (e) {
          console.error(e)
        }
      },
      printOrderReport(orderId) {
        return new Promise((resolve, reject) => {
          if (_.isNil(orderId)) reject()
          cms.socket.emit('printReport', 'OrderReport', { orderId }, ({ success, message }) => {
            if (success) resolve()
            reject(message)
          })
        })
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="Settings screen">-->
      //category view
      async updateCategory(oldID, newName) {
        const categoryModel = cms.getModel('Category');
        if (oldID && !newName) {
          await categoryModel.deleteOne({ '_id': oldID });
        } else if (!oldID && newName) {
          await categoryModel.create({ name: newName });
        } else {
          await categoryModel.findOneAndUpdate({ '_id': oldID }, { name: newName });
        }
        this.listCategories = await categoryModel.find();
      },
      //article view
      updateProductFilters(filter) {
        const index = this.productFilters.findIndex(f => f.title === filter.title);
        if (index > -1) {
          this.productFilters.splice(index, 1, filter);
        } else {
          this.productFilters.unshift(filter);
        }
        this.productPagination.currentPage = 1
      },
      async getListProducts() {
        const productModel = cms.getModel('Product');
        const condition = this.productFilters.reduce((acc, filter) => ({ ...acc, ...filter['condition'] }), {});
        const { limit, currentPage } = this.productPagination;
        this.listProducts = await productModel.find(condition).skip(limit * (currentPage - 1)).limit(limit);
      },
      async getTotalProducts() {
        const productModel = cms.getModel('Product');
        const condition = this.productFilters.reduce((acc, filter) => ({ ...acc, ...filter['condition'] }), {});
        this.totalProducts = await productModel.count(condition);
      },
      async deleteSelectedProducts() {
        const productModel = cms.getModel('Product');
        if (this.selectedProductIDs && this.selectedProductIDs.length > 0) {
          await productModel.deleteMany({ '_id': { '$in': this.selectedProductIDs } });
        }

        // reset related fn buttons
        const settingModel = cms.getModel('PosSetting');
        await settingModel.findOneAndUpdate(
            {
              'leftFunctionButtons.buyback.product': { '$in': this.selectedProductIDs }
            },
            {
              $set: {
                'leftFunctionButtons.$.text': null,
                'leftFunctionButtons.$.buttonFunction': null,
                'leftFunctionButtons.$.buttonFunctionValue': null,
                'leftFunctionButtons.$.buyback': null,
                'leftFunctionButtons.$.backgroundColor': '#FFFFFF',
                'leftFunctionButtons.$.textColor': '#1D1D26',
              }
            });
        await settingModel.findOneAndUpdate(
            {
              'rightFunctionButtons.buyback.product': { '$in': this.selectedProductIDs }
            },
            {
              $set: {
                'rightFunctionButtons.$.text': null,
                'rightFunctionButtons.$.buttonFunction': null,
                'rightFunctionButtons.$.buttonFunctionValue': null,
                'rightFunctionButtons.$.buyback': null,
                'rightFunctionButtons.$.backgroundColor': '#FFFFFF',
                'rightFunctionButtons.$.textColor': '#1D1D26',
              }
            });

        // fetch data
        await this.getListProducts();
        await this.getTotalProducts();
        this.selectedProductIDs = [];
      },
      async createNewProduct(product) {
        const productModel = cms.getModel('Product');
        await productModel.create(product);
        await this.getListProducts();
        await this.getTotalProducts();
      },
      async updateProduct(product) {
        const productModel = cms.getModel('Product');
        await productModel.findOneAndUpdate(
            {
              _id: product._id
            },
            product
        )
        await this.getListProducts();
        await this.getTotalProducts();
        this.selectedProduct = null;
        this.selectedProductIDs = [];
      },
      async getAllTaxCategory() {
        const setting = await cms.getModel('PosSetting').findOne();
        return setting.taxCategory;
      },
      async getHighestProductOrder(categoryId) {
        const listMaxOrder = await cms.getModel('Product').aggregate([
          { $unwind: { path: '$layouts' } },
          {
            $group: {
              _id: '$category',
              maxOrder: { $max: '$layouts.order' }
            }
          }])
        const maxOrderItem = listMaxOrder.find(o => o._id === categoryId)
        return (maxOrderItem && maxOrderItem.maxOrder) || 0;
      },
      async getHighestFavouriteProductOrder() {
        const result = await cms.getModel('Product').aggregate([
          { $unwind: { path: '$layouts' } }, { $match: {'layouts.favourite': true} },
          {
            $group: {
              _id: null,
              maxOrder: { $max: '$layouts.order' }
            }
          }])
        return (result[0] && result[0].maxOrder) || 0
      },
      //tax category view
      async updateTaxCategory(oldTaxId, newTaxCategory) {
        const settingModel = cms.getModel('PosSetting');
        if (oldTaxId && !newTaxCategory) {
          await settingModel.findOneAndUpdate(
              {},
              {
                $pull: {
                  taxCategory: { _id: oldTaxId }
                }
              }
          )
        } else if (newTaxCategory && !oldTaxId) {
          await settingModel.findOneAndUpdate(
              {},
              {
                $push: {
                  taxCategory: { ...newTaxCategory }
                }
              }
          )
        } else {
          await settingModel.findOneAndUpdate(
              {
                'taxCategory._id': oldTaxId
              },
              {
                $set: {
                  'taxCategory.$': newTaxCategory,
                }
              }
          )
        }
        const setting = await settingModel.findOne();
        this.listTaxCategories = setting.taxCategory;
      },
      //payment view
      async getListPayments() {
        const setting = await cms.getModel('PosSetting').findOne();
        this.listPayments = setting.payment;
      },
      async updatePayment(oldPayment, newPayment) {
        const settingModel = cms.getModel('PosSetting');
        if (oldPayment && !newPayment) {
          await settingModel.findOneAndUpdate(
              {},
              {
                $pull: {
                  payment: { _id: oldPayment._id }
                }
              }
          )
        } else if (newPayment && !oldPayment) {
          await settingModel.findOneAndUpdate(
              {},
              {
                $push: {
                  payment: { ...newPayment }
                }
              }
          )
        } else {
          await settingModel.findOneAndUpdate(
              {
                'payment._id': oldPayment._id
              },
              {
                $set: {
                  'payment.$': newPayment,
                }
              }
          )
        }
        await this.getListPayments();
      },
      //general setting screen
      getGeneralSetting() {
        const setting = cms.getList('PosSetting')[0];
        this.generalSetting = setting.generalSetting || {};
      },
      async updateSetting() {
        const settingModel = cms.getModel('PosSetting');
        await settingModel.findOneAndUpdate(
            {},
            {
              generalSetting: this.generalSetting
            }
        )
      },
      //company info view
      async getCompanyInfo() {
        const setting = await cms.getModel('PosSetting').findOne();
        this.companyInfo = setting.companyInfo || {};
      },
      async updateCompanyInfo() {
        await cms.getModel('PosSetting').findOneAndUpdate(
            {},
            {
              companyInfo: this.companyInfo
            }
        );
      },
      //user view
      async getListUsers() {
        const setting = await cms.getModel('PosSetting').findOne();
        this.listUsers = setting.user;
      },
      async updateUser(oldUserId, newUser) {
        const settingModel = cms.getModel('PosSetting');
        if (oldUserId && !newUser) {
          await settingModel.findOneAndUpdate({}, {
            $pull: {
              user: { _id: oldUserId }
            }
          })
        } else if (newUser && !oldUserId) {
          await settingModel.findOneAndUpdate({}, {
            $push: {
              user: { ...newUser }
            }
          })
        } else {
          await settingModel.findOneAndUpdate(
              {
                'user._id': oldUserId
              },
              {
                $set: {
                  'user.$': newUser,
                }
              }
          )
        }
        await this.getListUsers();
        //update currentUser logged in if change
        if (this.user._id === oldUserId) {
          this.user = this.listUsers.find(u => u._id === oldUserId);
        }
      },
      async getListAvatar() {
        return await cms.getModel('Avatar').find();
      },
      //printer view
      async getThermalPrinter() {
        const terminalModel = cms.getModel('Terminal');
        const terminal = await terminalModel.findOne({ name: 'Terminal 1' })
        this.thermalPrinter = terminal && terminal.thermalPrinters && terminal.thermalPrinters[0] || {};
      },
      async updateThermalPrinter(oldPrinterId, newPrinter) {
        const terminalModel = cms.getModel('Terminal');
        if (!oldPrinterId) {
          await terminalModel.findOneAndUpdate(
              { name: 'Terminal 1' },
              {
                $push: {
                  thermalPrinters: newPrinter
                }
              }, { upsert: true }
          )
          //update thermal printer with new _id
          await this.getThermalPrinter();
        } else {
          await terminalModel.findOneAndUpdate(
              {
                'thermalPrinters._id': oldPrinterId
              },
              {
                $set: {
                  'thermalPrinters.$': newPrinter
                }
              }, { upsert: true }
          )
        }
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="Article screen">-->
      selectArticle(item) {
        if (this.articleSelectedProductButton && item._id === this.articleSelectedProductButton._id) {
          this.articleSelectedProductButton = null;
          this.articleSelectedColor = null;
          return;
        }
        this.articleSelectedProductButton = item;
        const layout = this.getProductLayout(this.articleSelectedProductButton, this.activeCategory);
        this.articleSelectedColor = layout && layout.color;
      },
      isIncreasingSequence(numArr) {
        for (let num = 0; num < numArr.length - 1; num++) {
          if (!(numArr[num] < numArr[num + 1]) || !(numArr[num + 1] - numArr[num] === 1)) {
            return num + 1;
          }
        }

        return null;
      },
      async updateArticleOrders() {
        const productModel = cms.getModel('Product');
        try {
          await Promise.all(this.activeCategoryProducts.map(async (article, index) => {
            const articleLayout = this.getProductLayout(article, this.activeCategory)
            if (articleLayout.order !== index + 1) {
              await productModel.findOneAndUpdate({ 'layouts._id': articleLayout._id }, {
                '$set': {
                  'layouts.$.order': index + 1
                }
              });
              return articleLayout.order = index + 1;
            }
            return articleLayout.order;
          }))
        } catch (e) {
          console.error('Error reordering articles: ', e);
        }
      },
      async setSelectedArticleColor() {
        if (!this.articleSelectedColor || !this.articleSelectedProductButton) {
          return
        }

        //Update to db
        const productModel = cms.getModel('Product')
        const layout = this.getProductLayout(this.articleSelectedProductButton, this.activeCategory)
        const layoutID = layout._id
        //Update current product
        let foundItem = this.activeCategoryProducts.find((item) => item._id === this.articleSelectedProductButton._id);
        if (foundItem) {
          try {
            let updateColorResult = await productModel.findOneAndUpdate({ 'layouts._id': layoutID }, {
              '$set': {
                'layouts.$.color': this.articleSelectedColor
              }
            });

            if (updateColorResult) {
              layout.color = this.articleSelectedColor;
            }
          } catch (e) {
            console.error(e)
          }
        }
      },
      async switchProductOrder(direction, category) {
        const selectedArticleLayout = this.getProductLayout(this.articleSelectedProductButton, category)

        if (!this.articleSelectedProductButton || !direction) {
          return;
        }

        let dir = direction === 'right' ? 1 : -1;

        const foundItem = this.activeCategoryProducts.find((item) => item._id === this.articleSelectedProductButton._id);
        if (foundItem) {
          const foundNextItem = this.activeCategoryProducts.find(item => {
            const layout = this.getProductLayout(item, category)
            return layout && layout.order && (layout.order === selectedArticleLayout.order + dir)
          })

          if (foundNextItem) {
            //Update order on current product list
            const nextItemLayout = this.getProductLayout(foundNextItem, category)
            const currentItemLayout = this.getProductLayout(foundItem, category)

            //Update db order
            const productModel = cms.getModel('Product')
            try {
              let currentItemResult = await productModel.findOneAndUpdate({ 'layouts._id': currentItemLayout._id }, {
                '$set': {
                  'layouts.$.order': nextItemLayout.order
                }
              });

              let nextItemResult = await productModel.findOneAndUpdate({ 'layouts._id': nextItemLayout._id }, {
                '$set': {
                  'layouts.$.order': currentItemLayout.order
                }
              });

              if (nextItemResult && currentItemResult) {
                const temp = nextItemLayout.order
                nextItemLayout.order = currentItemLayout.order;
                currentItemLayout.order = temp;
              }
            } catch (e) {
              console.error(e);
            }

            this.activeCategoryProducts = this.activeCategoryProducts.sort((current, next) =>
              this.getProductGridOrder(current) - this.getProductGridOrder(next))
          }
        }
      },
      //Fully reset layout of button
      //Usage: resetLayoutFnBtn('leftFunctionButtons')
      async resetLayoutFnBtn(dbButtonList) {
        const posSettings = cms.getList('PosSetting')[0];
        // if (dbButtonList === 'leftFunctionButtons') {
        //   this.leftButtonsUpdate++;
        // }
        if (posSettings[dbButtonList]) {
          try {
            for (let item of posSettings[dbButtonList]) {
              await cms.getModel('PosSetting').findOneAndUpdate({ [`${dbButtonList}._id`]: item._id }, {
                '$set': {
                  [`${dbButtonList}.$.rows`]: item.originalRows,
                  [`${dbButtonList}.$.cols`]: item.originalCols,
                  [`${dbButtonList}.$.containedButtons`]: []
                }
              });
            }
          } catch (e) {
            console.error(e);
          }
        }

      },
      async getPosSetting() {
        return cms.getModel('PosSetting').findOne();
      },
      getProductLayout(item, category) {
        const isFavourite = category && category.name === 'Favourite' || false
        return item.layouts && item.layouts.find(layout => !!layout.favourite === isFavourite) || {}
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="End-of-day Report">-->
      async getEodReports(from, to) {
        try {
          let result = await cms.processData('OrderEODCalendar', { from, to });
          result = jsonfn.clone(result, true, true);
          return result.ordersByDate
        } catch (e) {
          console.error(e)
        }
      },
      async getDatesWithReports(month) {
        let eventDates = []

        if (month) {
          let currentDate = dayjs(month).startOf('month')
          const endDate = currentDate.add(1, 'month')

          const dates = await this.getEodReports(currentDate, endDate)
          this.reportsFromMonth = dates

          eventDates = _.map(dates, (value, key) => {
            const color = Object.keys(value).includes('') ? '#00E676' : '#EF9A9A'
            return {
              date: dayjs(key).format('YYYY-MM-DD'),
              color
            }
          })
        }

        this.listOfDatesWithReports = eventDates
        return eventDates
      },
      getDailyReports(date) {
        try {
          const reports = this.reportsFromMonth[dayjs(date).toISOString()]
          if (!reports) return

          return _.map(reports, (value, key) => ({
            z: key ? key : this.getHighestZNumber(),
            begin: value.from,
            end: value.to,
            sum: value.vSum,
            pending: !key
          })).sort((cur, next) => cur.begin - next.begin)
        } catch (e) {
          console.error(e)
        }
      },
      async getOldestPendingReport() {
        try {
          const pendingOrder = await cms.getModel('Order').findOne({ z: { $exists: false }, status: 'paid' }).sort('date')
          if (pendingOrder) {
            const fromDate = dayjs(pendingOrder.vDate);
            let eodData = await this.getEodReports(fromDate.toDate(), fromDate.add(1, 'day').toDate())
            eodData = jsonfn.clone(eodData, true, true)
            const reports = _.map(eodData, (val,key) => ({ date: dayjs(key), reports: val }))
            return reports.find(i => i.reports[''])
          }
        } catch (e) {
          console.error(e)
        }
      },
      async finalizeReport(reports) {
        if (!reports || !reports.length) return
        const report = Object.assign(reports.find(i => i.pending))

        try {
          const orderModel = cms.getModel('Order')
          let vDateOrders = await orderModel.find({ status: 'paid', vDate: dayjs(report.begin).startOf('day').toDate() })
          vDateOrders = jsonfn.clone(vDateOrders, true, true)

          const ordersToUpdate = vDateOrders.filter(order => report.begin <= order.date && order.date <= report.end).map(i => i._id)

          await orderModel.updateMany({ _id: { $in: ordersToUpdate} }, { $set: { z: report.z } })
          await cms.getModel('EndOfDay').create(report)
          await this.printZReport(report.z)
        } catch (e) {
          console.error(e)
        }
      },
      printZReport(z) {
        return new Promise((resolve, reject) => {
          if (_.isNil(z)) reject()
          cms.socket.emit('printReport', 'ZReport', { z: parseInt(z) }, ({ success, message }) => {
            if (success) resolve()
            reject(message)
          })

        })
      },
      async getXReport(date) {
        try {
          const beginHour = cms.getList('PosSetting')[0].generalSetting.beginHour || '00:00'
          const [hour, minutes] = beginHour.split(':')
          const from = dayjs(date).startOf('day').hour(parseInt(hour)).minute(parseInt(minutes)).toDate()
          const to = dayjs(from).add(1, 'day').toDate()

          const xReport = await cms.processData('OrderXReport', { from, to })
          return xReport.dayReport[dayjs(date).format('DD-MM-YYYY')]
        } catch (e) {
          console.error(e)
        }
      },
      async printXReport(date) {
        const from = dayjs(date).startOf('day').toDate()
        const to = dayjs(from).add(1, 'day').toDate()

        return new Promise((resolve, reject) => {
          cms.socket.emit('printReport', 'XReport',
            { from, to }, ({ success, message }) => {
              if (success) resolve()
              reject(message)
            })
        })
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="Button functions">-->
      isActiveFnBtn(btn) {
        if (!btn || !btn.buttonFunction) return
        if (btn.buttonFunction === 'changePrice' || btn.buttonFunction.includes('discount')) {
          return !_.isNil(this.activeTableProduct) && !this.activeTableProduct.discountResistance
        }
        if (['pay', 'quickCash', 'saveOrder'].includes(btn.buttonFunction)) {
          return this.currentOrder.items.length > 0
        }
        return true;
      },
      chooseFunction(functionName) {
        if (!functionName) return () => null
        return this[functionName]
      },
      buybackProduct({ price, product, unit }) {
        this.addProductToOrder(Object.assign(_.omit(product, 'attributes'), {
          price: -price,
          originalPrice: -price,
          tax: 0,
          discountResistance: true
        }))
      },
      changePrice() {
        this.$getService('dialogChangePrice:open')('new', this.activeProduct ? this.activeProduct.originalPrice : 0)
      },
      discountSingleItemDialog() {
        this.$getService('dialogChangePrice:open')('percentage', this.activeProduct ? this.activeProduct.originalPrice : 0)
      },
      discountSingleItemByAmount(value) {
        this.calculateNewPrice('amount', value, true)
      },
      discountSingleItemByPercent(value) {
        this.calculateNewPrice('percentage', value, true)
      },
      productLookup() {
        this.$getService('dialogProductLookup:setActive')(true)
      },
      async saveOrder() {
        if (!this.currentOrder || !this.currentOrder.items.length) return
        const orderModel = cms.getModel('Order')
        const date = new Date();

        const order = {
          status: 'inProgress',
          items: this.getComputedOrderItems(this.currentOrder.items, date),
          date,
          vDate: this.getVDate(date),
          user: [{ name: this.user.name || '', date }]
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
        this.resetOrderData()
      },
      async quickCash() {
        this.lastPayment = +this.paymentTotal
        this.paymentAmountTendered = this.paymentTotal.toString()
        await this.savePaidOrder({ type: 'cash', value: this.lastPayment });
      },
      pay() {
        this.$router.push({ path: `/view/pos-payment` })
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="Helpers">-->
      getComputedOrderItems(orderItems, date) {
        const compactItems = this.compactOrder(orderItems)

        return compactItems.map(item => ({
          ..._.omit(item, 'category'),
          product: item._id,
          category: item.category.name ? item.category.name : item.category, // saved order then pay have a string category
          date
        }))
      },
      async getLatestOrderId() {
        try {
          const orderWithHighestId = await cms.getModel('Order').findOne().sort('-id');
          return ((orderWithHighestId && orderWithHighestId.id) || 0) + 1
        } catch (e) {
          console.error(e)
        }
      },
      getBookingNumber(dateTime) {
        return dayjs(dateTime).format('YYMMDDHHmmssSSS')
      },
      getVDate(dateTime) {
        const beginHour = cms.getList('PosSetting')[0].generalSetting.beginHour || '00:00'
        const [hour, minutes] = beginHour.split(':')
        const beginDateTime = dayjs(dateTime).clone().hour(parseInt(hour)).minute(parseInt(minutes))

        if (dayjs(dateTime).isBefore(beginDateTime)) {
          return beginDateTime.startOf('day').subtract(1, 'day').toDate()
        }

        return beginDateTime.startOf('day').toDate()
      },
      getHighestZNumber() {
        const reportWithHighestZ = cms.getList('EndOfDay').sort((cur, next) => next.z - cur.z)[0]
        return reportWithHighestZ ? reportWithHighestZ.z + 1 : 1
      },
      //<!--</editor-fold>-->

      //Layout config views
      async updatePosSettings(item, dbButtonList, mergeMap) {
        try {
          await cms.getModel('PosSetting').findOneAndUpdate({ [`${dbButtonList}._id`]: item.buttonId }, {
            '$set': {
              [`${dbButtonList}.$.backgroundColor`]: item.style.backgroundColor,
              [`${dbButtonList}.$.text`]: item.text,
              [`${dbButtonList}.$.rows`]: item.row,
              [`${dbButtonList}.$.cols`]: item.col,
              [`${dbButtonList}.$.textColor`]: ['#73F8F8', '#FFFFFF'].includes(item.style.backgroundColor) ? '#000000' : '#FFFFFF',
              [`${dbButtonList}.$.buttonFunction`]: item.buttonFunction,
              [`${dbButtonList}.$.buttonFunctionValue`]: item.buttonFunctionValue,
              [`${dbButtonList}.$.containedButtons`]: mergeMap && mergeMap[item.buttonId] ? mergeMap[item.buttonId] : [],
              ...(item.buyback && {[`${dbButtonList}.$.buyback`]: item.buyback}),
            }
          });
        } catch (e) {
          console.log('Error updating updatePosSettings', e);
        }
      },

      //<!--<editor-fold desc="Monthly Report">-->
      async getMonthReport() {
        const from = dayjs(this.monthReportFrom).toDate()
        const to = dayjs(this.monthReportTo).toDate()
        let { total, salesByCategory, salesByPayment, zNumbers } = await cms.processData('OrderMonthReport', {from, to})

        salesByCategory = _.mapValues(salesByCategory, (value) => {
          const products = _.reduce(value, (acc, {quantity, gross}, product) => {
            acc.push({product, quantity, gross})
            return acc
          }, [])
          return {
            products,
            sum: products.reduce((acc, { gross }) => acc + gross, 0)
          }
        })
        zNumbers = _.reduce(zNumbers, (acc, data, date) => {
          acc.push(..._.map(data, (sum, z) => ({ z, sum, date: dayjs(date).format('DD.MM.YYYY') })))
          return acc
        }, [])

        this.monthReport = { total, salesByCategory, salesByPayment, zNumbers }

        return { total, salesByCategory, salesByPayment, zNumbers }
      },
      printMonthlyReport(report) {
        return new Promise((resolve, reject) => {
          cms.socket.emit('printReport', 'MonthlyReport',
            report,
            ({ success, message }) => {
              if (success) resolve()
              reject(message)
            })
        })
      },
      //<!--</editor-fold>-->

      async getOrderSalesByStaff(staffName, date = new Date()) {
        if (!staffName) {
          return
        }
        const fromTime = dayjs(date).startOf('day').toDate();
        const toTime = dayjs(date).startOf('day').add(1, 'day').toDate();

        return await cms.processData('OrderSalesByStaff', { from: fromTime, to: toTime, name: staffName })
      },
      printStaffReport(report) {
        return new Promise((resolve, reject) => {
          cms.socket.emit('printReport', 'StaffReport',
            report,
            ({ success, message }) => {
              if (success) {
                resolve()
              }
              reject(message)
            })
        })
      }
    },
    async created() {
      const cachedPageSize = localStorage.getItem('orderHistoryPageSize')
      if (cachedPageSize) this.orderHistoryPagination.limit = parseInt(cachedPageSize)
      const cachedArticlePageSize = localStorage.getItem('viewArticlePageSize');
      if (cachedArticlePageSize) this.productPagination.limite = parseInt(cachedArticlePageSize);
      this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
      this.user = cms.getList('PosSetting')[0].user[0]
      this.setDateInterval = setInterval(() => this.systemDate = new Date(), 10000)
      await this.getScrollWindowProducts()
    },
    beforeDestroy() {
      this.setDateInterval && clearInterval(this.setDateInterval)
    },
    watch: {
      'orderHistoryPagination.limit'(newVal) {
        localStorage.setItem('orderHistoryPageSize', newVal)
      },
      'productPagination.limit'(newVal) {
        localStorage.setItem('viewArticlePageSize', newVal)
      },
    },
    provide() {
      return {
        // login
        loginPassword: this.loginPassword,
        login: this.login,
        resetIncorrectPasscodeFlag: this.resetIncorrectPasscodeFlag,
        user: this.user,
        systemDate: this.systemDate,
        //order screen
        activeProductWindow: this.activeProductWindow,
        activeTableProduct: this.activeTableProduct,
        activeProducts: this.activeProducts,
        scrollWindowProducts: this.scrollWindowProducts,
        activeProduct: this.activeProduct,
        getProductGridOrder: this.getProductGridOrder,
        getAllCategories: this.getAllCategories,
        getActiveProducts: this.getActiveProducts,
        addItemQuantity: this.addItemQuantity,
        removeItemQuantity: this.removeItemQuantity,
        activeCategory: this.activeCategory,
        activeCategoryProducts: this.activeCategoryProducts,
        currentOrder: this.currentOrder,
        calculateNewPrice: this.calculateNewPrice,
        resetOrderData: this.resetOrderData,
        savePaidOrder: this.savePaidOrder,
        removeSavedOrder: this.removeSavedOrder,
        selectSavedOrder: this.selectSavedOrder,
        savedOrders: this.savedOrders,
        productIdQuery: this.productIdQuery,
        productIdQueryResults: this.productIdQueryResults,
        queryProductsById: this.queryProductsById,
        productNameQuery: this.productNameQuery,
        productNameQueryResults: this.productNameQueryResults,
        queryProductsByName: this.queryProductsByName,
        chooseFunction: this.chooseFunction,
        isActiveFnBtn: this.isActiveFnBtn,
        compactOrder: this.compactOrder,
        updateNewPrice: this.updateNewPrice,
        discountCurrentOrder: this.discountCurrentOrder,
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
        updateCategory: this.updateCategory,
        //article view
        getListProducts: this.getListProducts,
        listProducts: this.listProducts,
        productFilters: this.productFilters,
        updateProductFilters: this.updateProductFilters,
        selectedProductIDs: this.selectedProductIDs,
        deleteSelectedProducts: this.deleteSelectedProducts,
        totalProducts: this.totalProducts,
        getTotalProducts: this.getTotalProducts,
        createNewProduct: this.createNewProduct,
        getAllTaxCategory: this.getAllTaxCategory,
        getHighestProductOrder: this.getHighestProductOrder,
        selectedProduct: this.selectedProduct,
        isEditProduct: this.isEditProduct,
        updateProduct: this.updateProduct,
        //payment view
        listPayments: this.listPayments,
        getListPayments: this.getListPayments,
        selectedPayment: this.selectedPayment,
        updatePayment: this.updatePayment,
        //general setting view
        generalSetting: this.generalSetting,
        getGeneralSetting: this.getGeneralSetting,
        updateSetting: this.updateSetting,
        //company info view
        companyInfo: this.companyInfo,
        getCompanyInfo: this.getCompanyInfo,
        updateCompanyInfo: this.updateCompanyInfo,
        //user view
        listUsers: this.listUsers,
        selectedUser: this.selectedUser,
        getListUsers: this.getListUsers,
        updateUser: this.updateUser,
        getListAvatar: this.getListAvatar,
        //printer view
        thermalPrinter: this.thermalPrinter,
        getThermalPrinter: this.getThermalPrinter,
        updateThermalPrinter: this.updateThermalPrinter,
        //tax category view
        selectedTaxCategory: this.selectedTaxCategory,
        listTaxCategories: this.listTaxCategories,
        updateTaxCategory: this.updateTaxCategory,
        //order history screen
        orderHistoryOrders: this.orderHistoryOrders,
        orderHistoryFilters: this.orderHistoryFilters,
        orderHistoryCurrentOrder: this.orderHistoryCurrentOrder,
        deleteOrder: this.deleteOrder,
        getOrderHistory: this.getOrderHistory,
        updateOrderHistoryFilter: this.updateOrderHistoryFilter,
        totalOrders: this.totalOrders,
        orderHistoryPagination: this.orderHistoryPagination,
        getTotalOrders: this.getTotalOrders,
        printOrderReport: this.printOrderReport,
        //article screen
        selectArticle: this.selectArticle,
        articleSelectedProductButton: this.articleSelectedProductButton,
        setSelectedArticleColor: this.setSelectedArticleColor,
        articleSelectedColor: this.articleSelectedColor,
        switchProductOrder: this.switchProductOrder,
        updateArticleOrders: this.updateArticleOrders,
        getProductLayout: this.getProductLayout,
        getPosSetting: this.getPosSetting,
        //End of day report
        selectedReportDate: this.selectedReportDate,
        listOfDatesWithReports: this.listOfDatesWithReports,
        getDatesWithReports: this.getDatesWithReports,
        getDailyReports: this.getDailyReports,
        getOldestPendingReport: this.getOldestPendingReport,
        finalizeReport: this.finalizeReport,
        printZReport: this.printZReport,
        getXReport: this.getXReport,
        printXReport: this.printXReport,
        //Layout config views
        updatePosSettings: this.updatePosSettings,
        //month report screen
        selectedMonth: this.selectedMonth,
        monthReportFrom: this.monthReportFrom,
        monthReportTo: this.monthReportTo,
        showProductSold: this.showProductSold,
        showAllZNumber: this.showAllZNumber,
        monthReport: this.monthReport,
        getMonthReport: this.getMonthReport,
        printMonthlyReport: this.printMonthlyReport,
        //Staff Report Screen
        printStaffReport: this.printStaffReport,
      }
    }
  }
</script>

<style scoped>

</style>
