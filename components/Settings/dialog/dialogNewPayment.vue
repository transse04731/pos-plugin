<template>
	<g-dialog v-model="dialogNewPayment" fullscreen>
		<div class="dialog-payment w-100">
			<div class="form">
				<p class="ml-1 mb-3">{{ isEditPayment && selectedPayment ? 'Edit' : 'Create New' }} Payment</p>
				<pos-text-field style="width: 268px" label="Name" placeholder="Payment name" v-model="computedName"/>
				<pos-file-input-image label="Icon" v-model="computedSrc"/>
			</div>
			<div class="keyboard-wrapper">
				<pos-keyboard-full v-model="computedName"/>
			</div>
			<g-toolbar bottom color="grey lighten 3">
				<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="ma-2" @click="dialogNewPayment = false">
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
	/*import PosTextField from '../../pos-shared-components/POSInput/PosTextField';
	import PosFileInput from '../../pos-shared-components/POSInput/PosFileInputImage';
	import PosKeyboardFull from '../../pos-shared-components/PosKeyboardFull';*/

  export default {
    name: 'dialogNewPayment',
    //components: { PosKeyboardFull, PosFileInput, PosTextField },
		injectService: [
			'PosStore:isEditPayment',
			'PosStore:selectedPayment',
			'PosStore:updatePayment',
		],
    data() {
      return {
				name: '',
				src: null,
				isParsedName: false,
				isParsedIcon: false,
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      dialogNewPayment: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
			computedName: {
				get() {
					if (this.isEditPayment && this.selectedPayment && !this.isParsedName) {
						this.name = this.selectedPayment.name;
						this.isParsedName = true;
					}
					return this.name;
				},
				set(val) {
					this.name = val;
				}
			},
			computedSrc: {
				get() {
					if (this.isEditPayment && this.selectedPayment && !this.isParsedIcon) {
						this.src = this.selectedPayment.icon;
						this.isParsedIcon = true;
					}
					return this.src;
				},
				set(val) {
					this.src = val;
				}
			}
    },
		methods: {
			async save() {
				if(this.computedName) {
					const payment = {
						name: this.computedName,
						icon: this.computedSrc,
					}
					let oldPayment;
					if(this.isEditPayment) oldPayment = this.selectedPayment;
					await this.updatePayment(oldPayment, payment);
				}
				this.name = '';
				this.src = '';
				this.selectedPayment = null;
				this.isParsedName = false;
				this.isParsedIcon = false;
				this.dialogNewPayment = false;
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
		}

		::v-deep .keyboard-wrapper {
			position: absolute;
			bottom: 64px;
			height: 35%;
			width: 100%;
			padding: 16px;
			background-color: #BDBDBD;
		}
	}

</style>
