<template>
	<div style="height: 100%">
		<g-simple-table striped fixed-header>
			<thead>
			<tr>
				<th></th>
				<th class="ta-left" @click="openIDFilters">
					Product ID
					<g-icon size="12">mdi-magnify</g-icon>
				</th>
				<th class="ta-left" @click="openNameFilters">
					Name
					<g-icon size="12">mdi-filter</g-icon>
				</th>
				<th @click="openPriceFilters">
					Price
					<g-icon size="12">mdi-filter</g-icon>
				</th>
				<th @click="openCategoryFilters">
					Category
					<g-icon size="12">mdi-magnify</g-icon>
				</th>
				<th @click="openPlasticFilters">
					Plastic (€)
					<g-icon size="12">mdi-filter</g-icon>
				</th>
				<th @click="openBarcodeFilters">
					Bar Code
					<g-icon size="12">mdi-magnify</g-icon>
				</th>
			</tr>
			</thead>
			<tr class="sticky">
				<td class="bg-grey-lighten-1">
					<g-checkbox v-model="selectedProduct" :value="listIDs" multiple>
						<template v-slot:label>
							<g-icon size="16" class="mb-1">fas fa-caret-down</g-icon>
						</template>
					</g-checkbox>
				</td>
				<td colspan="6" class="bg-grey-lighten-1">
					<div class="filter">
						Filter
						<div class="group-chip">
							<g-chip v-for="filter in productFilters" label small background-color="white" close class="ma-1" @close="removeFilter(filter)">
								<div>
									<span class="chip-title">{{filter.title}}: </span>
									<span class="chip-content">{{filter.text}}</span>
								</div>
							</g-chip>
						</div>
						<g-btn :uppercase="false" text v-if="productFilters && productFilters.length > 0" @click="clearFilter"><u>Clear All</u></g-btn>
					</div>
				</td>
			</tr>
			<tr v-for="product in products">
				<td>
					<g-checkbox v-model="selectedProduct" :value="product._id"/>
				</td>
				<td class="ta-center">{{product.id}}</td>
				<td>{{product.name}}</td>
				<td class="ta-right">€ {{product.price.toFixed(2)}}</td>
				<td class="ta-center">{{product.category}}</td>
				<td class="ta-center">{{product.plastic ? product.plastic : '-'}}</td>
				<td class="ta-center">{{product.barcode}}</td>
			</tr>
		</g-simple-table>
		<pos-table-pagination @execQueryByPage="updatePagination"
													:total-document="totalProducts"
													:limit.sync="limit"
													:current-page.sync="currentPage"/>
	</div>
</template>

<script>
	import PosTablePagination from '../../pos-shared-components/PosTablePagination';
	export default {
    name: 'viewArticle',
		components: { PosTablePagination },
		injectService: [
		  'PosStore:getListProducts',
		  'PosStore:listProducts',
		  'PosStore:productFilters',
		  'PosStore:selectedProduct',
		  'PosStore:totalProducts',
		  'PosStore:getTotalProducts',
		  'PosStore:productPagination',
		],
		data () {
			return {
			}
		},
		computed: {
      products() {
        return this.listProducts
			},
      listIDs() {
        return this.listProducts.map(p => p._id);
			},
			limit: {
      	get() {
      		return this.productPagination.limit;
				},
				async set(val) {
					this.productPagination.limit = val;
					await this.getListProducts();
				}
			},
			currentPage: {
				get() {
					return this.productPagination.currentPage;
				},
				async set(val) {
					this.productPagination.currentPage = val;
					await this.getListProducts();
				}
			}
		},
		methods: {
      async clearFilter() {
        this.productFilters = [];
				await this.getTotalProducts();
        await this.getListProducts();
			},
			async removeFilter(filter) {
				const index = this.productFilters.findIndex(f => f.title === filter.title);
				this.productFilters.splice(index, 1)
				await this.getTotalProducts();
				await this.getListProducts();
			},
      openIDFilters() {
        this.$getService('dialogProductIDFilter:setActive')(true);
			},
      openBarcodeFilters() {
        this.$getService('dialogProductBarcodeFilter:setActive')(true);
			},
      openNameFilters() {
        this.$getService('dialogProductNameFilter:setActive')(true);
			},
      openPriceFilters() {
        this.$getService('dialogProductPriceFilter:setActive')(true);
			},
      openCategoryFilters() {
        this.$getService('dialogProductCategoryFilter:setActive')(true);
			},
      openPlasticFilters() {
        this.$getService('dialogProductPlasticFilter:setActive')(true);
			},
			async updatePagination() {
				await this.getListProducts();
			}
		},
		async created() {
    	await this.getTotalProducts();
      await this.getListProducts();
		},
		beforeDestroy() {
      this.selectedProduct = [];
    }
  }
</script>

<style scoped lang="scss">
  .g-table {
		height: calc(100% - 64px);

		thead tr th {
			font-size: 14px;
			color: #1d1d26;
			padding: 0 8px;
			background-color: #fff;
			cursor: pointer;
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

		.sticky {
			td {
				position: sticky;
				z-index: 2;
				top: 48px;
			}
		}

		.filter {
			color: #1d1d26;
			font-size: 13px;
			line-height: 16px;
			font-weight: 700;
			display: flex;
			align-items: center;
			padding-left: 12px;

			.group-chip {
				display: flex;
				flex-wrap: nowrap;
				overflow: auto;
				margin: 0 4px;

				&::-webkit-scrollbar {
					display: none;
				}

				::v-deep .g-chip {
					overflow: visible;
				}

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
	}
</style>