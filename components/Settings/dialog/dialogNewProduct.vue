<template>
	<div>
		<g-dialog v-model="dialogNewProduct" fullscreen scrollable>
			<div class="dialog-product w-100">
				<div class="form">
					<div class="title">
						Create New Product
					</div>
					<div class="input">
						<pos-text-field label="Name" required placeholder="Fill your number" @focus="openDialogDetail"/>
						<pos-select label="Tax Category" :items="items" item-text="value" v-model="selected" append-icon="mdi-chevron-down" required/>
						<pos-text-field label="Product ID" placeholder="Auto generate" disabled/>
						<pos-select label="Product Category" :items="items" item-text="value" v-model="selected" append-icon="mdi-chevron-down" required/>
						<pos-select label="Unit" :items="items2" item-text="value" v-model="selected2" append-icon="mdi-chevron-down"/>
						<div></div>
						<div class="row-flex">
							<div class="col-6">
								<pos-text-field label="Price" required placeholder="Fill your number">
									<template v-slot:append>
										<span style="color: #1471ff">€</span>
									</template>
								</pos-text-field>
							</div>
							<div class="col-6">
								<pos-text-field label="Barcode/PLU" placeholder="Fill your number">
									<template v-slot:append>
										<g-icon svg>icon-scanning_barcode</g-icon>
									</template>
								</pos-text-field>
							</div>
						</div>
						<div></div>
						<div></div>
						<div class="row-flex">
							<div class="col-6">
								<pos-switch dense label="Favorite" :input-value="true"/>
							</div>
							<div class="col-6">
								<pos-switch dense label="Non-Refundable" :input-value="true"/>
							</div>
						</div>
						<div class="row-flex justify-between">
							<pos-switch dense label="Active" :input-value="true"/>
							<pos-switch dense label='Show on "Order Screen"' :input-value="true"/>
						</div>
						<pos-switch dense label="Manual Price" :input-value="true"/>
					</div>
					<div class="accordion">
						<g-expansion accordion v-model="expansionItem" :items="expansions" item-header="name">
						</g-expansion>
					</div>
				</div>
				<g-toolbar absolute bottom color="grey lighten 3">
					<g-btn :uppercase="false" @click="openDialogDetail">Open</g-btn>
					<g-spacer/>
					<g-btn :uppercase="false" outlined class="mr-2" width="120">Cancel</g-btn>
					<g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" width="120">Submit</g-btn>
				</g-toolbar>
			</div>
		</g-dialog>
		<g-dialog v-model="dialogNewProductDetail" overlay-color="#6b6f82" overlay-opacity="0.95" width="90%" lazy>
			<div class="dialog-product w-100">
				<div class="form__detail">
					<div class="input__detail">
						<pos-text-field label="Name" required placeholder="Fill your number"/>
						<pos-text-field label="Product ID" placeholder="Auto generate" disabled/>
						<pos-text-field label="Price" required placeholder="Fill your number">
							<template v-slot:append>
								<span style="color: #1471ff">€</span>
							</template>
						</pos-text-field>
						<pos-text-field label="Barcode/PLU" placeholder="Fill your number">
							<template v-slot:append>
								<g-icon svg>icon-scanning_barcode</g-icon>
							</template>
						</pos-text-field>
					</div>
					<div class="action">
						<g-btn :uppercase="false" outlined class="mr-2" width="120" @click="dialogNewProductDetail = false">Cancel</g-btn>
						<g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" width="120">OK</g-btn>
					</div>
				</div>
				<div class="bg-grey-lighten-1 pa-2">
					<pos-keyboard-full/>
				</div>
			</div>
		</g-dialog>
	</div>
</template>

<script>
  /*import PosKeyboardFull from '../../pos-shared-components/PosKeyboardFull';
  import PosTextField from '../../pos-shared-components/POSInput/PosTextField';
  import PosSwitch from '../../pos-shared-components/PosSwitch';
  import PosSelect from '../../pos-shared-components/POSInput/PosSelect';*/

  export default {
    name: 'dialogNewProduct',
    //components: { PosSelect, PosSwitch, PosTextField, PosKeyboardFull },
    data() {
      return {
        selected: null,
        items: [{ value: 'Vegetables' }],
        selected2: null,
        items2: [{ value: 'Box' }],
        expansions: [
          { name: 'Multiple Unit' },
          { name: 'Attributes' },
          { name: 'More' },
        ],
        expansionItem: null,
        dialogNewProductDetail: false,
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      dialogNewProduct: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    },
    created() {
      this.selected = 'Vegetables';
      this.selected2 = 'Box';
    },
		methods: {
      openDialogDetail() {
        //todo onfocus textfield wont trigger click outside
				this.dialogNewProductDetail = true
			}
		}
  }
</script>

<style scoped lang="scss">
	.dialog-product {
		display: flex;
		flex-direction: column;
		background-color: white;
		overflow-y: auto;

		.form {
			padding: 48px;

			.title {
				padding-left: 27px;
				font-size: 16px;
				line-height: 20px;
				color: #1d1d26;
				font-weight: 700;
				margin-bottom: 16px;
			}

			.input {
				display: grid;
				grid-gap: 12px 4px;
				grid-template-columns: 39.6% 30.2% 30.2%;
				grid-template-rows: auto auto auto auto;
				padding: 0 48px;

				.g-switch-wrapper {
					margin-top: 0;
				}
			}

			.g-expansion-group {
				box-shadow: none;

				::v-deep .g-expansion,
				::v-deep .g-expansion > .g-expansion-header {
					border: none;
					padding: 0;
					font-size: 16px;
					line-height: 20px;
					min-height: 42px;
					font-weight: 700;

					.g-expansion-header-prepend {
						width: 16px;
						color: #919191;
					}
				}

				::v-deep .g-expansion .g-expansion-content {
					background-color: white;
					border: none;
				}
			}
		}

		.form__detail {
			padding: 16px;

			.input__detail {
				padding: 24px 128px;
				display: grid;
				grid-template-rows: 1fr 1fr;
				grid-template-columns: 1fr 1fr;
				grid-gap: 16px 64px;
			}

			.action {
				display: flex;
				justify-content: flex-end;
			}
		}

		::v-deep .g-btn__outlined {
			border: 1px solid #979797;
			color: #1d1d26;
		}
	}
</style>
