<template>
  <div class="pos-management">
    <pos-dashboard-sidebar default-path="item.0" :items="sidebarItems" @node-selected="onNodeSelected"/>
    <div class="pos-management__main">
      <template v-if="view === 'list'">
        <div class="pos-management__title">POS Management</div>
        <div class="pos-management__actions-bar">
          <g-text-field-bs prepend-inner-icon="search" placeholder="Search name or branch" v-model="searchText"/>
          <g-menu v-model="showFilterMenu" :close-on-content-click="true" content-class="filter-menu">
            <template v-slot:activator="{on}">
              <g-btn-bs :class="[showFilterMenu && 'btn-sort']" border-color="#e3e5f0" text-color="#757575" icon="sort"
                        @click="on.click">Sort
              </g-btn-bs>
            </template>
            <div class="filter-options">
              <div :class="['option', { 'option--selected':  orderBy === 'lastUpdated' }]" @click="orderBy = 'lastUpdated'">Last Updated</div>
              <div :class="['option', { 'option--selected':  orderBy === 'firstUpdated' }]" @click="orderBy = 'firstUpdated'">First Updated</div>
              <div :class="['option', { 'option--selected':  orderBy === 'az' }]" @click="orderBy = 'az'">A to Z</div>
              <div :class="['option', { 'option--selected':  orderBy === 'za' }]" @click="orderBy = 'za'">Z to A</div>
            </div>
          </g-menu>
          <g-spacer/>
          <g-btn-bs border-color="#536DFE" icon="add@16" :disabled="groups.length === 0"
                    @click="dialog.newStore = true">Add New Store
          </g-btn-bs>
          <g-btn-bs background-color="#536DFE" text-color="white" icon="add@16" @click="dialog.newGroup = true">Add New
            Group
          </g-btn-bs>
        </div>
        <div class="pos-management__table">
          <div class="pos-management__table-header">
            <div class="col-3"></div>
            <div class="row-flex col-9">
              <div class="col-2">Name</div>
              <div class="col-2">Device</div>
              <div class="col-3">Current Version</div>
              <div class="col-4">Update</div>
              <div class="col-1">Action</div>
            </div>
          </div>
          <div class="pos-management__table-content">
            <template v-if="groups.length === 0">
              <div class="pos-management__table-content--empty">
                <img alt src="/plugins/pos-plugin/assets/empty_group.svg"/>
                <p class="text-grey-darken-1 mb-2 mt-2">Store is currently empty.</p>
                <div class="text-indigo-accent-2" style="cursor: pointer" @click="dialog.newGroup = true">
                  <g-icon style="margin-bottom: 4px; margin-right: -4px" size="18" color="indigo-accent-2">add</g-icon>
                  Add New Group
                </div>
              </div>
            </template>
            <template v-if="groups.length !== 0 && searchResult.length === 0">
              <div class="pos-management__table-content--empty">
                <p class="text-grey-darken-1">No Store match your search</p>
                <p class="text-grey-darken-1"><span class="fw-700">"{{searchText}}"</span></p>
                <div class="text-indigo-accent-2">Reset Search</div>
              </div>
            </template>
            <template v-else>
              <pos-management-group
                  v-for="(group, i) in searchResult"
                  v-bind="group"
                  :key="`group_${i}`"
                  :app-items="appItems"
                  @delete="removeStore(group._id, $event)"
                  @updateStores="loadStores()"
                  @view:settings="viewStoreSetting($event)"/>
            </template>
          </div>
        </div>
      </template>
      <template v-else-if="view === 'settings'">
        <div class="pos-management__breadcrumbs">
          <span @click="view = 'list'">POS Management</span>
          <g-icon class="mx-2" size="12">fas fa-angle-double-right</g-icon>
          <span>Settings</span>
        </div>
        <pos-management-setting
            :_id="selectedStore._id"
            :name="selectedStore.name"
            :alias="selectedStore.alias"
            :client-domain="selectedStore.clientDomain"
            :group="selectedStore.groups"
            :online-ordering="selectedStore.onlineOrdering"
            :address="selectedStore.address"
            :devices="selectedStore.devices"
            :groups="groups"
            @update="updateStore(selectedStore._id, $event)"
            @open:dialogDevice="dialog.newDevice = $event"
            @open:dialogDelete="dialog.deleteDevice = $event"/>
      </template>
      <template v-else-if="view === 'version'">
        <version-control />
      </template>
      <template v-else-if="view === 'account'">
        <account/>
      </template>
    </div>
    <dialog-new-group v-model="dialog.newGroup" @submit="addGroup($event)" :groups="groups"/>
    <dialog-new-store v-model="dialog.newStore" @submit="addStore($event)" :groups="groups"/>
    <dialog-new-device v-model="dialog.newDevice"/>
    <dialog-delete-item v-model="dialog.deleteDevice" type="device"/>
  </div>
</template>
<script>
  import _ from 'lodash'
  import VersionControl from "./VersionControl";
  import Account from "./Account";

  export default {
    name: 'ManagementView',
    components: {Account, VersionControl},
    props: {},
    data: function () {
      const sidebarItems = [ { title: 'Store Management', icon: 'icon-management_white', onClick: () => this.changeView('list', 'Store Management') }]
      if (cms.loginUser.user.role.name === 'admin')
        sidebarItems.push({ title: 'Version Control', icon: 'icon-version_control', onClick: () => this.changeView('version', 'Version Control') })
      sidebarItems.push({ title: 'Account Management', icon: 'icon-account-management', onClick: () => this.changeView('account', 'Account Management') })
      return {
        storePlaceHolder: $t('posManagement.searchPlaceholder'),
        username: cms.loginUser.user.username,
        view: 'list',
        dialog: {
          newGroup: false,
          newStore: false,
          newDevice: false,
          deleteDevice: false,
        },
        showFilterMenu: false,
        selectedStoreId: null,
        sidebarItems,

        deviceIdList: [],
      }
    },
    injectService: [
        // view model
        'PosOnlineOrderManagementStore:(storeManagementViewModel,searchText,orderBy)',
        // store groups
        'PosOnlineOrderManagementStore:(storeGroups,loadStoreGroups,addGroup)',
        // stores
        'PosOnlineOrderManagementStore:(stores,loadStores,addStore,removeStore,updateStore)',
        // devices
        'PosOnlineOrderManagementStore:(addDevice,removeDevice,updateDevice)',
        // app
        'PosOnlineOrderManagementStore:(apps,appItems)',
    ],
    computed: {
      searchResult() {
        return this.storeManagementViewModel
      },
      groups() {
        return this.storeGroups
      },
      selectedStore() {
        if (this.selectedStoreId)
          return _.find(this.stores, store => store._id === this.selectedStoreId)
      },
    },
    mounted() {
      window.cms.socket.on('updateDeviceStatus', storeId => {
        if (storeId) {
          const storeIdList = _.flatten(this.storeManagementViewModel.map(e => e.stores)).map(e => e._id)

          if (storeIdList.includes(storeId)) this.loadStores()
        } else {
          this.loadStores()
        }
      })

      this.$watch('storeManagementViewModel', val => {
        const stores = _.flatten(val.map(e => e.stores))
        const devices = _.flatten(stores.map(store => store.devices))
        const deviceIds = devices.map(device => device._id)
        this.deviceIdList = _.uniq(this.deviceIdList.concat(deviceIds))

        // Duplicated IDs will be filtered on backend so it's OK to send the same IDs again
        window.cms.socket.emit('watchDeviceStatus', this.deviceIdList)
      })
    },
    beforeDestroy() {
      window.cms.socket.off('updateDeviceStatus')
      window.cms.socket.emit('unwatchDeviceStatus', this.deviceIdList)
    },
    methods: {
      viewStoreSetting(store) {
        this.selectedStoreId = store._id
        this.view = 'settings'
      },
      onNodeSelected(node) {
        node.onClick && node.onClick.bind(this)();
      },
      changeView(view, title) {
        if(view) {
          this.view = view
          //reset icon
          for(const item of this.sidebarItems) {
            if(item.icon.startsWith('icon-') && item.icon.endsWith('_white')) {
              this.$set(item, 'icon', item.icon.slice(0, item.icon.length - 6))
            }
          }
        }
        if(title) {
          const item = this.sidebarItems.find(i => i.title === title)
          this.$set(item, 'icon', item.icon+'_white')
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

    &__title {
      font-size: 20px;
      line-height: 25px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 24px;
    }

    &__breadcrumbs {
      font-size: 20px;
      line-height: 25px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 24px;

      span:first-child {
        color: #9e9e9e;
        cursor: pointer;
      }
    }

    &__actions-bar {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .bs-tf-wrapper {
        width: auto;

        ::v-deep .bs-tf-input-group {
          background: white;
        }
      }
    }

    &__table {
      height: calc(100% - 120px);
      overflow: hidden;
      background: #FFFFFF;
      box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1398);
      border-radius: 2px;

      &-header {
        background: #EFEFEF;
        height: 38px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #757575;
      }

      &-content {
        height: calc(100% - 38px);
        overflow: hidden scroll;

        &--empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-items: center;
          margin-top: 64px;
        }
      }
    }

    .btn-sort {
      background: #FFFFFF;
      border: 1px solid #536DFE !important;
      border-radius: 2px;
      color: #536DFE !important;
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
