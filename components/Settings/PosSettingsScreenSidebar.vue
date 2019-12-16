<template>
  <div class="row-flex row-12">
    <g-sidebar medium>
      <template v-slot:header>
        <div class="row-flex align-items-center pa-3 bbw-thin b-grey-lighten-1">
          <g-avatar :size="40">
            <g-img :src="user.avatar"/>
          </g-avatar>
          <p class="pa-2 fs-small fw-600">{{userName}}</p>
        </div>
      </template>
      <g-side-bar-tree-view :data="sidebarData" :auto-collapse="false" v-model="internalValue"/>
    </g-sidebar>
    <router-view class="flex-grow-1"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'PosSettingsScreenSidebar',
		injectService: ['PosStore:(sidebarData,user)'],
		props: {
			value: null
		},
		computed: {
			internalValue: {
				get() {
					return this.value
				},
				set(value) {
					this.$emit('input', value)
				}
			},
      userName() {
			  return this.user ? this.user.name : ''
      }
		}
  }
</script>

<style scoped lang="scss">
  .g-sidebar-wrapper {
    width: 100% !important;
		max-width: none !important;

    ::v-deep .g-sidebar {
      width: 100% !important;
			max-width: none !important;

      .g-treeview-children i:not(.g-treeview-icon__small) {
        font-size: 16px !important;
      }

      &.g-sidebar__medium .g-treeview-title {
        font-size: 14px;
      }
    }
  }

  .g-treeview-wrapper ::v-deep .g-treeview__active {
    background: linear-gradient(9.78deg, #3949AB 0%, #4FC3F7 100%) !important;
    box-shadow: 0 1px 8px 1px rgba(28, 144, 196, 0.5);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-right: 8px;
  }
</style>