<template>
	<g-simple-table striped>
		<tr>
			<th>Name</th>
		</tr>
		<tr v-for="category in listCategories" :class="[(selectedCategory && selectedCategory._id === category._id) && 'bordered']" @click="select(category)">
			<td>{{category.name}}</td>
		</tr>
	</g-simple-table>
</template>

<script>
  export default {
    name: 'viewCategory',
    injectService: [
      'PosStore:listCategories',
      'PosStore:getAllCategories',
      'PosStore:selectedCategory',
    ],
    data() {
      return {

			}
		},
    async mounted() {
      this.listCategories = await this.getAllCategories();
    },
    methods: {
      select(category) {
        this.selectedCategory = category;
      }
    }
  }
</script>

<style scoped lang="scss">
	.g-table {
		tr th {
			color: #1d1d26;
			text-align: left;
			font-size: 14px;
			line-height: 18px;
		}

		th, td {
			padding-left: 32px;
		}

		td {
			height: 32px;
		}

		&.g-data-table__striped {
			tr:nth-child(even) {
				background-color: #f2f2f2
			}

			tr:nth-child(odd):not(:first-child) {
				background-color: white;
			}
		}

		.bordered > td {
			border: 2px solid #1271ff;
			box-shadow: 0 0 4px rgba(18, 113, 255, 0.563019);
			padding-left: 30px;
		}
	}
</style>