<template>
  <div class="row-flex row-12">
    <g-sidebar>
      <template v-slot:header>
        <div class="row-flex align-items-center pa-3 bbw-thin b-grey-lighten-1">
          <g-avatar :size="40">
            <g-img src="https://loremflickr.com/320/240"/>
          </g-avatar>
          <p class="pa-2 fs-small fw-600">Admin</p>
        </div>
      </template>
      <g-side-bar-tree-view :data="sidebarData" v-model="internalValue"/>
    </g-sidebar>
    <router-view class="flex-grow-1"></router-view>
  </div>
</template>

<script>
  import { GBtn, GImg, GAvatar, GSidebar, GSideBarTreeView } from 'pos-vue-framework/src/components';
  import _ from 'lodash'

  export default {
    name: 'PosSettingsScreenSidebar',
    components: { GBtn, GImg, GAvatar, GSidebar, GSideBarTreeView },
		injectService: ['PosStore:sidebarData'],
		props: {
			value: null
		},
		computed: {
			internalValue: {
				get() {
					return this.value
				},
				set(value) {
					// const activeItemPath = value.split('.').slice(1).join('.')
					// this.$emit('input', _.get(this.data, activeItemPath))
					this.$emit('input', value)
				}
			}
		},
		data() {
      return {
        data: [
          {
            title: 'Product', icon: 'icon-liefer_packet', svgIcon: true, badge: '3', badgeColor: '#FF9529',
            items: [
              { title: 'Articles', icon: 'radio_button_unchecked', iconType: 'small', isView: true },
              { title: 'Category', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/category' */},
              { title: 'Layout', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          },
          { title: 'Reporting', icon: 'icon-bar_chart', svgIcon: true },
          { title: 'User', icon: 'person', href: '/setting/user' },
          {
            title: 'Settings', icon: 'icon-cog', svgIcon: true, badge: '3', badgeColor: '#9C24AC',
            items: [
              { title: 'General', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/general'*/ },
              { title: 'Order Screen', icon: 'radio_button_unchecked', iconType: 'small' },
              { title: 'Print Template', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          },
          {
            title: 'Advanced settings', icon: 'icon-switch', svgIcon: true, badge: '3', badgeColor: '#FF4081',
            items: [
              { title: 'Company Info', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/company'*/ },
              { title: 'Payment', icon: 'radio_button_unchecked', iconType: 'small', isView: true /*href: '/settings/payment'*/ },
              { title: 'License', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          },
        ],
      }
    },
		onMounted() {
			console.log(this.sidebarData)
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