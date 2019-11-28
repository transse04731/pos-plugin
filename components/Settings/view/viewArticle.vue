<template>
	<g-simple-table striped>
		<thead>
		<tr>
			<th></th>
			<th class="ta-left">
				Product ID
				<g-icon size="12">mdi-magnify</g-icon>
			</th>
			<th class="ta-left">
				Name
				<g-icon size="12">mdi-filter</g-icon>
			</th>
			<th>
				Price
				<g-icon size="12">mdi-filter</g-icon>
			</th>
			<th>
				Category
				<g-icon size="12">mdi-magnify</g-icon>
			</th>
			<th>
				Plastic (€)
				<g-icon size="12">mdi-filter</g-icon>
			</th>
			<th>
				Bar Code
				<g-icon size="12">mdi-magnify</g-icon>
			</th>
		</tr>
		</thead>
		<tr>
			<td class="bg-grey-lighten-1">
				<g-checkbox>
					<template v-slot:label>
						<g-icon size="16" class="mb-1">fas fa-caret-down</g-icon>
					</template>
				</g-checkbox>
			</td>
			<td colspan="6" class="bg-grey-lighten-1">
				<div class="filter">
					Filter
					<g-chip label background-color="white" close class="ml-2">
						<p>
							<span class="chip-title">Product ID:</span>
							<span class="chip-content"> '413'</span>
						</p>
					</g-chip>
					<g-chip label background-color="white" close class="ml-2">
						<p>
							<span class="chip-title">Category:</span>
							<span class="chip-content"> Vegetables</span>
						</p>
					</g-chip>
					<g-btn text><u>Clear All</u></g-btn>
				</div>
			</td>
		</tr>
		<tr v-for="product in products">
			<td>
				<g-checkbox/>
			</td>
			<td class="ta-center">{{product.id}}</td>
			<td>{{product.name}}</td>
			<td class="ta-right">€ {{product.price.toFixed(2)}}</td>
			<td>{{product.category}}</td>
			<td class="ta-right">{{product.plastic ? product.plastic : '-'}}</td>
			<td>{{product.barCode}}</td>
		</tr>
	</g-simple-table>
</template>

<script>
  export default {
    name: 'viewArticle',
		data () {
			return {
			  products: [
					{ id: '413431', name: 'Product Name 01', price: 431.00, category: 'Vegetables', plastic: 0.25, barCode: '19082213050555'},
					{ id: '413431', name: 'Product Name 02', price: 31.80, category: 'Vegetables', plastic: 0.5, barCode: '45174805917450'},
					{ id: '641325', name: 'Product Name 04', price: 5411.00, category: 'Vegetables', barCode: '51451451451451'},
					{ id: '414135', name: 'Product Name 34', price: 431.00, category: 'Vegetables', barCode: '68771457276871'},
					{ id: '254131', name: 'Product Name 12', price: 30.60, category: 'Vegetables', plastic: 0.75, barCode: '51656156156156'},
					{ id: '413556', name: 'Product Name 09', price: 40.00, category: 'Vegetables', barCode: '17586218671526'},
					{ id: '152413', name: 'Product Name 31', price: 84.00, category: 'Vegetables', barCode: '71571575261565'},
				]
			}
		}
  }
</script>

<style scoped lang="scss">
  .g-table {
		thead tr th {
			font-size: 14px;
			color: #1d1d26;
			padding: 0 8px;
		}

		tr td {
			padding: 0 8px;
			font-size: 13px;
			line-height: 16px;
		}

		tr td:first-child,
		tr th:first-child {
			padding-right: 0;
		}

		.filter {
			color: #1d1d26;
			font-size: 13px;
			line-height: 16px;
			font-weight: 700;
			display: flex;
			align-items: center;
			padding-left: 12px;

			.chip-title {
				color: #97A3B4;
				font-weight: 400;
				font-size: 11px;
			}

			.chip-content {
				color: #1D1D26;
				font-weight: 700;
				font-size: 12px;
			}
		}
	}
</style>