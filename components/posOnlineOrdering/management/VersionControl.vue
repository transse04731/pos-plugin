<template>
  <div class="version-control">
    <div class="version-control__title">List Version Control</div>
    <div class="version-control__action-bar">
      <g-btn-bs border-color="indigo accent-2" icon="add@20" @click="dialog.newApp = true">Add New App</g-btn-bs>
      <g-btn-bs background-color="indigo accent-2" text-color="white" icon="add@20"
                style="margin-right: 0; font-size: 15px" @click="openVersionDialog()">Add New Version
      </g-btn-bs>
    </div>
    <div class="version-control__table">
      <div class="version-control__table-header">
        <div class="col-3 pl-3" @click="_sort('version')">
          Version
          <g-icon v-if="sort.type === 'version'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="col-1 pl-1" @click="_sort('type')">
          Type
          <g-icon v-if="sort.type === 'type'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="col-1 pl-1" @click="_sort('base')">
          From
          <g-icon v-if="sort.type === 'base'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="col-1 pl-1" @click="_sort('release')">
          Release
          <g-icon v-if="sort.type === 'release'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="col-2 pl-1" @click="_sort('uploadTime')">
          Upload date
          <g-icon v-if="sort.type === 'uploadTime'" size="16">{{sort.order === 'asc' ? 'fas fa-long-arrow-alt-up' : 'fas fa-long-arrow-alt-down'}}</g-icon>
        </div>
        <div class="flex-equal pl-2">Note</div>
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
          <div v-for="(group, i) in listVersionControl" :key="`group_${i}`">
            <div class="version-control__group">
              <div class="version-control__group-header" @click="toggleGroup(group)">
                <g-icon size="20" v-if="group.show">expand_less</g-icon>
                <g-icon size="20" v-else>expand_more</g-icon>
                <g-edit-view-input
                    @click.native.stop.prevent="() => {}"
                    :value="group.group"
                    class="ml-2"
                    @input="(name, cb) => changeGroupName(group, name, cb)"/>
              </div>
              <g-expand-transition>
                <div v-if="group.show">
                  <div v-for="(file, j) in group.files" :key="`${i}_file_${j}`" :class="getRowClass(j)">
                    <div class="col-3 pl-3">{{file.version}}</div>
                    <div class="col-1 pl-1">{{file.type}}</div>
                    <div class="col-1 pl-1">{{file.base}}</div>
                    <div class="col-1 pl-1">{{file.release}}</div>
                    <div class="col-2 pl-1">{{file.uploadDate | formatDate }}</div>
                    <div class="col-3 changelog">{{file.note}}</div>
                    <div class="col-1 row-flex align-items-center justify-center">
                      <g-menu v-model="file.menu" close-on-content-click nudge-bottom="5">
                        <template v-slot:activator="{on}">
                          <g-icon :class="[file.menu && 'menu--active']" @click="on.click">more_horiz</g-icon>
                        </template>
                        <div class="menu-action">
                          <div class="menu-action__option" @click="openVersionDialog(true, file, group.group)">Edit</div>
                          <div class="menu-action__option" @click="download(file)">Download</div>
                          <div class="menu-action__option" @click="openDialogDeleteVersion(file)">Delete</div>
                        </div>
                      </g-menu>
                    </div>
                  </div>
                </div>
              </g-expand-transition>
            </div>
          </div>
        </template>
      </div>
    </div>
    <dialog-delete-item v-model="dialog.delete" type="version" @confirm="deleteFile"/>
    <dialog-version-control v-if="dialog.version" v-model="dialog.version" :edit="dialog.edit" :group="dialog.group" v-bind="selectedFile"
                            @edit="editFile" @add="addFile"/>
    <g-dialog v-model="dialog.newApp" width="580" eager>
      <div class="dialog">
        <div class="dialog-title">Add New App</div>
        <g-text-field-bs label="App Name" v-model="name"/>
        <div class="dialog-action">
          <g-btn-bs large text-color="#424242" @click="dialog.newApp = false">Cancel</g-btn-bs>
          <g-btn-bs large :disabled="!name" width="100" background-color="indigo accent-2" text-color="white" @click="addNewApp">Save</g-btn-bs>
        </div>
      </div>
    </g-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: "VersionControl",
    props: {},
    injectService: ['PosOnlineOrderManagementStore:(loadApps,uploadApp,editApp,removeApp,apps)'],
    data() {
      return {
        sort: {},
        selectedFile: null,
        dialog: {
          version: false,
          edit: false,
          delete: false,
          group: null,
          newApp: false
        },
        listVersions: [
          {
            group: 'POS_Android',
            files: [
              {
                version: '1.02',
                type: 'Patch',
                base: '1.00',
                release: 'Beta',
                uploadDate: new Date('01/17/2020'),
                note: 'Bug fixes & stability improvement',
                menu: false,
              },
              {
                version: '1.01',
                type: 'Patch',
                base: '1.00',
                release: 'Stable',
                uploadDate: new Date('01/15/2020'),
                note: 'Bug fixes & stability improvement',
                menu: false,
              },
              {
                version: '1.00',
                type: 'APK',
                release: 'Stable',
                uploadDate: new Date ('01/01/2020'),
                note: 'Bug fixes & stability improvement',
                menu: false,
              },
              {
                version: '0.80',
                type: 'APK',
                release: 'Archived',
                uploadDate: new Date('01/01/2019'),
                note: 'Bug fixes & stability improvement',
                menu: false,
              },
            ],
            show: false,
          },
          {
            group: 'POS_Windows', files: [], show: false
          }
        ],
        name: ''
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
        return _.map(this.listVersions, item => ({
          group: item.group,
          files: _.orderBy(item.files, this.sort.type, this.sort.order),
          show: item.show
        }))
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
        if (status.toLowerCase() === 'private') {
          return 'status status--private'
        }
        if (status.toLowerCase() === 'public') {
          return 'status status--public'
        }
        return ''
      },
      openVersionDialog(edit = false, file = null, group = null) {
        this.selectedFile = file
        this.dialog.edit = edit
        this.dialog.group = group
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
        if (this.sort.type && this.sort.type === type) {
          if (this.sort.order === 'asc') {
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
      },
      toggleGroup(group) {
        const g = this.listVersions.find(g => g.group === group.group)
        g.show = !g.show
      },
      download(file) {

      },
      changeGroupName(group, name, cb) {
        const g = this.listVersions.find(g => g.group === group.group)
        g.name = name
        cb && typeof cb === 'function' && cb()
      },
      addNewApp(){
        this.listVersions.push({
          group: this.name,
          versions: [],
          show: false
        })
        this.name = ''
        this.dialog.newApp = false
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

        .changelog {
          padding-left: 8px;
          font-weight: 600;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          min-width: 0;
        }
      }
    }

    &__group {
      &-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        border-bottom: 1px solid #EFEFEF;

        .g-icon {
          margin: 16px;
          box-shadow: 0.5px 0px 2px rgba(0, 0, 0, 0.1398);
        }
      }
    }
  }

  .menu {
    &--active {
      border-radius: 50%;
      background: #F4F5FA;
      color: #1d1d26 !important;
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

  .dialog {
    background: white;
    border-radius: 4px;
    width: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;

    &-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
      margin-left: 5px;
    }

    &-action {
      display: flex;
      align-self: flex-end;
      margin-top: 24px;
      margin-right: -8px;
    }
  }
</style>
