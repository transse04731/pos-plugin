<template>
  <g-dialog v-model="dialog" overlay-color="#6b6f82" overlay-opacity="0.95" width="40%" lazy>
    <g-card class="w-100">
      <g-card-title>
        Confirmation
      </g-card-title>
      <g-card-text>
        Are you sure you want to delete payment <b>"{{selectedPayment && selectedPayment.name}}"</b>?
      </g-card-text>
      <g-card-actions>
        <g-btn :uppercase="false" flat background-color="#efefef" @click="dialog = false">Cancel</g-btn>
        <g-btn :uppercase="false" flat background-color="red lighten 2" text-color="white" @click="submit">OK</g-btn>
      </g-card-actions>
    </g-card>
  </g-dialog>
</template>

<script>
  export default {
    name: 'dialogDeletePayment',
    props: {
      value: Boolean,
    },
		injectService: [
				'PosStore:selectedPayment',
				'PosStore:updatePayment'
		],
    computed: {
      dialog: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    },
    methods: {
    	async submit() {
    		await this.updatePayment(this.selectedPayment);
    		this.selectedPayment = null;
    		this.dialog = false;
			}
		}
  }
</script>

<style scoped lang="scss">
  .g-card {
    .g-card-title,
    .g-card-text {
      justify-content: center;
      text-align: center;
      color: #1d1d26;
    }

    .g-card-text {
      padding: 32px 64px;
    }

    .g-card-actions {
      justify-content: flex-end;

      .g-btn {
        min-width: 120px !important;
      }
    }
  }
</style>