<template>
  <fragment>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-3">
      <g-icon class="mr-2" svg>
        icon-menu
      </g-icon>
      More
    </g-btn>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-3">
      <g-icon class="mr-2" svg>
        icon-sort
      </g-icon>
      Sort
    </g-btn>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" @click="openDialogDelete" class="mr-3" :disabled="selectedProductIDs.length === 0">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-3" @click="openDialogEditProduct" :disabled="selectedProductIDs.length === 0">
      <g-icon class="mr-2" color="red">
        edit
      </g-icon>
      Edit
    </g-btn>
    <g-btn :uppercase="false" background-color="green" text-color="white" @click="openDialogNewProduct">
      + Create new product
    </g-btn>
    <dialog-confirm-delete :type="selectedProductIDs.length + ' selected product(s)'" v-model="dialogConfirmDelete" @submit="deleteProducts"/>
  </fragment>
</template>

<script>
  export default {
    name: 'viewArticleToolbar',
    injectService: [
        'PosStore:selectedProductIDs',
        'PosStore:deleteSelectedProducts',
    ],
    data() {
      return {
        dialogConfirmDelete: false
      }
    },
    methods: {
      openDialogEditProduct() {
        this.$getService('dialogNewProduct:open')(true);
      },
      openDialogNewProduct() {
        this.$getService('dialogNewProduct:open')(false);
      },
      openDialogDelete() {
        this.dialogConfirmDelete = true;
      },
      async deleteProducts() {
        await this.deleteSelectedProducts();
      },
      back() {
        this.$router.push({ path: '/view/pos-dashboard' });
      }
    }
  }
</script>

<style scoped>

</style>