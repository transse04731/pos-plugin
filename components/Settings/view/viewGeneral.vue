<template>
	<g-simple-table>
		<tr>
			<td>Barcode</td>
			<td><g-switch v-model="barcode" @change="changeSetting"/></td>
		</tr>
		<tr>
			<td>Favorite article</td>
			<td><g-switch v-model="favoriteArticle" @change="changeSetting"/></td>
		</tr>
		<tr>
			<td>Virtual keyboard</td>
			<td><g-switch v-model="virtualKeyboard" @change="changeSetting"/></td>
		</tr>
		<tr>
			<td>Cashdrawer opens automatically</td>
			<td><g-switch v-model="automaticCashdrawer" @change="changeSetting"/></td>
		</tr>
	</g-simple-table>
</template>

<script>
  export default {
    name: 'viewGeneral',
		injectService:[
				'PosStore:generalSetting',
				'PosStore:getGeneralSetting',
				'PosStore:updateSetting',
		],
		computed: {
			barcode: {
				get() {
					if(this.generalSetting)
						return this.generalSetting.barcode;
				},
				set(val) {
					this.generalSetting.barcode = val;
				}
			},
			favoriteArticle: {
				get() {
					if(this.generalSetting)
						return this.generalSetting.favoriteArticle;
				},
				set(val) {
					this.generalSetting.favoriteArticle = val;
				}
			},
			virtualKeyboard: {
				get() {
					if(this.generalSetting)
						return this.generalSetting.virtualKeyboard;
				},
				set(val) {
					this.generalSetting.virtualKeyboard = val;
				}
			},
			automaticCashdrawer: {
				get() {
					if(this.generalSetting)
						return this.generalSetting.automaticCashdrawer;
				},
				set(val) {
					this.generalSetting.automaticCashdrawer = val;
				}
			},
		},
		methods: {
    	async changeSetting() {
				await this.updateSetting()
			}
		},
		async created() {
    	await this.getGeneralSetting();
		}
	}
</script>

<style scoped lang="scss">
	.g-table {
		::v-deep tr td {
			padding: 0 32px;
		}

		::v-deep tr td:first-child {
			width: 200px;
		}

		::v-deep tr:not(:last-child) td {
			border-bottom: 1px solid #D8D8D8;
		}
	}
</style>