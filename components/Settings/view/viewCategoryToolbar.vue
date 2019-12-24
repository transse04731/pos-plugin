<template>
	<fragment>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-2" @click="openDialogEditCategory">
			<g-icon class="mr-2" color="red">
				edit
			</g-icon>
			Edit
		</g-btn>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" :disabled="!selectedCategory" class="mr-2" @click="openDialogDelete">
			<g-icon class="mr-2" svg>
				icon-trash
			</g-icon>
			Delete
		</g-btn>
		<g-btn :uppercase="false" flat background-color="green" text-color="white" @click="openDialogNewCategory">
			+ Create new category
		</g-btn>
		<dialog-confirm-delete type="Category" :label="selectedCategory ? selectedCategory.name : ''" v-model="dialogConfirmDelete" @submit="deleteCategory"/>
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
		data() {
    	return {
    		dialogConfirmDelete: false
			}
		},
    methods: {
      openDialogNewCategory() {
        this.isEditCategory = false;
        this.$getService('dialogNewCategory:setActive')(true)
      },
			openDialogDelete() {
      	this.dialogConfirmDelete = true;
			},
      async deleteCategory() {
        await this.updateCategory(this.selectedCategory._id);
        this.selectedCategory = null;
      },
      openDialogEditCategory() {
        this.isEditCategory = true;
        this.$getService('dialogNewCategory:setActive')(true)
      },
			back() {
				this.$router.push({ path: '/view/pos-dashboard' })
			}
    }
  }
</script>

<style scoped>

</style>