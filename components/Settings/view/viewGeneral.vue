<template>
	<div class="row-flex pa-5" style="font-size: 13px; line-height: 16px">
		<div class="col-5 px-3">
			<div class="row-flex align-items-center justify-between">
				<span>Barcode</span>
				<g-switch v-model="barcode" @change="changeSetting"/>
			</div>
			<div class="row-flex align-items-center justify-between">
				<span>Favorite article</span>
				<g-switch v-model="favoriteArticle" @change="changeSetting"/>
			</div>
			<div class="row-flex align-items-center justify-between">
				<span>Virtual keyboard</span>
				<g-switch v-model="virtualKeyboard" @change="changeSetting"/>
			</div>
			<div class="row-flex align-items-center justify-between">
				<span>Cashdrawer opens automatically</span>
				<g-switch v-model="automaticCashdrawer" @change="changeSetting"/>
			</div>
		</div>
		<div class="col-5 offset-1">
			<div class="row-flex align-items-center mb-3">
				<span class="mr-4">Quick Function Rows</span>
				<div :class="['btn-fn-row', quickFnRows === (i-1) && 'selected']" v-for="i in 3" :key="i" @click="updateFnRows(i-1)">
					{{i-1}}
				</div>
			</div>
			<div class="row-flex align-items-center justify-center">
				<pos-time-picker label="New day starts at" v-model="beginHour" @change="changeSetting">
					<template v-slot:append>
						<g-icon>access_time</g-icon>
					</template>
				</pos-time-picker>
			</div>
		</div>
	</div>
</template>

<script>
  import PosTimePicker from '../../pos-shared-components/POSInput/PosTimePicker';
	export default {
    name: 'viewGeneral',
		components: { PosTimePicker },
		injectService: [
      'PosStore:generalSetting',
      'PosStore:getGeneralSetting',
      'PosStore:updateSetting',
      'PosStore:resetLayoutFnBtn',
    ],
    computed: {
      barcode: {
        get() {
          if (this.generalSetting) {
            return this.generalSetting.barcode;
          }
        },
        set(val) {
					this.$set(this.generalSetting, 'barcode', val)
        }
      },
      favoriteArticle: {
        get() {
          if (this.generalSetting) {
            return this.generalSetting.favoriteArticle;
          }
        },
        set(val) {
					this.$set(this.generalSetting, 'favoriteArticle', val)
        }
      },
      virtualKeyboard: {
        get() {
          if (this.generalSetting) {
            return this.generalSetting.virtualKeyboard;
          }
        },
        set(val) {
					this.$set(this.generalSetting, 'virtualKeyboard', val)
				}
      },
      automaticCashdrawer: {
        get() {
          if (this.generalSetting) {
            return this.generalSetting.automaticCashdrawer;
          }
        },
        set(val) {
					this.$set(this.generalSetting, 'automaticCashdrawer', val)
				}
      },
			quickFnRows: {
      	get() {
      		if (this.generalSetting) {
      			return this.generalSetting.quickFnRows;
					}
				},
				set(val) {
					this.$set(this.generalSetting, 'quickFnRows', val)
				}
			},
			beginHour: {
      	get() {
      		return (this.generalSetting && this.generalSetting.beginHour) || '00:00'
				},
				set(val) {
      		this.$set(this.generalSetting, 'beginHour', val)
				}
			}
    },
    methods: {
      async changeSetting() {
        await this.updateSetting()
      },
			async updateFnRows(number) {
				this.quickFnRows = number;
				await this.updateSetting();
				await this.resetLayoutFnBtn('leftFunctionButtons');
			}
    },
    created() {
      this.getGeneralSetting();
    }
  }
</script>

<style scoped lang="scss">
	.btn-fn-row {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: #F0F0F0;
		border: 1px solid #C9C9C9;
		border-radius: 2px;
		font-size: 13px;
		line-height: 16px;
		color: #1D1D26;
		margin-left: 8px;

		&.selected {
			border-color: #1271FF;
		}
	}

	.btn-fn-row:first-of-type {
		margin-left: 4px;
	}

	span {
		max-width: 150px;
	}
</style>
