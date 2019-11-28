<template>
	<div>
		<div>
			<g-simple-table striped>
					<tr>
						<th>Name</th>
						<th>Icon</th>
					</tr>
					<tr v-for="payment in payments">
						<td>{{payment.name}}</td>
						<td><g-icon svg>{{payment.icon}}</g-icon></td>
					</tr>
			</g-simple-table>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'viewPayment',
		data() {
      return {
        payments: [
					{ name: 'Cash', icon: 'icon-cash'},
					{ name: 'Card', icon: 'icon-credit_card'},
					{ name: 'Paypal', icon: 'icon-paypal'},
				]
			}
		}
  }
</script>

<style scoped lang="scss">
	.g-table {
		tr th {
			color: #1d1d26;
			text-align: left;
		}

		th:first-child, td:first-child {
			width: 200px;
		}

		td {
			height: 32px
		}
	}
</style>