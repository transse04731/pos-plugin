<template>
	<g-sidebar>
		<template v-slot:header>
			<div class="sidebar-header">
				<g-avatar size="40">
					<g-img :src="srcImg"/>
				</g-avatar>
				<span class="ml-2">{{title}}</span>
			</div>
		</template>
		<g-side-bar-tree-view :data="data" v-model="sidebar"/>
		<g-spacer/>
		<g-btn large text background-color="white" text-color="#424242" width="100%">
			<g-icon svg>icon-logout</g-icon>
			<span class="ml-2">Log Out</span>
		</g-btn>
	</g-sidebar>
</template>

<script>
  import GSidebar from 'pos-vue-framework/src/components/GSidebar/GSidebar';
  import GAvatar from 'pos-vue-framework/src/components/GAvatar/GAvatar';
  import GImg from 'pos-vue-framework/src/components/GImg/GImg';
  import GSideBarTreeView from 'pos-vue-framework/src/components/GSidebar/GSideBarTreeView';
  import GSpacer from 'pos-vue-framework/src/components/GLayout/GSpacer';
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';

  export default {
    name: 'PosDashboardSidebar',
    components: { GIcon, GBtn, GSpacer, GSideBarTreeView, GImg, GAvatar, GSidebar },
    props: {
      title: {
        type: String,
        default: 'Admin'
      },
      srcImg: {
        type: String,
        default: 'https://carlisletheacarlisletheatre.org/images/person-icon-flat-7.png'
      },
    },
    data() {
      return {
        data: [
          {
            title: 'Dashboard', icon: 'mdi-cart-outline',
            items: [
              { title: 'Retail', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          }
        ],
				sidebar: null
      }
    }
  }
</script>

<style scoped lang="scss">
	.g-sidebar {
		.sidebar-header {
			padding: 16px;
			display: flex;
			align-items: center;
			font-size: 14px;
			line-height: 18px;
			font-weight: 600;
			color: #1d1d26;
		}
	}

	.g-treeview-wrapper ::v-deep .g-treeview__active {
		background: linear-gradient(9.78deg, #3949AB 0%, #4FC3F7 100%) !important;
		box-shadow: 0 1px 8px 1px rgba(28, 144, 196, 0.5);
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		margin-right: 8px;
	}

	.g-btn ::v-deep .g-btn__content {
		justify-content: flex-start;
		color: #424242;
		font-size: 14px;
	}
</style>