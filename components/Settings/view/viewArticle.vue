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
				<th class="ta-right" @click="openPriceFilters">
					Price
					<g-icon size="12">mdi-filter</g-icon>
				</th>
				<th @click="openCategoryFilters">
					Category
					<g-icon size="12">mdi-magnify</g-icon>
				</th>
				<th @click="openBarcodeFilters">
					Bar Code
					<g-icon size="12">mdi-magnify</g-icon>
				</th>
			</tr>
			</thead>
			<tr class="sticky">
				<td class="bg-grey-lighten-1">
					<g-checkbox v-if="products && products.length !== 0" v-model="selectedProductIDs" :value="listIDs" multiple>
						<template v-slot:label>
							<g-icon size="16" class="mb-1">fas fa-caret-down</g-icon>
						</template>
					</g-checkbox>
					<g-checkbox v-else/>
				</td>
				<td colspan="6" class="filter-wrapper" style="height: 48px">
					<div class="filter">
						Filter
						<div class="group-chip">
							<g-chip v-for="(filter, i) in productFilters" :key="filter.title+i" label small background-color="white" close class="ma-1" @close="removeFilter(filter)">
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
			<tr v-for="(product, i) in products" :key="i">
				<td>
					<g-checkbox v-model="selectedProductIDs" :value="product._id" @change="getFirstSelectedProduct"/>
				</td>
				<td class="ta-center" @click.stop="selectProduct(product)">{{product.id}}</td>
				<td @click.stop="selectProduct(product)">{{product.name}}</td>
				<td class="ta-right" @click.stop="selectProduct(product)">€ {{product.price.toFixed(2)}}</td>
				<td class="ta-center" @click.stop="selectProduct(product)">{{product.category && product.category.name}}</td>
				<td class="ta-center" @click.stop="selectProduct(product)">{{product.barcode}}</td>


			</tr>
		</g-simple-table>
		<pos-table-pagination @execQueryByPage="updatePagination"
													:total-document="totalProducts"
													:limit.sync="limit"
													:current-page.sync="currentPage"/>
	</div>
</template>

<script>
	export default {
    name: 'viewArticle',
		injectService: [
		  'PosStore:getListProducts',
		  'PosStore:listProducts',
		  'PosStore:productFilters',
		  'PosStore:selectedProductIDs',
		  'PosStore:totalProducts',
		  'PosStore:getTotalProducts',
		  'PosStore:productPagination',
		  'PosStore:selectedProduct',
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
			async updatePagination() {
				await this.getListProducts();
			},
			selectProduct(product) {
      	const index = this.selectedProductIDs.findIndex(p => p === product._id);
      	if(index === -1)
					this.selectedProductIDs.push(product._id);
      	else
      		this.selectedProductIDs.splice(index, 1);
				this.getFirstSelectedProduct()
			},
			getFirstSelectedProduct() {
      	if(this.selectedProductIDs.length > 0){
      		this.selectedProduct = this.listProducts.find(p => p._id === this.selectedProductIDs[0])
				} else {
					this.selectedProduct = null;
				}
			}
		},
		async created() {
    	await this.getTotalProducts();
      await this.getListProducts();
		},
		beforeDestroy() {
      this.selectedProductIDs = [];
    }
  }
</script>

<style scoped lang="scss">
  .g-table {
		height: calc(100% - 64px);
		margin-left: 1px;

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
			height: 33px
		}

		tr td:first-child,
		tr th:first-child {
			padding-right: 0;
		}

		tr {
			td:nth-child(1),
			th:nth-child(1)  {
				width: 10%;
			}
			td:nth-child(2):not(.filter-wrapper),
			th:nth-child(2)  {
				width: 15%;
			}
			td:nth-child(3),
			th:nth-child(3)  {
				width: 20%;
			}
			td:nth-child(4),
			th:nth-child(4)  {
				width: 15%;
			}
			td:nth-child(5),
			th:nth-child(5)  {
				width: 20%;
			}
			td:nth-child(6),
			th:nth-child(6)  {
				width: 20%;
			}
		}

		.sticky {
			td {
				position: sticky;
				z-index: 2;
				top: 48px;
			}
		}

		.filter-wrapper {
			background-color: #bdbdbd;

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
	}
</style>
