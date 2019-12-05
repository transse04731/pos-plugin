<template>
	<g-dialog v-model="dialogNewCategory" width="90%">
		<div class="dialog-payment w-100">
			<div class="form">
				<p class="ml-1 mb-3">
					{{ isEditCategory && selectedCategory ? 'Edit' : 'Create New' }}
					Category</p>
				<pos-text-field style="width: 268px" label="Name" placeholder="Category name" v-model="computedName"/>
				<div class="row-flex justify-end py-5">
					<g-btn :uppercase="false" outlined class="mr-3" width="120" @click="dialogNewCategory = false">
						Cancel
					</g-btn>
					<g-btn :uppercase="false" flat background-color="blue accent 3" width="120" text-color="white" @click="save">
						OK
					</g-btn>
				</div>
			</div>
			<div class="keyboard-wrapper">
				<pos-keyboard-full v-model="computedName"/>
			</div>
		</div>
	</g-dialog>
</template>

<script>
  import PosTextField from '../../pos-shared-components/POSInput/PosTextField';
  import PosFileInput from '../../pos-shared-components/POSInput/PosFileInputImage';
  import PosKeyboardFull from '../../pos-shared-components/PosKeyboardFull';

  export default {
    name: 'dialogNewCategory',
    injectService: [
      'PosStore:isEditCategory',
      'PosStore:selectedCategory',
      'PosStore:updateCategory',
    ],
    components: { PosKeyboardFull, PosFileInput, PosTextField },
    data() {
      return {
        name: '',
        isParsedValue: false
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      dialogNewCategory: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      computedName: {
        get() {
          if (this.isEditCategory && this.selectedCategory && !this.isParsedValue) {
            this.name = this.selectedCategory._id;
            this.isParsedValue = true;
          }
          return this.name;
        },
        set(val) {
          this.name = val;
        }
      }
    },
    created() {
    },
    methods: {
      async save() {
        if (this.computedName) {
          let oldName;
          if (this.isEditCategory) oldName = this.selectedCategory && this.selectedCategory._id;
          await this.updateCategory(oldName, this.computedName);
        }
        this.computedName = '';
        this.selectedCategory = null;
        this.dialogNewCategory = false;
      },
    }
  }
</script>

<style scoped lang="scss">
	.dialog-payment {
		background-color: white;
		display: flex;
		flex-direction: column;

		.form {
			padding: 32px 16px 0;
			color: #1d1d26;
			font-weight: 700;

			.g-btn__outlined {
				border: 1px solid #979797;
				color: #1d1d26;
			}
		}

		::v-deep .keyboard-wrapper {
			padding: 16px;
			background-color: #BDBDBD;
		}
	}

</style>