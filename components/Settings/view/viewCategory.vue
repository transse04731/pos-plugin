<template>
	<g-simple-table striped>
		<tr>
			<th>Name</th>
		</tr>
		<tr v-for="(category, i) in categories" :class="[i === 0 && 'bordered']">
			<td>{{category}}</td>
		</tr>
	</g-simple-table>
</template>

<script>
  import {GSpacer, GSimpleTable, GIcon, GBtn, GToolbar} from 'pos-vue-framework/src/components';
  import DialogDeletePayment from '../dialog/dialogDeletePayment';
  import DialogNewPayment from '../dialog/dialogNewPayment';
  import DialogNewCategory from '../dialog/dialogNewCategory';

  export default {
    name: 'viewCategory',
    components: { DialogNewCategory, DialogNewPayment, DialogDeletePayment, GSpacer, GSimpleTable, GIcon, GBtn, GToolbar },
		data() {
      return {
        categories: ['Sport', 'Computer', 'Food', 'Device'],
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
			tr:nth-child(even){
				background-color: white
			}

			tr:nth-child(odd):not(:first-child) {
				background-color: #f2f2f2;
			}
		}

		.bordered > td {
			border: 2px solid #1271ff;
			box-shadow: 0 0 4px rgba(18, 113, 255, 0.563019);
		}
	}
</style>