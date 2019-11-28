<template>
  <g-toolbar absolute bottom color="grey lighten 3">
    <g-btn background-color="white" text-color="#1d1d26" class="mr-2">
      <g-icon class="mr-2" svg>
        icon-back
      </g-icon>
      Back
    </g-btn>
    <g-spacer/>
    <g-btn background-color="white" text-color="#1d1d26" class="mr-2">
      <g-icon class="mr-2" color="red">
        edit
      </g-icon>
      Edit
    </g-btn>
    <g-btn background-color="white" text-color="#1d1d26" class="mr-2">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <g-btn flat background-color="green" text-color="white" @click="openDialogNewCategory">
      + Create new category
    </g-btn>
  </g-toolbar>
</template>

<script>
  export default {
    name: 'viewCategoryToolbar',
    methods: {
      openDialogNewCategory() {
        this.$getService('dialogNewCategory:setActive')(true)
      }
    }
  }
</script>

<style scoped>

</style>