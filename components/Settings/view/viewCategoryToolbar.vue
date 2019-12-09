<template>
	<fragment>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-2" @click="openDialogEditCategory">
			<g-icon class="mr-2" color="red">
				edit
			</g-icon>
			Edit
		</g-btn>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-2" @click="deleteCategory">
			<g-icon class="mr-2" svg>
				icon-trash
			</g-icon>
			Delete
		</g-btn>
		<g-btn :uppercase="false" flat background-color="green" text-color="white" @click="openDialogNewCategory">
			+ Create new category
		</g-btn>
	</fragment>
</template>

<script>
  export default {
    name: 'viewCategoryToolbar',
    injectService: [
      'PosStore:selectedCategory',
      'PosStore:updateCategory',
      'PosStore:isEditCategory',
    ],
    methods: {
      openDialogNewCategory() {
        this.isEditCategory = false;
        this.$getService('dialogNewCategory:setActive')(true)
      },
      async deleteCategory() {
        const name = this.selectedCategory._id;
        await this.updateCategory(name);
        this.selectedCategory = null;
      },
      openDialogEditCategory() {
        this.isEditCategory = true;
        this.$getService('dialogNewCategory:setActive')(true)
      },
			back() {
				this.$router.push({ path: '/view/test-pos-dashboard' })
			}
    }
  }
</script>

<style scoped>

</style>