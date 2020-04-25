<template>
  <div class="account">
    <div class="account__title">Account Management</div>
    <div class="account__action-bar">
      <g-text-field-bs prepend-inner-icon="search" placeholder="Search..." v-model="searchText"/>
      <g-menu v-model="showFilterMenu" content-class="filter-menu" nudge-left="200" nudge-bottom="5">
        <template v-slot:activator="{on}">
          <g-btn-bs :class="[showFilterMenu && 'btn-filter']" border-color="#e3e5f0" text-color="#757575"
                    icon="filter_list"
                    @click="on.click">Filter
          </g-btn-bs>
        </template>
        <div class="filter">
          <div class="filter-input">
            <div>Create by</div>
            <g-combobox text-field-component="GTextFieldBs" v-model="filter.create"/>
            <div>Group</div>
            <g-combobox class="combobox--large" multiple deletable-chips text-field-component="GTextFieldBs" v-model="filter.group"/>
          </div>
          <div class="filter-permission">
            <div class="filter-permission__title">Permission</div>
            <g-checkbox color="#536DFE" label="Add new group" value="Add new group" v-model="filter.permission"/>
            <g-checkbox color="#536DFE" label="Settings" value="Settings" v-model="filter.permission"/>
            <g-checkbox color="#536DFE" label="Add new store" value="Add new store" v-model="filter.permission"/>
            <g-checkbox color="#536DFE" label="Update" value="Update" v-model="filter.permission"/>
            <g-checkbox color="#536DFE" label="Remote control" value="Remote control" v-model="filter.permission"/>
            <g-checkbox color="#536DFE" label="Account management" value="Account management" v-model="filter.permission"/>
            <g-checkbox color="#536DFE" label="Config online ordering" value="Config online ordering" v-model="filter.permission"/>
          </div>
          <div class="filter-action">
            <g-btn-bs @click="clearFilter(false)">Clear filter</g-btn-bs>
            <g-btn-bs width="120" large background-color="indigo accent-2" text-color="white" @click="applyFilter">Apply</g-btn-bs>
          </div>
        </div>
      </g-menu>
      <g-spacer/>
      <g-btn-bs style="margin-right: 0" background-color="#536DFE" text-color="white" icon="add@16" @click="openDialogAccount()">
        Create New Account
      </g-btn-bs>
    </div>
    <div v-if="filters && filters.length > 0" class="account__filter">
      <g-chip label v-for="(filter, i) in filters" :key="`filter_${i}`" close @close="removeFilter(filter)">{{filter.value}}</g-chip>
      <g-btn-bs @click="clearFilter(true)" style="white-space: nowrap; min-width: 80px">Clear all</g-btn-bs>
    </div>
    <div class="account__table">
      <div class="account__table-header">
        <div class="flex-equal pl-3">Name</div>
        <div class="flex-equal pl-1">Email</div>
        <div class="flex-equal pl-1">Group</div>
        <div class="col-1 ta-center">Store</div>
        <div class="col-1 ta-center">Permission</div>
        <div class="flex-equal pl-1">Created By</div>
        <div style="flex: 0 0 75px; text-align: center">Status</div>
        <div style="flex: 0 0 50px"></div>
      </div>
      <div class="account__table-content">
        <template v-if="!accountViewModel || accountViewModel.length === 0">
          <div class="version-control__table-content--empty">
            <img alt src="/plugins/pos-plugin/assets/empty_group.svg"/>
            <p class="text-grey-darken-1 mt-2">Account is currently empty</p>
            <g-btn-bs text-color="indigo accent-2" icon="add@16" class="fw-700" @click="openDialogAccount()">
              Create New Account
            </g-btn-bs>
          </div>
        </template>
        <template v-else>
          <div v-for="(account, i) in accountViewModel" :key="i"
               :class="['account__table-row', i % 2 === 0 ? 'account__table-row--even' : 'account__table-row--odd']">
            <div class="flex-equal pl-3">{{account.name}}</div>
            <div class="flex-equal pl-1">{{account.username}}</div>
            <div class="flex-equal pl-1" style="word-break: break-word">{{account.storeGroupsStr}}</div>
            <div class="col-1 ta-center">{{account.totalStore}}</div>
            <div class="col-1 ta-center">{{account.totalPermissions}}</div>
            <div class="flex-equal pl-1">{{account.createdBy}}</div>
            <div style="flex: 0 0 75px; text-align: center"><span :class="getStatusClass(account.status)">{{account.status}}</span></div>
            <div style="flex: 0 0 50px; text-align: center">
              <g-menu v-model="account.menu" :close-on-content-click="true" nudge-left="40" nudge-bottom="10">
                <template v-slot:activator="{on}">
                  <g-icon :class="[account.menu && 'menu--active']" @click="on.click">more_horiz</g-icon>
                </template>
                <div class="menu-action">
                  <div class="menu-action__option" @click="openDialogAccount(true, account)">Edit</div>
                  <div class="menu-action__option" @click="resetPassword(account)">Reset Password</div>
                  <div class="menu-action__option" @click="changeStatus(account)">{{account.status === 'active' ? 'Disable' : 'Enable'}} Account</div>
                  <div class="menu-action__option" @click="openDialogDelete(account)">Delete</div>
                </div>
              </g-menu>
            </div>
          </div>
        </template>
      </div>
    </div>
    <dialog-account
        v-if="dialog.account"
        v-model="dialog.account"
        :edit="dialog.edit"
        v-bind="selectedAccount"
        @cancel="dialog.account = false"
        @edit="editAccount(selectedAccount._id, $event)"
        @add="createAccount"
    />
    <dialog-delete-item v-model="dialog.delete" type="user" @confirm="deleteUser"/>
  </div>
</template>

<script>
  export default {
    name: "Account",
    data() {
      return {
        searchText: '',
        showFilterMenu: false,
        filter: {
          create: null,
          group: [],
          permission: []
        },
        filters: [],
        dialog: {
          account: false,
          edit: false,
          delete: false,
        },
        selectedAccount: null,
      }
    },
    injectService: [
      'PosOnlineOrderManagementStore:(accountViewModel,createAccount,editAccount,deleteAccount)',
    ],
    methods: {
      // style
      getStatusClass(status) {
        const statusDefault = 'account__status '
        if (status === 'active') {
          return statusDefault + 'account__status--active'
        }
        if (status === 'disabled') {
          return statusDefault + 'account__status--disabled'
        }
      },
      
      //
      openDialogAccount(edit = false, account = null) {
        this.dialog.edit = edit
        this.selectedAccount = account
        this.dialog.account = true
      },
      openDialogDelete(account) {
        this.selectedAccount = account
        this.dialog.delete = true
      },
      resetPassword(account) {

      },
      changeStatus(account) {
        this.editAccount(account._id, { active: !account.active })
      },
      async deleteUser() {
        await this.deleteAccount(this.selectedAccount._id)
        this.selectedAccount = null
      },
      
      // filters
      clearFilter(all) {
        this.filter = {
          create: null,
          group: [],
          permission: []
        }
        if(all) {
          this.filters = []
        }
      },
      applyFilter() {
        this.filters = []
        if(this.filter.create && this.filter.create.trim()) {
          this.filters.push({type: 'create', value: this.filter.create})
        }
        if(this.filter.group.length > 0) {
          this.filters.push(...this.filter.group.map(g => ({type: 'group', value: g})))
        }
        if(this.filter.permission.length > 0) {
          this.filters.push(...this.filter.permission.map(p => ({type: 'permission', value: p})))
        }
        this.showFilterMenu = false
      },
      removeFilter(filter) {
        const index = this.filters.findIndex(f => f === filter)
        this.filters.splice(index, 1)
        if(filter.type === 'create') {
          this.filter.create = null
        } else {
          const i = this.filter[filter.type].findIndex(item => item === filter.value)
          this.filter[filter.type].splice(i, 1)
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .account {
    height: 100%;
    width: 100%;
    overflow: hidden;

    &__title {
      font-size: 20px;
      line-height: 25px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 16px;
      margin-left: 5px;
    }

    &__action-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 16px;

      .bs-tf-wrapper {
        width: auto;

        ::v-deep .bs-tf-input-group {
          background: white;
        }
      }
    }

    &__filter {
      min-width: 0;
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      margin-top: -12px;
      margin-bottom: 16px;
      scrollbar-width: none; // firefox

      &::-webkit-scrollbar {
        display: none;
      }

      & ~ .account__table {
        height: calc(100% - 160px)
      }
    }

    &__table {
      background: #FFFFFF;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1398);
      border-radius: 2px;
      overflow: hidden;
      height: calc(100% - 120px);

      &-header {
        background: #EFEFEF;
        height: 38px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #757575;

        & > div {
          cursor: pointer;
        }
      }

      &-content {
        height: calc(100% - 38px);
        overflow: hidden auto;
        scrollbar-width: none; // firefox

        &::-webkit-scrollbar {
          display: none;
        }

        &--empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-items: center;
          margin-top: 64px;

          .g-btn-bs ::v-deep > * {
            font-weight: 700;
          }
        }
      }

      &-row {
        display: flex;
        align-items: center;
        height: 55px;
        font-size: 14px;
        color: #424242;

        &--odd {
          background: #FAFAFC;
        }

        &--even {
          background: #FFFFFF;
        }

        .account__status {
          border-radius: 16px;
          line-height: 2;
          text-transform: capitalize;

          &--disabled {
            background: #FFF3E0;
            color: #FF9800;
            padding: 6px 8px;
          }

          &--active {
            background: #DFF2DF;
            color: #4CAF50;
            padding: 6px 16px;
          }
        }
      }
    }
  }

  .btn-filter {
    background:#FFFFFF;
    border: 1px solid #536DFE !important;
    border-radius: 2px;
    color: #536DFE !important;
  }

  .filter {
    background: white;
    border-radius: 2px;
    padding: 16px;
    display: flex;
    font-size: 14px;
    font-weight: 600;

    &-input {
      flex: 1 1 auto;
      display: grid;
      grid-template-columns: 70px 250px;
      grid-auto-rows: 45px 80px;
      align-items: center;

      .combobox--large ::v-deep {
        .input {
          height: 70px;
          overflow: auto;
          width: 100%;

          .g-chip {
            border-radius: 2px;
            color: #000000;
          }
        }

        .bs-tf-append-inner {
          display: none;
        }
      }

      .g-combobox ::v-deep {
        .input {
          display: flex;
          flex-wrap: wrap;
          flex: 1 1 0;
          min-width: 0;
        }

        .bs-tf-input {
          height: 32px;
          min-width: 0;
          flex: 1;
        }
      }
    }

    &-permission {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: auto;
      margin-left: 16px;
      flex: 1 1 auto;

      &__title {
        grid-column: span 2;
        margin-left: 6px;
      }

      .g-checkbox-wrapper {
        margin: 4px;
      }
    }

    &-action {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      margin-left: 30px;
    }
  }

  .menu {
    &--active {
      border-radius: 50%;
      background: #F4F5FA;
      color: #536DFE !important;
    }

    &-action {
      background: white;
      border-radius: 2px;

      &__option {
        color: #201F2B;
        padding: 8px 36px 8px 12px;
        white-space: nowrap;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
</style>
