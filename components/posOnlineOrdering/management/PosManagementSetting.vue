<template>
  <div class="pos-management-setting">
    <!-- BASIC INFO -->
    <div class="pos-management-setting__info">
      <div class="pos-management-setting__title">Basic Information</div>
      <g-select large deletable-chips multiple text-field-component="GTextFieldBs" label="Group"
                :items="groups"
                item-text="name"
                item-value="_id"
                v-model="computedGroup"/>
      <g-text-field-bs large label="Name" v-model="computedName"/>
      <g-text-field-bs large label="Address" v-model="computedAddress"/>
    </div>
    
    <!-- ONLINE ORDER STORE -->
    <div class="pos-management-setting__order">
      <div class="pos-management-setting__title">Online Ordering</div>
      <div>
        <p>Online ordering</p>
        <g-radio-group v-model="computedOnlineOrdering" row>
          <g-radio color="#536DFE" label="Active" value="1"/>
          <g-radio color="#536DFE" label="In-active" value="0"/>
        </g-radio-group>
      </div>
      <div>
        <p>WebShop URL</p>
        <div class="pos-management-setting__order--url r">
          <span class="i text-indigo-accent-2">{{ webShopUrlPrefix }}</span>
          <div style="flex: 1; margin-left: 8px">
            <g-text-field-bs :class="[message && 'error']" large :placeholder="_id" :value="alias" @input="updateAlias"/>
          </div>
          <div v-if="message" class="error-message">{{message}}</div>
        </div>
      </div>
      <div>
        <p>Client's domain</p>
        <g-text-field-bs large v-model="clientDomain" @input="updateDebounce({ clientDomain: $event })"/>
      </div>
    </div>
    
    <!-- DEVICES -->
    <div class="pos-management-setting__device">
      <div class="pos-management-setting__title">Device status</div>
      <template v-if="devices.length === 0">
        <div class="pos-management-setting__device--empty">
          <img alt src="/plugins/pos-plugin/assets/empty_group.svg"/>
          <p class="text-grey-darken-1 mb-2 mt-2">Device is currently empty.</p>
          <div class="text-indigo-accent-2" style="cursor: pointer" @click="$emit('open:dialogDevice', true)">
            <g-icon style="margin-bottom: 4px; margin-right: -4px" size="18" color="indigo-accent-2">add</g-icon>
            Add New Device
          </div>
        </div>
      </template>
      <template v-else>
        <div class="pos-management-setting__device-content">
          <div class="pos-management-setting__device-content--add">
            <g-icon color="indigo-accent-2" size="60">add</g-icon>
            <p class="text-indigo-accent-2">Add New Device</p>
          </div>
          <div v-for="device in devices">
            <p class="fw-700 mb-2">Name</p>
            <p class="mb-1">Device type: {{device.type}}</p>
            <p class="mb-1">OS: {{device.os}}</p>
            <p class="mb-1">Status: {{device.status}}</p>
            <g-btn-bs elevation="2" text-color="#757575">Disable</g-btn-bs>
            <div class="pos-management-setting__device-content--action">
              <g-tooltip :open-on-hover="true" right speech-bubble color="#000" transition="0.3" remove-content-on-close>
                <template v-slot:activator="{on}">
                  <div class="pos-management-setting__device-content--action-btn mt-1"
                       @mouseenter="on.mouseenter"
                       @mouseleave="on.mouseleave"
                       @click.stop.prevent="$emit('open:dialogDelete', true)">
                    <g-icon color="#FFF" small>mdi-trash-can-outline</g-icon>
                  </div>
                </template>
                <span>Delete</span>
              </g-tooltip>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  
  export default {
    name: "PosManagementSetting",
    props: {
      _id: String,
      name: String,
      group: null,
      address: String,
      onlineOrdering: Boolean,
      alias: String,
      clientDomain: String,
      devices: Array,
      groups: Array,
      aliases: Array,
    },
    injectService: ['PosOnlineOrderManagementStore:(stores)'],
    data() {
      return {
        message: ''
      }
    },
    created() {
      this.updateDebounce = _.debounce(this.update, 1000)
    },
    computed: {
      webShopUrlPrefix() {
        return`${location.host}/store/`
      },
      computedGroup: {
        get() {
          return this.group.map(g => g._id)
        },
        set(val) {
          this.updateDebounce({ groups: val })
        }
      },
      computedName: {
        get() {
          return this.name
        },
        set(val) {
          this.updateDebounce({ name: val })
        }
      },
      computedAddress: {
        get() {
          return this.address
        },
        set(val) {
          this.updateDebounce({ address: val })
        }
      },
      computedOnlineOrdering: {
        get() {
          return this.onlineOrdering ? "1" : "0"
        },
        set(value) {
          this.update({ onlineOrdering: value === "1" })
        }
      }
    },
    methods: {
      updateAlias(value) {
        this.message = ''
        if (_.trim(value) === '') {
          this.message = 'Webshop url must not empty!!'
          return
        }
        const store = _.find(this.stores, store => store.alias === value)
        if (store) {
          if (store._id !== this._id) {
              this.message = 'WebShop identity has been taken!!'
              return
          }
        }
        this.updateDebounce({ alias: value })
      },
      update(change) {
        this.$emit('update', change)
      }
    }
  }
</script>

<style scoped lang="scss">
  .pos-management-setting {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    height: calc(100% - 50px);

    & > div {
      background: white;
      border-radius: 4px;
      padding: 24px
    }

    &__title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    &__info {
      grid-area: 1/1/2/2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &__order {
      grid-area: 2/1/3/2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &--url {
        display: flex;
        align-items: center;

        .error-message {
          position: absolute;
          bottom: -4px;
          right: 8px;
          color: #ff4452;
          font-size: 12px;
          font-style: italic;
        }

        .error ::v-deep {
          .bs-tf-input-group {
            .bs-tf-inner-input-group {
              border-color: #ff4452 !important;
              box-shadow: 0 0 0 3px rgba(233, 0, 0, 0.25)
            }
          }
        }
      }
    }

    &__device {
      grid-area: 1/2/3/3;

      &--empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
        margin-top: 96px;
      }

      &-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 1fr;
        grid-gap: 16px;

        & > div {
          border-radius: 2px;
          background: #FAFAFC;
          border: 1px solid #EFEFEF;
          padding: 12px 16px;
          position: relative;
        }

        &--add {
          border: 2px dashed #BBDEFB !important;
          background: white !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        &--action {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          flex-direction: column;

          &-btn {
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

        .g-btn-bs {
          display: block;
          margin-top: 8px;
        }
      }
    }
  }
</style>
