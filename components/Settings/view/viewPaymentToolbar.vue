<template>
  <fragment>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-3" :disabled="!selectedPayment || !selectedPayment.editable" @click="openDialogEditPayment">
      <g-icon class="mr-2" color="red">
        edit
      </g-icon>
      Edit
    </g-btn>
    <g-btn :uppercase="false" background-color="white" class="mr-3" :disabled="!selectedPayment" text-color="#1d1d26" @click="openDialogDelete">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <g-btn :uppercase="false" background-color="#4CAF50" text-color="#FFFFFF" @click="openDialogNewPayment">
      + Create new payment
    </g-btn>
    <dialog-confirm-delete type="payment" :label="selectedPayment ? selectedPayment.name : ''" v-model="dialogConfirmDelete" @submit="deletePayment"/>
  </fragment>
</template>

<script>
  export default {
    name: 'viewPaymentToolbar',
    injectService:[
      'PosStore:selectedPayment',
      'PosStore:updatePayment'
    ],
    data() {
      return {
        dialogConfirmDelete: false
      }
    },
    methods: {
      openDialogNewPayment() {
        this.$getService('dialogNewPayment:open')(false)
      },
      openDialogEditPayment() {
        this.$getService('dialogNewPayment:open')(true)
      },
      openDialogDelete() {
        this.dialogConfirmDelete = true;
      },
      async deletePayment() {
        await this.updatePayment(this.selectedPayment);
        this.selectedPayment = null;
      }
    }
  }
</script>

<style scoped>

</style>
