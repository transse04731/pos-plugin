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
				activeProductWindow: 0,
				listProducts: [
					[
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
					],
					[
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'red accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'green accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
					],
					[
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'green accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'brown lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
						{ title: 'Tiramisu', color: 'pink lighten 4' },
						{ title: 'Tiramisu', color: 'teal accent 1' },
						{ title: 'Tiramisu', color: 'blue lighten 3' },
						{ title: 'Tiramisu', color: 'yellow accent 1' },
					],
				],
				//payment screen variables
				paymentTotal: 40.00,
				paymentAmountTendered: 100.00,
				paymentTip: 0,
				paymentDiscount: -0.50,
				paymentTax: 0.50,
				paymentSubTotal: 40.0,
				paymentOrderDetail: [
					{
						id: 1,
						name: 'Product item 1',
						unit: 'piece',
						quantity: 1,
						price: '5.52',
					},
					{
						id: 2,
						name: 'Product item 1',
						unit: 'piece',
						quantity: 1,
						price: '5.52',
						edited: true,
					},
					{
						id: 3,
						name: 'Product item 1',
						unit: 'piece',
						quantity: 1,
						price: '5.52',
					},
					{
						id: 4,
						name: 'Product item 1',
						unit: 'piece',
						quantity: 1,
						price: '5.52',
						oldPrice: '7.52',
						promotion: 'Promotion A',
					},
				],
				lastPayment: 0,
				//settings screen
				sidebarData: [
					{
						title: 'Product', icon: 'icon-liefer_packet', svgIcon: true, badge: '3', badgeColor: '#FF9529',
						items: [
							{ title: 'Articles', icon: 'radio_button_unchecked', iconType: 'small', isView: true },
							{ title: 'Category', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/category' */},
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
			}
		},
    methods: {
			convertMoney(val) {
				if (val && typeof (val) === 'number') {
					return val.toFixed(2)
				} else {
					return 0
				}
			},
			quickCash() {
				this.lastPayment = +this.paymentTotal
				this.paymentTotal = 0;
				this.paymentTax = 0;
				this.paymentDiscount = 0;
				this.paymentSubTotal = 0;
				this.paymentOrderDetail = [];
			}
		},
		mounted() {
		},
		provide() {
      return {
				loginPassword: this.loginPassword,
				activeProductWindow: this.activeProductWindow,
				listProducts: this.listProducts,
				convertMoney: this.convertMoney,
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
