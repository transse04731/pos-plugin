<template>
	<fragment>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" :disabled="!selectedCategory || (selectedCategory.position && selectedCategory.position === listCategories.length)" class="mr-3" @click="moveCategory('down')">
			<g-icon class="mr-2" svg size="18">
				icon-move-down
			</g-icon>
			Move Down
		</g-btn>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" :disabled="!selectedCategory || (selectedCategory.position && selectedCategory.position === 1)" class="mr-3" @click="moveCategory('up')">
			<g-icon class="mr-2" svg size="18">
				icon-move-up
			</g-icon>
			Move up
		</g-btn>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" :disabled="!selectedCategory" class="mr-3" @click="openDialogEditCategory">
			<g-icon class="mr-2" color="red">
				edit
			</g-icon>
			Edit
		</g-btn>
		<g-btn :uppercase="false" background-color="white" text-color="#1d1d26" :disabled="!selectedCategory || (selectedCategory.name && selectedCategory.name === 'Favourite')" class="mr-3" @click="openDialogDelete">
			<g-icon class="mr-2" svg>
				icon-trash
			</g-icon>
			Delete
		</g-btn>
		<g-btn :uppercase="false" background-color="green" text-color="white" @click="openDialogNewCategory">
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
      'PosStore:swapCategoryPosition',
      'PosStore:listCategories',
    ],
		data() {
    	return {
    		dialogConfirmDelete: false
			}
		},
    methods: {
			async moveCategory(direction) {
				if(!this.selectedCategory) return
				await this.swapCategoryPosition(direction)
			},
      openDialogNewCategory() {
        this.$getService('dialogNewCategory:open')(false, this.listCategories.length)
      },
			openDialogDelete() {
      	this.dialogConfirmDelete = true;
			},
      async deleteCategory() {
        await this.updateCategory(this.selectedCategory._id);
        this.selectedCategory = null;
      },
      openDialogEditCategory() {
        this.$getService('dialogNewCategory:open')(true, this.listCategories.length)
      },
			back() {
				this.$router.push({ path: '/view/pos-dashboard' })
			}
    }
  }
</script>

<style scoped>

</style>
