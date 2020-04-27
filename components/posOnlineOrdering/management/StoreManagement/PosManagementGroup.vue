<template>
  <div class="pos-management-group">
    <div class="pos-management-group__header" @click="toggleContent">
      <g-icon class="icon-first" size="20" v-if="showContent">expand_less</g-icon>
      <g-icon class="icon-first" size="20" v-else>expand_more</g-icon>
      <g-edit-view-input
          :value="name"
          @click.native.stop.prevent="() => {}"
          @input="(value, cb) => $emit('changeGroupName', _id, value, cb)">
        <template v-slot:action="{mode, switchToEditMode, applyChange, resetValue}">
          <g-menu v-if="mode !== 'edit' && manageGroupPerm" v-model="nameEditMenu" close-on-content-click nudge-bottom="5" nudge-left="30">
            <template v-slot:activator="{on}">
              <div class="btn-edit" :style="[nameEditMenu && {background: '#F4F5FA'}]">
                <g-icon :class="[nameEditMenu && 'btn-edit--active']" size="16" @click="on.click">mdi-pencil-outline</g-icon>
              </div>
            </template>
            <div class="menu-edit">
              <div @click="switchToEditMode()">Rename</div>
              <div v-if="stores.length === 0" @click="deleteGroup">Delete</div>
            </div>
          </g-menu>
          <g-icon v-if="mode === 'edit'" @click="applyChange()" class="ml-1">mdi-check</g-icon>
          <g-icon v-if="mode === 'edit'" @click="resetValue()" class="ml-1">mdi-close</g-icon>
        </template>
      </g-edit-view-input>
    </div>
    <g-expand-transition>
      <template v-if="showContent || searchText">
        <div class="pos-management-group__content">
          <div v-for="(store, i) in stores" :class="getStoreRowClass(i)">
            <div class="pos-management-group__content-info" @click="toggleStoreSetting(store)">
              <div style="flex: 0 0 25%; padding-left: 16px">
                <div class="fw-700 text-blue-accent-3">ID: {{store.id}}</div>
                <div>{{store.settingName}}</div>
                <div>{{store.settingAddress}}</div>
              </div>
              <div style="flex: 1">
                <div class="row-flex mb-1" v-for="(device, index) in store.devices" :key="`device_${store.id}_${index}`">
                  <div class="row-flex col-2">
                    <g-icon>{{getDeviceIcon(device)}}</g-icon>
                    <span class="ml-1">{{device.name}}</span>
                  </div>
                  <div class="col-2">
                    {{device.hardware}}
                  </div>
                  <div class="row-flex col-3">
                    {{ `${device.appVersion} (${device.appName}, ${device.appRelease})` }}
                  </div>
                  <div class="row-flex col-4">
                    <template v-if="updateAppPerm">
                      <g-select class="w-60" :items="device.versions" v-model="device.updateVersion"/>
                      <p v-if="device.updateVersion" class="ml-3 text-indigo-accent-2" style="cursor: pointer" @click="updateAppVersion(device)">Update</p>
                    </template>
                  </div>
                  <div class="col-1 row-flex align-items-center">
                    <!-- remote control -->
                    <g-tooltip v-if="remoteControlPerm"
                               :open-on-hover="true" top speech-bubble color="#000" transition="0.3">
                      <template v-slot:activator="{on}">
                        <div :class="device.online && device.paired && device.features && device.features.proxy && !disableRemoteControlBtn
                                  ? 'pos-management-group__content-btn' : 'pos-management-group__content-btn--disabled'"
                             @mouseenter="on.mouseenter"
                             @mouseleave="on.mouseleave"
                             @click="() => {startRemoteControl(device.storeId, device._id); on.mouseleave()}">
                        </div>
                      </template>
                      <span>Remote Control</span>
                    </g-tooltip>
                    <!-- extra actions -->
                    <g-menu v-model="device.menu" close-on-content-click nudge-bottom="5">
                      <template v-slot:activator="{on}">
                        <g-icon :class="[device.menu && 'menu--active', 'ml-2']" @click="on.click">more_horiz</g-icon>
                      </template>
                      <div class="menu-action">
                        <div v-if="featureControlPerm" class="menu-action__option" @click="openFeatureControlDialog(store, device)">Feature control</div>
                        <div v-if="settingsPerm" class="menu-action__option" @click="$emit('open:dialogDelete', device)">Delete device</div>
                      </div>
                    </g-menu>
                  </div>
                </div>
              </div>
            </div>
            <div class="pos-management-group__content-action">
              <g-btn-bs v-if="settingsPerm" small border-color="grey-darken-1" @click="$emit('view:settings', store)">Settings</g-btn-bs>
              <g-btn-bs v-if="configOnlineOrderingPerm" small border-color="grey-darken-1" @click="openWebShopConfig(store)">WebShop Config</g-btn-bs>
            </div>
          </div>

          <g-dnd-dialog v-if="remoteControlPerm" v-model="showIframe" :width="iframeWidth"
                        :height="iframeHeight" lazy @close="stopRemoteControl"
                        @dragStart="iframeDragging = true" @dragEnd="iframeDragging = false"
                        @resizeStart="iframeDragging = true" @resizeEnd="iframeDragging = false">
            <template #title>
              Remote Control
            </template>

            <div v-if="showIframe && iframeDragging"
                 style="height: 100%; width: 100%; position: absolute; background: transparent"/>
            <iframe v-if="showIframe" :src="iframeSrc" width="100%" height="100%" @load="onIframeLoad" ref="iframe"/>
          </g-dnd-dialog>
        </div>
      </template>
    </g-expand-transition>
    
    <dialog-feature-control
        v-if="selectedDevice"
        v-model="dialog.featureControl"
        :device="selectedDevice"
        :store="selectedStore"
        @cancel="closeFeatureControlDialog"
        @save="updateDeviceAppFeature"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  import DialogFeatureControl from './dialogFeatureControl';

  export default {
    name: "PosManagementGroup",
    components: { DialogFeatureControl },
    props: {
      _id: String,
      name: String,
      stores: Array,
      appItems: Array,
    },
    injectService: [
      'PosOnlineOrderManagementStore:(searchText)',
      // permissions
      'PermissionStore:(versionControlPerm,manageAccountPerm,manageGroupPerm,manageStorePerm,settingsPerm,updateAppPerm,remoteControlPerm,featureControlPerm,configOnlineOrderingPerm)'
    ],
    data() {
      return {
        showContent: false,
        showStoreSetting: {},
        iframeWidth: window.innerWidth * 0.6,
        iframeHeight: window.innerHeight * 0.6,
        showIframe: false,
        iframeSrc: 'about:blank',
        iframeDragging: false,
        iframeRefreshInterval: null,
        remoteControlDeviceId: null,
        disableRemoteControlBtn: false,
        nameEditMenu: false,
        selectedStore: null,
        selectedDevice: null,
        dialog: {
          featureControl: false,
          deleteDevice: false
        }
      }
    },
    computed: {
    },
    methods: {
      getDeviceIcon(device) {
        if (device.online) return 'icon-screen_blue'

        return 'icon-screen'
      },
      toggleContent() {
        this.showContent = !this.showContent
      },
      toggleStoreSetting(store) {
        if (!_.has(this.showStoreSetting, store._id)) {
          this.$set(this.showStoreSetting, store._id, true)
        } else {
          this.showStoreSetting[store._id] = !this.showStoreSetting[store._id]
        }
      },
      getStoreRowClass(index) {
        if (index % 2 === 0)
          return 'pos-management-group__content--even'
        return 'pos-management-group__content--odd'
      },
      getStatusClass(status) {
        if (status === 'online')
          return 'pos-management-group__status--online'
        if (status === 'offline')
          return 'pos-management-group__status--offline'
        return ''
      },
      deleteStore(store) {
        this.$emit('delete', store)
      },
      openWebShopConfig(store) {
        window.open(`${location.origin}/setting/${store.alias || store._id}`)
      },
      startRemoteControl(storeId, deviceId) {
        if (this.disableRemoteControlBtn) return
        this.disableRemoteControlBtn = true

        this.remoteControlDeviceId = deviceId
        const {socket} = window.cms

        socket.emit('startRemoteControl', this.remoteControlDeviceId, proxyPort => {
          if (proxyPort) {
            this.iframeSrc = `${location.protocol}//${location.hostname}:${proxyPort}/view/pos-dashboard`
            this.showIframe = true

            this.iframeRefreshInterval = setInterval(() => {
              this.iframeSrc = ''
              this.$nextTick(() => this.iframeSrc = `${location.protocol}//${location.hostname}:${proxyPort}/view/pos-dashboard`)
            }, 10000)
          } else {
            // TODO: handle error
          }
        })
      },
      stopRemoteControl() {
        this.disableRemoteControlBtn = false

        if (this.iframeRefreshInterval) clearInterval(this.iframeRefreshInterval)
        if (!this.remoteControlDeviceId) return

        const {socket} = window.cms
        socket.emit('stopRemoteControl', this.remoteControlDeviceId)
        this.remoteControlDeviceId = null
      },
      onIframeLoad() {
        if (this.iframeRefreshInterval) clearInterval(this.iframeRefreshInterval)
      },
      async updateAppVersion(device) {
        if (!device.updateVersion)
          return
        const {socket} = window.cms
        socket.emit('updateApp', device._id, device.updateVersion)
        const versionInfo = _.find(device.versions, version => version.value === device.updateVersion)
        await cms.getModel('Device').updateOne({_id: device._id}, versionInfo)
        // TODO: update UI
      },
      deleteGroup() {
        this.$emit('delete:group', this.name)
      },
      openFeatureControlDialog(store, device) {
        this.selectedStore = store
        this.selectedDevice = device
        this.dialog.featureControl = true
      },
      closeFeatureControlDialog() {
        this.selectedStore = null
        this.selectedDevice = null
        this.dialog.featureControl = false
      },
      async updateDeviceAppFeature(features) {
        const {socket} = window.cms
        socket.emit('updateAppFeature', this.selectedDevice._id, features)
        await cms.getModel('Device').updateOne({_id: this.selectedDevice._id}, { features })
        this.dialog.featureControl = false
      }
    },
    beforeDestroy() {
      this.stopRemoteControl()
    },
  }
</script>

<style scoped lang="scss">
  .pos-management-group {
    width: 100%;

    &__header {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid #EFEFEF;

      .icon-first {
        margin: 16px;
        box-shadow: 0.5px 0px 2px rgba(0, 0, 0, 0.1398);
      }
    }

    &__content {
      border-bottom: 1px solid #EFEFEF;

      &--even {
        background: #FFFFFF;
      }

      &--odd {
        background: #FAFAFC;
      }

      &-info {
        display: flex;
        align-items: flex-start;
        font-size: 14px;
        color: #201F28;
        cursor: pointer;

        & > div {
          padding: 10px 0;
        }

        .g-select ::v-deep {
          .g-tf-wrapper {
            margin: 0;
            background: #efefef;
            border-radius: 2px;

            &:before, &:after {
              display: none;
            }

            .input {
              padding-left: 8px;
              width: 100%;
              overflow: auto;
              white-space: nowrap;
              scrollbar-width: none;

              &::-webkit-scrollbar {
                display: none;
              }
            }

            .g-tf-input {
              display: none;
            }
          }
        }
      }

      &-btn {
        background-image: url("/plugins/pos-plugin/assets/remote_control.svg");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        width: 25px;
        height: 25px;
        cursor: pointer;

        &:hover {
          background-image: url("/plugins/pos-plugin/assets/remote_control_blue.svg");
        }

        &--disabled {
          background-image: url("/plugins/pos-plugin/assets/remote_control.svg");
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          width: 25px;
          height: 25px;
          opacity: 0.2;
        }
      }


      &-action {
        display: flex;
        align-items: center;
        margin-left: 16px;
        padding-bottom: 14px;

        .g-btn-bs {
          margin: 0 2px;

          &:hover {
            background: #EFEFEF !important;
            border-color: #536DFE !important;
            color: #536DFE !important;
          }
        }
      }
    }

    &__status {
      &--online {
        background: #DFF2DF;
        color: #4CAF50;
        border-radius: 16px;
        line-height: 2;
        padding: 0 8px;
        text-transform: capitalize;
      }

      &--offline {
        background: #FFF3E0;
        color: #FF9800;
        border-radius: 16px;
        line-height: 2;
        padding: 0 8px;
        text-transform: capitalize;
      }
    }

    .btn-edit {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;

      &--active {
        color: #536DFE !important;
      }
    }
  }

  .menu {
    &-edit {
      background: white;
      border-radius: 2px;

      & > div {
        padding: 6px 12px;
        cursor: pointer;
      }
    }

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
