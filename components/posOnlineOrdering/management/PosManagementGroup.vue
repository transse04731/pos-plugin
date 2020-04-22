<template>
  <div class="pos-management-group">
    <div class="pos-management-group__header" @click="toggleContent">
      <g-icon size="20" v-if="showContent">expand_less</g-icon>
      <g-icon size="20" v-else>expand_more</g-icon>
      <div class="pos-management-group__header-name">{{name}}</div>
    </div>
    <template v-if="showContent">
      <div class="pos-management-group__content">
        <div v-for="(store, i) in stores" :class="getStoreRowClass(i)">
          <div class="pos-management-group__content-info" @click="toggleStoreSetting(store)">
            <div style="flex: 0 0 25%; padding-left: 16px">
              <div class="fw-700 text-blue-accent-3">ID: {{store.id}}</div>
              <div>{{store.name}}</div>
              <div>{{store.address}}</div>
            </div>
            <div style="flex: 1">
              <div class="row-flex" v-for="(device, index) in store.devices" :key="`device_${store.id}_${index}`">
                <div class="row-flex col-3">
                  <g-icon>{{getDeviceIcon(device)}}</g-icon>
                  <span class="ml-1">{{device.name}}</span>
                </div>
                <div class="col-2">
                  {{device.hardware}}
                </div>
                <div class="col-3">
                  {{device.appName}}
                </div>
                <div class="row-flex col-3">
                  <g-select class="w-50" :items="appVersions" v-model="device.appVersion"/>
                  <p class="ml-3 text-indigo-accent-2" style="cursor: pointer" @click="updateAppVersion(device)">Update</p>
                </div>
                <div class="col-1">
                  <g-tooltip
                      :open-on-hover="true" top speech-bubble color="#000" transition="0.3">
                    <template v-slot:activator="{on}">
                      <div :class="device.online && device.paired && device.features && device.features.includes('proxy') && !disableRemoteControlBtn
                                  ? 'pos-management-group__content-btn' : 'pos-management-group__content-btn--disabled'"
                           @mouseenter="on.mouseenter"
                           @mouseleave="on.mouseleave"
                           @click="() => {startRemoteControl(device.storeId, device._id); on.mouseleave()}">
                      </div>
                    </template>
                    <span>Remote Control</span>
                  </g-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="pos-management-group__content-action">
            <g-btn-bs small border-color="grey-darken-1" @click="$emit('view:settings', store)">Settings</g-btn-bs>
            <g-btn-bs small border-color="grey-darken-1" @click="openWebShopConfig(store)">WebShop Config</g-btn-bs>
          </div>
        </div>

        <g-dnd-dialog v-model="showIframe" :width="iframeWidth"
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
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: "PosManagementGroup",
    props: {
      name: String,
      stores: Array,
      apps: Array,
    },
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
        watchingClientStatus: false,
      }
    },
    computed: {
      appVersions() {
        return _.map(this.apps, app => ({ text: app.version, value: app.version }))
      }
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
      trackClientStatus(startWatching) {
        if (startWatching && this.watchingClientStatus) return

        this.watchingClientStatus = startWatching
        const {socket} = window.cms
        const deviceIdList = [];

        this.stores.forEach(store => store.devices.forEach(device => deviceIdList.push(device._id)));

        if (startWatching) {
          socket.emit('watchDeviceStatus', deviceIdList)
          socket.on('updateDeviceStatus', () => this.$emit('updateStores'))
        } else {
          socket.emit('unwatchDeviceStatus', deviceIdList)
          socket.off('updateDeviceStatus')
        }
      },
      async updateAppVersion(device) {
        const name = device.appName
        const version = device.appVersion
        const app = await cms.getModel('App').findOne({ version})
        if (app) {
          console.log('update app for device', device)
          const {socket} = window.cms
          socket.emit('updateApp', device._id, app.uploadPath)
          await cms.getModel('Device').updateOne({_id: device._id}, { version})
        } else {
          console.log('Found no app with version', version)
        }
      }
    },
    watch: {
      stores(val) {
        if (val) this.trackClientStatus(true)
      },
    },
    beforeDestroy() {
      this.trackClientStatus(false)
      this.stopRemoteControl()
    }
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

      .g-icon {
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
            }

            .g-tf-input {
              padding: 0;
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
  }
</style>
