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
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" @click="openDialogDelete" class="mr-3">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <g-btn :uppercase="false" background-color="green" text-color="white" @click="openDialogNewProduct">
      + Create new product
    </g-btn>
    <dialog-confirm-delete :type="selectedProduct.length + ' selected product(s)'" v-model="dialogConfirmDelete" @submit="deleteProducts"/>
  </fragment>
</template>

<script>
  // import DialogConfirmDelete from '../dialog/dialogConfirmDelete';
  export default {
    name: 'viewArticleToolbar',
    // components: { DialogConfirmDelete },
    injectService: [
        'PosStore:selectedProduct'
    ],
    data() {
      return {
        dialogConfirmDelete: false
      }
    },
    methods: {
      openDialogNewProduct() {
        this.$getService('dialogNewProduct:setActive')(true)
      },
      openDialogDelete() {
        this.dialogConfirmDelete = true;
      },
      async deleteProducts() {
        await this.$getService('PosStore:deleteSelectedProducts')()
      },
      back() {
        this.$router.push({ path: '/view/test-pos-dashboard' })
      }
    }
  }
</script>

<style scoped>

</style>