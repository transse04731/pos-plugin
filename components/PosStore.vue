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
				paymentOrderDetail: this.paymentOrderDetail
			}
		}
  }
</script>

<style scoped>

</style>
