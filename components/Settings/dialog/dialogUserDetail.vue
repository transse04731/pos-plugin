<template>
	<g-dialog v-model="dialogUserDetail" overlay-color="#6b6f82" overlay-opacity="0.95" width="90%" lazy>
		<div class="dialog-user w-100">
			<div class="form">
				<div class="input">
					<pos-text-field large label="User Name"/>
					<pos-text-field large label="Passcode"/>
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
</template>

<script>
  import PosTextField from '../../pos-shared-components/POSInput/PosTextField';
  import PosKeyboardFull from '../../pos-shared-components/PosKeyboardFull';
  export default {
    name: 'dialogUserDetail',
    components: { PosKeyboardFull, PosTextField },
		props: {
      value: null,
		},
		computed: {
      dialogUserDetail: {
        get() {
          return this.value;
				},
				set(val) {
          this.$emit('input', val);
				}
			}
		}
  }
</script>

<style scoped lang="scss">
	.dialog-user {
		background-color: white;

		.form {
			padding: 16px;

			.input {
				display: flex;
			}

			.action {
				display: flex;
				justify-content: flex-end;
				padding-top: 24px;
			}
		}
	}
</style>