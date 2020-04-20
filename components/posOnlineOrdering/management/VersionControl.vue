<template>
  <div class="version-control">
    <div class="version-control__title">List Version Control</div>
    <div class="version-control__action-bar">
      <g-btn-bs background-color="indigo accent-2" text-color="white" icon="add@20" style="margin-right: 0; font-size: 15px" @click="openVersionDialog()">Add New Version</g-btn-bs>
    </div>
    <div class="version-control__table">
      <div class="version-control__table-header">
        <div class="col-3 pl-3" @click="_sort('name')">
          File Name
          <g-icon v-if="sort.type === 'name'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="flex-equal pl-1" @click="_sort('version')">
          Version
          <g-icon v-if="sort.type === 'version'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="flex-equal pl-1" @click="_sort('type')">
          Type
          <g-icon v-if="sort.type === 'type'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="flex-equal pl-1" @click="_sort('uploadTime')">
          Upload date
          <g-icon v-if="sort.type === 'uploadTime'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="col-1 ta-center" @click="_sort('status')">
          Status
          <g-icon v-if="sort.type === 'status'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="col-3 pl-2">Changelog</div>
        <div class="col-1"></div>
      </div>
      <div class="version-control__table-content">
        <template v-if="!listVersionControl || listVersionControl.length === 0">
          <div class="version-control__table-content--empty">
            <img alt src="/plugins/pos-plugin/assets/empty_group.svg"/>
            <p class="text-grey-darken-1 mt-2">Version is currently empty</p>
            <g-btn-bs text-color="indigo accent-2" icon="add@16" class="fw-700" @click="openVersionDialog()">Add New Version</g-btn-bs>
          </div>
        </template>
        <template v-else>
          <div v-for="(file, i) in listVersionControl" :key="i" :class="getRowClass(i)">
            <div class="col-3 pl-3">{{file.name}}</div>
            <div class="flex-equal pl-1">{{file.version}}</div>
            <div class="flex-equal pl-1">{{file.type}}</div>
            <div class="flex-equal pl-1">{{file.uploadDate | formatDate }}</div>
            <div class="col-1 ta-center"><span :class="getStatusClass(file.status)">{{file.status}}</span></div>
            <div class="col-3 changelog">{{file.changeLog}}</div>
            <div class="col-1 row-flex pl-2">
              <g-tooltip :open-on-hover="true" bottom speech-bubble color="#000" transition="0.3" remove-content-on-close>
                <template v-slot:activator="{on}">
                  <div class="version-control__table__btn"
                       @mouseenter="on.mouseenter"
                       @mouseleave="on.mouseleave"
                       @click.stop.prevent="openVersionDialog(true, file)">
                    <g-icon color="#FFF" small>mdi-pencil-outline</g-icon>
                  </div>
                </template>
                <span>Edit</span>
              </g-tooltip>
              <g-tooltip :open-on-hover="true" bottom speech-bubble color="#000" transition="0.3" remove-content-on-close>
                <template v-slot:activator="{on}">
                  <div class="version-control__table__btn ml-1"
                       @mouseenter="on.mouseenter"
                       @mouseleave="on.mouseleave"
                       @click.stop.prevent="openDialogDeleteVersion(file)">
                    <g-icon color="#FFF" small>mdi-trash-can-outline</g-icon>
                  </div>
                </template>
                <span>Delete</span>
              </g-tooltip>
            </div>
          </div>
        </template>
      </div>
    </div>
    <dialog-delete-item v-model="dialog.delete" type="version" @confirm="deleteFile"/>
    <dialog-version-control v-if="dialog.version" v-model="dialog.version" :edit="dialog.edit" v-bind="selectedFile" @edit="editFile" @add="addFile"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  
  export default {
    name: "VersionControl",
    props: { },
    injectService: ['PosOnlineOrderManagementStore:(loadApps,uploadApp,editApp,removeApp,apps)'],
    data() {
      return {
        sort: {},
        selectedFile: null,
        dialog: {
          version: false,
          edit: false,
          delete: false
        }
      }
    },
    async created() {
      await this.loadApps()
    },
    filters: {
      formatDate(date) {
        return dayjs(date).format('DD/MM/YYYY')
      }
    },
    computed: {
      listVersionControl() {
        return _.orderBy(this.apps, this.sort.type, this.sort.order)
      }
    },
    methods: {
      getRowClass(index) {
        const defaultClass = 'version-control__table-row '
        if (index % 2 === 0)
          return defaultClass + 'version-control__table-row--even'
        return defaultClass + 'version-control__table-row--odd'
      },
      getStatusClass(status) {
        if(status.toLowerCase() === 'private') {
          return 'status status--private'
        }
        if(status.toLowerCase() === 'public') {
          return 'status status--public'
        }
        return ''
      },
      openVersionDialog(edit = false, file = null) {
        this.selectedFile = file
        this.dialog.edit = edit
        this.dialog.version = true
      },
      openDialogDeleteVersion(file) {
        this.selectedFile = file
        this.dialog.delete = true
      },
      async deleteFile() {
        await this.removeApp(this.selectedFile._id)
      },
      async editFile(change) {
        // TODO: change folder
        await this.editApp(this.selectedFile._id, change)
      },
      async addFile(app) {
        await this.uploadApp(app)
      },
      _sort(type) {
        if(this.sort.type && this.sort.type === type) {
          if(this.sort.order === 'asc') {
            this.$set(this.sort, 'order', 'desc')
          } else {
            this.$set(this.sort, 'type', null)
          }
        } else {
          this.sort = {
            type: type,
            order: 'asc',
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .version-control {
    height: 100%;

    &__title {
      font-size: 20px;
      line-height: 25px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 24px;
    }

    &__action-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 16px;
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

        .status {
          border-radius: 16px;
          line-height: 2;
          text-transform: capitalize;

          &--private {
            background: #FFF3E0;
            color: #FF9800;
            padding: 6px 9px;
          }

          &--public {
            background: #DFF2DF;
            color: #4CAF50;
            padding: 6px 12px;
          }
        }

        .changelog {
          padding-left: 8px;
          font-weight: 600;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          min-width: 0;
        }
      }

      &__btn {
        background: #616161;
        border-radius: 2px;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          background: #536DFE;
        }
      }
    }
  }
</style>
