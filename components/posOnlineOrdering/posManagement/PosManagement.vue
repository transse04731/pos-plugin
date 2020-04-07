<template>
  <div class="pos-management">
    <div class="pos-management__sidebar">
      <g-sidebar>
        <template v-slot:header>
          <div class="sidebar-header">
            <g-avatar size="40">
              <g-img :src="srcImg"/>
            </g-avatar>
            <span class="username">{{username}}</span>
          </div>
        </template>
      </g-sidebar>
    </div>
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
              <div class="option">Last Updated</div>
              <div class="option">First Updated</div>
              <div class="option">A to Z</div>
              <div class="option">Z to A</div>
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
            <div style="flex: 0 0 4.1667%"></div>
            <div style="flex: 0 0 4.1667%">ID</div>
            <div class="col-3">Name</div>
            <div class="col-4">Address</div>
            <div class="col-2 ta-center">POS Status</div>
            <div class="col-1 ta-center">Webshop</div>
            <div class="col-1"></div>
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
                <p class="text-grey-darken-1">NO Products match your</p>
                <p class="text-grey-darken-1">search <span class="fw-700">"{{searchText}}"</span></p>
                <div class="text-indigo-accent-2">Reset Sort</div>
              </div>
            </template>
            <template v-else>
              <pos-management-group v-for="(group, i) in searchResult" v-bind="group" :key="`group_${i}`" @view:settings="view = 'settings'"/>
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
        <pos-management-setting :groups="groups"
                                @open:dialogDevice="dialog.newDevice = $event"
                                @open:dialogDelete="dialog.deleteDevice = $event"/>
      </template>
    </div>
    <dialog-new-group v-model="dialog.newGroup" @submit="addGroup($event)" :groups="groups"/>
    <dialog-new-store v-model="dialog.newStore" @submit="addStore($event)" :groups="groups"/>
    <dialog-new-device v-model="dialog.newDevice"/>
    <dialog-delete-item v-model="dialog.deleteDevice"/>
  </div>
</template>
<script>
  export default {
    name: 'PosManagement',
    props: {},
    data: function () {
      return {
        storePlaceHolder: $t('posManagement.searchPlaceholder'),
        username: 'Admin',
        srcImg: 'https://loremflickr.com/320/240',
        view: 'settings',
        groups: [
          {
            id: 1,
            name: 'KFC',
            stores: [
              {
                id: 1,
                name: 'KFC Duy Tan',
                address: '10 Duy Tan, Dich Vong Hau, Cau Giay, Ha Noi',
                status: 'online',
                webshop: true,
                showSetting: false,
              },
              {
                id: 2,
                name: 'KFC Hoan Kiem',
                address: '15 Trang Tien',
                status: 'offline',
                showSetting: false,
              },
              {
                id: 3,
                name: 'KFC BIG C HỒ GƯƠM PLAZA',
                address: 'Kiosk 8, Tang 1, TTTM Ho Guom Plaza, 156 Tran Phu, Ha Dong, Ha Noi',
                showSetting: false,
              },
              {
                id: 4,
                name: 'KFC TIMES CITY MEGA MALL',
                address: 'B1-D9-3A, TTTM Times City Mega Mall',
                status: 'online',
                showSetting: false,
              },
              {
                id: 5,
                name: 'KFC PHẠM NGỌC THẠCH',
                address: ' Kiốt 30, Tầng 1 B14 Kim Liên, Phạm Ngọc Thạch, Đống Đa, Hà Nội',
                status: 'online',
                showSetting: false,
              },
            ]
          }
        ],
        searchText: '',
        dialog: {
          newGroup: false,
          newStore: false,
          newDevice: false,
          deleteDevice: false,
        },
        showFilterMenu: false,
      }
    },
    computed: {
      searchResult() {
        return this.groups
      }
    },
    methods: {
      addGroup(name) {

      },
      addStore(store) {

      }
    }
  }
</script>

<style scoped lang="scss">
  .pos-management {
    display: flex;
    width: 100vw;
    height: 100vh;
    font-size: 15px;

    &__sidebar {
      .g-sidebar {
        .sidebar-header {
          padding: 12px;
          display: flex;
          align-items: center;
          font-size: 14px;
          line-height: 18px;
          font-weight: 600;
          color: #1d1d26;

          .username {
            word-break: break-all;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-weight: 600;
            padding-left: 8px;
          }
        }
      }
    }

    &__main {
      flex: 1;
      background-color: #F4F7FB;
      padding: 50px 50px 20px;
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
    }
  }

  .g-select {
    .bs-tf-wrapper {
      margin-left: 0;
      margin-bottom: 16px;
    }

    .bs-tf-inner-input-group {
      height: 44px;
    }

    .g-chip {
      border-radius: 2px;
    }
  }
</style>
