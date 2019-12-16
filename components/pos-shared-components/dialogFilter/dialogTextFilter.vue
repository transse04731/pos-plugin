<template>
	<g-dialog v-model="internalValue" width="90%">
		<div class="wrapper">
			<g-icon @click="internalValue = false" svg size="20" class="icon">icon-close</g-icon>
			<div class="screen">
				<pos-text-field v-model="screenValue" large :label="label" readOnly/>
				<div class="buttons">
					<g-btn :uppercase="false" text @click="internalValue = false" backgroundColor="#EFEFEF" text-color="#757575" width="120" class="mr-2">
						Cancel
					</g-btn>
					<g-btn :uppercase="false" text @click="submit" backgroundColor="#2979FF" text-color="#FFFFFF" width="120">
						OK
					</g-btn>
				</div>
			</div>
			<div class="keyboard">
				<pos-keyboard-full v-model="screenValue"/>
			</div>
		</div>
	</g-dialog>
</template>

<script>
  //import PosTextField from '../POSInput/PosTextField';
  //import PosKeyboardFull from '../PosKeyboardFull';

  export default {
    name: 'dialogTextFilter',
    //components: { PosKeyboardFull, PosTextField },
    props: {
      label: String,
      value: null,
    },
    data() {
      return {
        screenValue: ''
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value || false
        },
        set(value) {
          this.$emit('input', value)
        }
      },
    },
    methods: {
      async submit() {
        this.$emit('submit', this.screenValue);
        this.internalValue = false;
      },
    }
  }
</script>

<style scoped lang="scss">
	.wrapper {
		background-color: #FFFFFF;
		padding: 16px;
		width: 100%;

		.icon {
			float: right;
		}
	}

	.bs-tf-wrapper {
		width: 50%;

		::v-deep .bs-tf-label {
			margin-bottom: 16px;
			font-size: 16px;
			line-height: 20px;
			font-weight: 700;
			color: #1d1d26;
		}
	}

	.buttons {
		height: 96px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 4px;
	}

	.keyboard {
		height: 236px;
		background-color: #BDBDBD;
		padding: 16px;
		margin: 0 -16px -16px -16px;
	}
</style>
