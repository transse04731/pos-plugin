<template>
  <g-toolbar absolute bottom color="grey lighten 3" filled>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-3" @click="back">
      <g-icon class="mr-2" svg>
        icon-back
      </g-icon>
      Back
    </g-btn>
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
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" @click="deleteProducts">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <g-spacer/>
    <g-btn :uppercase="false" background-color="green" text-color="white" flat @click="openDialogNewProduct">
      + Create new product
    </g-btn>
  </g-toolbar>
</template>

<script>
  export default {
    name: 'viewArticleToolbar',
    methods: {
      openDialogNewProduct() {
        this.$getService('dialogNewProduct:setActive')(true)
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