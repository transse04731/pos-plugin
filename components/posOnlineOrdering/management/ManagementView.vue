<template>
  <div class="pos-management">
    <pos-dashboard-sidebar default-path="item.0" :items="sidebarItems" @node-selected="onNodeSelected"/>
    <div class="pos-management__main">
      <store-management v-if="view === 'store-management'"/>
      <version-control v-else-if="view === 'version' && versionControlPerm"/>
      <account v-else-if="view === 'account' && manageAccountPerm"/>
    </div>
  </div>
</template>
<script>
  import Account from "./AccountManagement/Account";
  import StoreManagement from './StoreManagement/StoreManagement';
  import VersionControl from "./VersionControl/VersionControl";

  export default {
    name: 'ManagementView',
    components: { StoreManagement, Account, VersionControl},
    props: {},
    injectService: [
      'PermissionStore:(versionControlPerm,manageAccountPerm)'
    ],
    data: function () {
      return {
        username: cms.loginUser.user.username,
        view: 'list'
      }
    },
    computed: {
      sidebarItems() {
        const items = []
        if(this.view === 'list') {
          items.push({ title: 'Store Management', icon: 'icon-management_white', onClick: () => this.changeView('list') })
        } else {
          items.push({ title: 'Store Management', icon: 'icon-management', onClick: () => this.changeView('list') })
        }

        if(this.versionControlPerm) {
          if(this.view === 'version') {
            items.push({ title: 'Version Control', icon: 'icon-version_control_white', onClick: () => this.changeView('version', 'Version Control') })
          } else  {
            items.push({ title: 'Version Control', icon: 'icon-version_control', onClick: () => this.changeView('version', 'Version Control') })
          }
        }

        if(this.manageAccountPerm) {
          if(this.view === 'account') {
            items.push({ title: 'Account Management', icon: 'icon-account-management_white', onClick: () => this.changeView('account', 'Account Management') })
          } else {
            items.push({ title: 'Account Management', icon: 'icon-account-management', onClick: () => this.changeView('account', 'Account Management') })
          }
        }
        return items
      },
    },
    methods: {
      onNodeSelected(node) {
        node.onClick && node.onClick.bind(this)();
      },
      changeView(view) {
        if(view) {
          this.view = view
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .pos-management {
    display: flex;
    width: 100vw;
    height: 100vh;
    font-size: 15px;

    &__main {
      flex: 1;
      background-color: #F4F7FB;
      padding: 50px 50px 20px 80px;
      overflow: hidden;
    }
  }

  .filter-options {
    background: #FFFFFF;
    border: 1px solid #D3D3D3;
    border-radius: 2px;

    .option {
      background-color: #FFF;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      text-align: left;
      user-select: none;
      cursor: pointer;
      color: #201F2B;

      &--selected {
        background-color: #EFEFEF;
      }

      &:hover {
        background-color: #EFEFEF;
      }
    }
  }
</style>

<style lang="scss">
  .bs-tf-wrapper.bs-tf__large {
    margin-left: 0;
    margin-bottom: 16px;

    .bs-tf-label {
      font-size: 15px;
      margin-bottom: 12px;
    }

    .bs-tf-input {
      line-height: 28px;
      font-size: 15px;
    }
  }

  .g-select {
    .bs-tf-wrapper {
      margin-left: 0;
      margin-bottom: 16px;
    }

    .bs-tf-inner-input-group {
      height: 46px;
    }

    .g-chip {
      border-radius: 2px;
    }
  }
</style>
