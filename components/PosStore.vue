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
				dialogProductSearch: false,
			}
    },
		domain: 'PosStore',
    computed: {},
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
				dialogProductSearch: this.dialogProductSearch,
				convertMoney: this.convertMoney
			}
		}
  }
</script>

<style scoped>

</style>
