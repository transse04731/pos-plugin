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
        user: null,
        loginPassword: '',
        incorrectPasscode: false,
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
        //payment view
        listPayments: [],
        isEditPayment: false,
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
        //order history screen variables
        orderHistoryOrders: [],
        orderHistoryFilters: [],
        orderHistoryCurrentOrder: null,
        totalOrders: null,
        orderHistoryPagination: { limit: 10, currentPage: 1 },
        //article screen
        articleSelectedColor: null,
        articleSelectedProductButton: null,
        // leftButtonsUpdate: 0,
        // rightButtonsUpdate: 0,
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
      paymentTotal() {
        if (this.currentOrder) {
          return this.currentOrder.items.reduce((acc, cur) => {
            return acc + cur.price * cur.quantity
          }, 0)
        }
        return 0
      },
      paymentTax() {
        if (this.currentOrder) {
          return this.currentOrder.items.reduce((acc, cur) => {
            return acc + this.getComputedTax(cur) * cur.quantity
          }, 0)
        }
        return 0
      },
      paymentSubTotal() {
        return this.paymentTotal - this.paymentTax
      },
      activeProducts() {
        return _.groupBy(cms.getList('Product'), 'category._id')
      },
      scrollWindowProducts() {
        const products = {}
        const groupedProducts = _.groupBy(cms.getList('Product'), 'category.name')
        if (groupedProducts) {
          for (const key in groupedProducts) {
            if (groupedProducts.hasOwnProperty(key)) {
              const isFavourite = key === 'Favourite'
              Object.assign(products, {
                [key]: _.chunk(groupedProducts[key], 28).map(list =>
                    list.sort((current, next) => {
                      return this.getProductGridOrder(current, isFavourite) - this.getProductGridOrder(next, isFavourite)
                    }).map(product => ({
                      ..._.omit(product, 'attributes'),
                      originalPrice: product.price
                    })))
              })
            }
          }
        }
        return products
      },
      activeProduct() {
        if (this.currentOrder.items && !_.isNil(this.activeTableProduct)) {
          return this.currentOrder.items[this.activeTableProduct]
        }
      }
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
        return cms.getList('Category')
      },
      getActiveProducts() {
        const products = cms.getList('Product').filter(product => product.category._id === this.activeCategory._id)
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
        this.paymentAmountTendered = 0
        await this.getSavedOrders()
      },
      async savePaidOrder(paymentMethod) {
        try {
          if (!this.currentOrder || !this.currentOrder.items.length) return
          const orderModel = cms.getModel('Order')
          const orderDateTime = new Date()
          const beginHour = cms.getList('PosSetting')[0].generalSetting.beginHour || '00:00'
          const id = await this.getLatestOrderId()
          const taxGroups = _.groupBy(this.currentOrder.items, 'tax')
          const vTaxGroups = _.map(taxGroups, (val, key) => ({
            taxType: key,
            tax: val.reduce((acc, cur) => acc + this.getComputedTax(cur) * cur.quantity, 0),
            sum: val.reduce((acc,cur) => acc + cur.price * cur.quantity, 0)
          }))

          const order = {
            id,
            status: 'paid',
            items: this.getComputedOrderItems(this.currentOrder.items ,orderDateTime),
            user: this.currentOrder.user
              ? [...this.currentOrder.user, {name: this.user.name, date: orderDateTime}]
              : [{name: this.user.name, date: orderDateTime}],
            date: orderDateTime,
            vDate: this.getVDate(orderDateTime, beginHour),
            bookingNumber: this.getBookingNumber(orderDateTime),
            payment: [paymentMethod || { ...this.currentOrder.payment, value: this.paymentTotal }],
            vSum: this.paymentTotal,
            vTax: this.paymentTax,
            vTaxGroups,
            receive: this.paymentAmountTendered,
            cashback: this.paymentChange
          }

          if (this.currentOrder.status === 'inProgress') {
            await orderModel.findOneAndUpdate({ _id: this.currentOrder._id }, order)
          } else {
            await orderModel.create(order)
          }
        } catch (e) {
          console.error(e)
          return
        }
        await this.resetOrderData();
      },
      // order/payment
      convertMoney(val) {
        if (val && typeof (val) === 'number') {
          return val.toFixed(2)
        } else {
          return 0
        }
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
          tax: order.items.reduce((acc, item) => (acc + item.tax / 100 * item.quantity * item.price), 0),
          dateTime: dayjs(order.date).format('DD.MM HH:mm'),
          amount: order.vSum ? order.vSum : order.items.reduce((acc, item) => (acc + item.price * item.quantity * (1 + item.tax / 100)), 0),
          staff: '',
          barcode: '',
          promotions: [],
        }));
        this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
      },
      async getTotalOrders() {
        const orderModel = cms.getModel('Order');
        const condition = this.orderHistoryFilters.reduce((acc, filter) => ({ ...acc, ...filter['condition'] }), { status: 'paid' });
        this.totalOrders = await orderModel.countDocuments(condition);
      },
      async deleteOrder() {
        try {
          const orderModel = cms.getModel('Order');
          await orderModel.findOneAndUpdate({ '_id': this.orderHistoryCurrentOrder._id }, { status: 'cancelled' });
          const index = this.orderHistoryOrders.findIndex(o => o._id === this.orderHistoryCurrentOrder._id);
          this.orderHistoryOrders.splice(index, 1);
          this.orderHistoryCurrentOrder = null;
        } catch (e) {
          console.error(e)
        }
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
        const products = await productModel.find(condition).skip(limit * (currentPage - 1)).limit(limit);
        this.listProducts = products.map(p => ({
          _id: p._id,
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category.name,
          plastic: p.plastic,
          barcode: p.barcode
        }))
      },
      async getTotalProducts() {
        const productModel = cms.getModel('Product');
        const condition = this.productFilters.reduce((acc, filter) => ({ ...acc, ...filter['condition'] }), {});
        this.totalProducts = await productModel.countDocuments(condition);
      },
      async deleteSelectedProducts() {
        const productModel = cms.getModel('Product');
        if (this.selectedProduct && this.selectedProduct.length > 0) {
          await productModel.deleteMany({ '_id': { '$in': this.selectedProduct } });
        }

        // reset related fn buttons
        const settingModel = cms.getModel('PosSetting');
        await settingModel.findOneAndUpdate(
            {
              'leftFunctionButtons.buyback.product': { '$in': this.selectedProduct }
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
              'rightFunctionButtons.buyback.product': { '$in': this.selectedProduct }
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
        this.selectedProduct = [];
      },
      async createNewProduct(product) {
        const productModel = cms.getModel('Product');
        await productModel.create(product);
        await this.getListProducts();
        await this.getTotalProducts();
      },
      getAllTaxCategory() {
        const setting = cms.getList('PosSetting')[0];
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
        return listMaxOrder.find(o => o._id === categoryId).maxOrder;
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
        this.generalSetting = setting.generalSetting;
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
      getCompanyInfo() {
        const setting = cms.getList('PosSetting')[0];
        this.companyInfo = setting.companyInfo;
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
        const terminal = await terminalModel.findOne({name: 'Terminal 1'})
        this.thermalPrinter = terminal.thermalPrinters[0];
      },
      async updateThermalPrinter(oldPrinterId, newPrinter) {
        const terminalModel = cms.getModel('Terminal');
        if(!oldPrinterId) {
          await terminalModel.findOneAndUpdate(
              {name: 'Terminal 1'},
              {
                $push: {
                  thermalPrinters: newPrinter
                }
              }
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
              }
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
        this.articleSelectedColor = this.articleSelectedProductButton.layouts[0].color;
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
          _.forEach(this.activeCategoryProducts, async function (article, index) {
            if (article.layouts[0].order !== index + 1) {
              await productModel.findOneAndUpdate({ 'layouts._id': article.layouts[0]._id }, {
                '$set': {
                  'layouts.$.order': index + 1
                }
              });
              return article.layouts[0].order = index + 1;
            }
            return article.layouts[0].order;
          });
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
        const layoutID = this.articleSelectedProductButton.layouts[0]._id;
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
              foundItem.layouts[0].color = this.articleSelectedColor;
            }
          } catch (e) {
            console.error(e)
          }
        }
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
            let tempNextItemOrder = foundNextItem.layouts[0].order;
            let tempCurrItemOrder = foundItem.layouts[0].order;

            //Update db order
            const productModel = cms.getModel('Product')
            const nextProductLayoutID = foundNextItem.layouts[0]._id;
            const currentProductLayoutID = foundItem.layouts[0]._id;
            try {
              let currentItemResult = await productModel.findOneAndUpdate({ 'layouts._id': currentProductLayoutID }, {
                '$set': {
                  'layouts.$.order': foundNextItem.layouts[0].order
                }
              });

              let nextItemResult = await productModel.findOneAndUpdate({ 'layouts._id': nextProductLayoutID }, {
                '$set': {
                  'layouts.$.order': foundItem.layouts[0].order
                }
              });

              if (nextItemResult && currentItemResult) {
                foundNextItem.layouts[0].order = tempCurrItemOrder;
                foundItem.layouts[0].order = tempNextItemOrder;
              }
            } catch (e) {
              console.error(e);
            }

            this.activeCategoryProducts = this.activeCategoryProducts.sort((current, next) => this.getProductGridOrder(current) - this.getProductGridOrder(next))
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
      getPosSetting() {
        return cms.getList('PosSetting')[0]
      },
      //<!--</editor-fold>-->

      //<!--<editor-fold desc="Button functions">-->
      isActiveFnBtn(btn) {
        if (!btn || !btn.buttonFunction) return
        if (btn.buttonFunction === 'changePrice' || btn.buttonFunction.includes('discount')) {
          return !_.isNil(this.activeTableProduct)
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
      buybackProduct({price, product, unit}) {
        this.addProductToOrder(Object.assign(_.omit(product, 'attributes'), {
          price: -price,
          originalPrice: -price,
          tax: 0
        }))
      },
      changePrice() {
        this.$getService('dialogChangePrice:open')('new')
      },
      discountSingleItemDialog() {
        this.$getService('dialogChangePrice:open')('percentage')
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
        this.paymentAmountTendered = this.paymentTotal
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
          category: item.category.name,
          date
        }))
      },
      getComputedTax(product) {
        return product.price * (1 - 1 / (1 + product.tax / 100))
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
        return dayjs(dateTime).format('YYMMDDHHmmssms')
      },
      getVDate(dateTime, beginHour) {
        const [hour, minutes] = beginHour.split(':')
        const beginDateTime = dayjs(dateTime).clone().hour(parseInt(hour)).minute(parseInt(minutes))

        if (dayjs(dateTime).isBefore(beginDateTime)) {
          return beginDateTime.subtract(1, 'day').startOf('day').toDate()
        }

        return beginDateTime.startOf('day').toDate()
      }
      //<!--</editor-fold>-->
    },
    created() {
      const cachedPageSize = localStorage.getItem('orderHistoryPageSize')
      if (cachedPageSize) this.orderHistoryPagination.limit = parseInt(cachedPageSize)
      this.orderHistoryCurrentOrder = this.orderHistoryOrders[0];
      this.user = cms.getList('PosSetting')[0].user[0]
    },
    watch: {
      'orderHistoryPagination.limit'(newVal) {
        localStorage.setItem('orderHistoryPageSize', newVal)
      }
    },
    provide() {
      return {
        // login
        loginPassword: this.loginPassword,
        login: this.login,
        resetIncorrectPasscodeFlag: this.resetIncorrectPasscodeFlag,
        user: this.user,

        //order screen
        activeProductWindow: this.activeProductWindow,
        activeTableProduct: this.activeTableProduct,
        activeProducts: this.activeProducts,
        scrollWindowProducts: this.scrollWindowProducts,
        activeProduct: this.activeProduct,
        convertMoney: this.convertMoney,
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
        createNewProduct: this.createNewProduct,
        getAllTaxCategory: this.getAllTaxCategory,
        getHighestProductOrder: this.getHighestProductOrder,
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
        //article screen
        selectArticle: this.selectArticle,
        articleSelectedProductButton: this.articleSelectedProductButton,
        setSelectedArticleColor: this.setSelectedArticleColor,
        articleSelectedColor: this.articleSelectedColor,
        switchProductOrder: this.switchProductOrder,
        updateArticleOrders: this.updateArticleOrders,
        getPosSetting: this.getPosSetting,
        // leftButtonsUpdate: this.leftButtonsUpdate,
        // rightButtonsUpdate: this.rightButtonsUpdate
      }
    }
  }
</script>

<style scoped>

</style>
