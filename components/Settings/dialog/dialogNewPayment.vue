<template>
	<g-dialog v-model="dialogNewPayment" fullscreen eager>
		<div class="dialog-payment w-100">
			<div class="form">
				<p class="ml-1 mb-3">{{ isEditPayment && selectedPayment ? 'Edit' : 'Create New' }} Payment</p>
				<pos-text-field style="width: 268px" label="Name" placeholder="Payment name" v-model="name"/>
				<pos-switch dense label="Editable" v-model="editable"></pos-switch>
				<pos-file-input-image label="Icon" v-model="src"/>
			</div>
			<div class="keyboard-wrapper">
				<pos-keyboard-full v-model="name"/>
			</div>
			<g-toolbar bottom color="grey lighten 3">
				<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="ma-2" @click="back">
					<g-icon class="mr-2" svg>
						icon-back
					</g-icon>
					Back
				</g-btn>
				<g-spacer/>
				<g-btn :uppercase="false" background-color="blue accent 3" text-color="white" class="ma-2" @click="save">
					Save
				</g-btn>
			</g-toolbar>
		</div>
	</g-dialog>
</template>

<script>
  export default {
    name: 'dialogNewPayment',
		injectService: [
			'PosStore:selectedPayment',
			'PosStore:updatePayment',
		],
    data() {
      return {
				name: '',
				src: null,
				editable: true,
				isEditPayment: false,
				internalValue: false,
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      dialogNewPayment: {
        get() {
          return this.internalValue;
        },
        set(val) {
          this.internalValue = val;
        }
      },
    },
		methods: {
    	open(isEdit) {
    		this.isEditPayment = isEdit;
				if (this.isEditPayment && this.selectedPayment) {
					this.name = this.selectedPayment.name;
					this.src = this.selectedPayment.icon;
					this.editable = this.selectedPayment.editable;
				} else {
					this.name = '';
					this.src = '';
					this.editable = true;
				}
    		this.dialogNewPayment = true;
			},
    	resetData() {
				this.name = '';
				this.src = '';
				this.editable = true;
				this.selectedPayment = null;
				this.isEditPayment = false;
			},
			back() {
    		this.resetData();
				this.dialogNewPayment = false;
			},
			async save() {
				if(this.name) {
					const payment = {
						name: this.name.toLowerCase(),
						icon: this.src,
						editable: this.editable,
					}
					let oldPayment;
					if(this.isEditPayment) oldPayment = this.selectedPayment;
					await this.updatePayment(oldPayment, payment);
				}
				this.back();
			},
		},
  }
</script>

<style scoped lang="scss">
	.dialog-payment {
		background-color: white;
		display: flex;
		flex-direction: column;

		.form {
			padding: 32px 32px 0;
			color: #1d1d26;
			font-weight: 700;

			.g-switch-wrapper {
				margin-top: 24px;

				::v-deep .g-switch-label {
					font-size: 13px;
					line-height: 16px;
					font-weight: 400;
				}
			}

		}

		::v-deep .keyboard-wrapper {
			position: absolute;
			bottom: 64px;
			height: 30%;
			width: 100%;
			padding: 16px;
			background-color: #BDBDBD;
		}
	}

</style>
