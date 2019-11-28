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
        //order screen
        // listProducts: [
        // 	[
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 	],
        // 	[
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'red accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'green accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 	],
        // 	[
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'green accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'brown lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 		{ title: 'Tiramisu', color: 'pink lighten 4' },
        // 		{ title: 'Tiramisu', color: 'teal accent 1' },
        // 		{ title: 'Tiramisu', color: 'blue lighten 3' },
        // 		{ title: 'Tiramisu', color: 'yellow accent 1' },
        // 	],
        // ],
        activeTableProduct: null, //todo move to table component
        //// legit store
        currentOrder: [],
        activeCategory: null, //todo use fn to load products?
        activeCategoryProducts: [],
        productIdQuery: '',
        //payment screen variables
        paymentAmountTendered: 0,
        paymentTip: 0,
        paymentDiscount: 0,
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
      paymentChange() {
        return this.convertMoney(this.paymentAmountTendered - this.paymentTotal)
      },
      orderRawTotal() {
        if (this.currentOrder) {
          return this.currentOrder.reduce((acc, cur) => {
            const price = cur.product.price * cur.quantity
            return acc + price
          }, 0)
        }
        return 0
      },
      paymentTax() {
        if (this.currentOrder) {
          return this.currentOrder.reduce((acc, cur) => {
            return acc + cur.product.tax * cur.quantity
          }, 0)
        }
        return 0
      },
      paymentSubTotal() {
        return this.orderRawTotal - this.paymentDiscount
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
        this.activeCategoryProducts = await productModel.find({
          category: this.activeCategory._id
        })
      },
      addProductToOrder(product) {
        if (this.currentOrder && product) {
          const existingProduct = this.currentOrder.find(i => i.product === product);
          if (existingProduct) {
            existingProduct.quantity = existingProduct.quantity + 1;
          } else {
            this.currentOrder.push({ product, quantity: 1 })
          }
        } else {
          this.currentOrder = [
            { product, quantity: 1 }
          ]
        }
      },
      addItemQuantity(item) {
        const itemToUpdate = this.currentOrder.find(i => i.product._id === item._id)
        itemToUpdate.quantity ++
      },
      removeItemQuantity(item) {
        const itemToUpdate = this.currentOrder.find(i => i.product._id === item._id)
        if (itemToUpdate.quantity - 1 === 0) {
          this.currentOrder.splice(this.currentOrder.indexOf(itemToUpdate), 1)
        } else {
          itemToUpdate.quantity --
        }
      },
      findProductsByBarcode() {

      },
      //
      convertMoney(val) {
        if (val && typeof (val) === 'number') {
          return val.toFixed(2)
        } else {
          return 0
        }
      },
      quickCash() {
        this.lastPayment = +this.paymentTotal;
        //todo add to order history
        this.currentOrder = []
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
        productIdQuery: this.productIdQuery,
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
