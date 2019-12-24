<template>
  <g-sidebar medium>
    <template v-slot:header>
      <div class="sidebar-header">
        <g-avatar size="40">
          <g-img :src="srcImg"></g-img>
        </g-avatar>
        <span class="ml-2">{{userName}}</span>
      </div>
    </template>
    <g-side-bar-tree-view :data="sideBardata" v-model="sidebar"></g-side-bar-tree-view>
    <g-spacer></g-spacer>
    <g-btn :uppercase="false" large text background-color="white" text-color="#424242" width="100%"
           @click.stop="logout"
    >
      <g-icon svg>icon-logout</g-icon>
      <span class="ml-2">Log Out</span>
    </g-btn>
  </g-sidebar>
</template>

<script>
  export default {
    name: 'PosDashboardSidebar',
    injectService: ['PosStore:user'],
    props: {
      title: {
        type: String,
        default: 'Admin'
      },
    },
    data() {
      return {
        sideBardata: [
          {
            title: 'Dashboard', icon: 'mdi-cart-outline',
            items: [
              { title: 'Retail', icon: 'radio_button_unchecked', iconType: 'small' },
            ]
          }
        ],
        sidebar: ''
      }
    },
    computed: {
      userName() {
        return this.user ? this.user.name : ''
      },
      srcImg() {
        return this.user ? this.user.avatar : ''
      }
    },
    methods: {
      logout() {
        this.$router.push('/view/pos-login')
        this.user = null
      }
    },
    mounted() {
      this.sidebar = "items.0.items.0";
    }
  }
</script>

<style scoped lang="scss">
  .g-sidebar {
    .sidebar-header {
      padding: 12px;
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 18px;
      font-weight: 600;
      color: #1d1d26;
    }
  }

  .g-treeview-wrapper ::v-deep .g-treeview-item.g-treeview__active {
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