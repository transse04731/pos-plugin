<template>
  <fragment>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-3" :disabled="!selectedTaxCategory" @click="openDialogEditTaxCategory">
      <g-icon class="mr-2" color="red">
        edit
      </g-icon>
      Edit
    </g-btn>
    <g-btn :uppercase="false" class="mr-3" background-color="white" :disabled="!selectedTaxCategory" text-color="#1d1d26" @click="openDialogDelete">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <g-btn :uppercase="false" background-color="#4CAF50" text-color="#FFFFFF" @click="openDialogNewTaxCategory">
      + Create new category
    </g-btn>
    <dialog-confirm-delete type="tax category" :label="selectedTaxCategory ? selectedTaxCategory.value + '%' : ''" v-model="dialogConfirmDelete" @submit="deleteTaxCategory"/>
  </fragment>
</template>

<script>
  export default {
    name: 'viewTaxToolbar',
    injectService: [
      'PosStore:selectedTaxCategory',
      'PosStore:updateTaxCategory',
    ],
    data() {
      return {
        dialogConfirmDelete: false
      }
    },
    methods: {
      openDialogNewTaxCategory() {
        this.$getService('dialogNewTaxCategory:open')(false);
      },
      openDialogEditTaxCategory() {
        this.$getService('dialogNewTaxCategory:open')(true);
      },
      openDialogDelete() {
        this.dialogConfirmDelete = true;
      },
      async deleteTaxCategory() {
        await this.updateTaxCategory(this.selectedTaxCategory);
        this.selectedTaxCategory = null
      }
    }
  }
</script>

<style scoped>

</style>
