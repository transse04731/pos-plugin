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
                  <span class="ml-1">{{device.alias}}</span>
                </div>
                <div class="col-2">
                  {{device.name}}
                </div>
                <div class="col-3">
                  {{device.appName}}
                </div>
                <div class="row-flex col-3">
                  <g-select class="w-50" :items="listVersion" v-model="device.appVersion"/>
                  <p class="ml-3 text-indigo-accent-2" style="cursor: pointer">Update</p>
                </div>
                <div class="col-1">
                  <g-tooltip
                      :open-on-hover="true" bottom speech-bubble color="#000" transition="0.3"
                      remove-content-on-close>
                    <template v-slot:activator="{on}">
                      <div
                          v-if="device.paired && !disableRemoteControlBtn"
                          class="pos-management-group__content-btn"
                          @mouseenter="on.mouseenter"
                          @mouseleave="on.mouseleave"
                          @click="() => {startRemoteControl(store._id); on.mouseleave()}">
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
    },
    data() {
      return {
        showContent: false,
        showStoreSetting: {},
        storeDeviceMap: {},
        iframeWidth: window.innerWidth * 0.6,
        iframeHeight: window.innerHeight * 0.6,
        showIframe: false,
        iframeSrc: 'about:blank',
        iframeDragging: false,
        iframeRefreshInterval: null,
        remoteControlDeviceId: null,
        disableRemoteControlBtn: false,
        listVersion: [
          {text: '1.51', value: '1.51'}
        ],
        // contain device id which is currently online (web socket of device is connected to server)
        onlineDevices: ['5e96fb59a28f4f64aaccf778']
      }
    },
    watch: {
      stores() {
        this.stores.forEach(async store => {
          const storeId = store._id
          const device = await cms.getModel('OnlineOrderDevice').findOne({storeId, paired: true})
          this.$set(this.storeDeviceMap, storeId, device || {})
        })
      }
    },
    methods: {
      getDeviceIcon(device) {
        if (_.includes(this.onlineDevices, device._id))
          return 'icon-screen_blue'
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
        window.open(`${location.origin}/view/store/${store.alias || store._id}/setting`)
      },
      startRemoteControl(storeId) {
        if (this.disableRemoteControlBtn) return
        this.disableRemoteControlBtn = true

        this.remoteControlDeviceId = this.storeDeviceMap[storeId]._id
        const {socket} = window.cms

        socket.emit('startRemoteControl', this.remoteControlDeviceId, proxyPort => {
          if (proxyPort) {
            this.iframeSrc = `http://localhost:${proxyPort}/view/pos-dashboard`
            this.showIframe = true

            this.iframeRefreshInterval = setInterval(() => {
              this.iframeSrc = ''
              this.$nextTick(() => this.iframeSrc = `http://localhost:${proxyPort}/view/pos-dashboard`)
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
    },
    beforeDestroy() {
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
