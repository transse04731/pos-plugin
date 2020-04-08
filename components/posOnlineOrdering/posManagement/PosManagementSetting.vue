<template>
  <div class="pos-management-setting">
    <div class="pos-management-setting__info">
      <div class="pos-management-setting__title">Basic Information</div>
      <g-select large deletable-chips multiple text-field-component="GTextFieldBs" label="Group" :items="listGroups"
                v-model="computedGroup"/>
      <g-text-field-bs large label="Name" v-model="computedName"/>
      <g-text-field-bs large label="Address" v-model="computedAddress"/>
    </div>
    <div class="pos-management-setting__order">
      <div class="pos-management-setting__title">Online Ordering</div>
      <div>
        <p>Online ordering</p>
        <g-radio-group v-model="status" row>
          <g-radio color="#536DFE" label="Active" value="active"/>
          <g-radio color="#536DFE" label="Disabled" value="disabled"/>
        </g-radio-group>
      </div>
      <div>
        <p>Webshop URL</p>
        <div class="pos-management-setting__order--url">
          <span class="i text-indigo-accent-2">pos.gigasource.io/</span>
          <div style="flex: 1; margin-left: 8px">
            <g-text-field-bs large v-model="url"/>
          </div>
        </div>
      </div>
      <div>
        <p>Client's domain</p>
        <g-text-field-bs large v-model="domain"/>
      </div>
    </div>
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
  export default {
    name: "PosManagementSetting",
    props: {
      name: String,
      group: null,
      groups: Array,
      address: String,
      devices: {
        type: Array,
        default: () => [
          {
            name: 'Device 1',
            type: 'Other',
            os: 'Android',
            status: 'active'
          },
          {
            name: 'Device 2',
            type: 'Other',
            os: 'Window',
            status: 'active'
          },
          {
            name: 'Device 3',
            type: 'Other',
            os: 'Android',
            status: 'active'
          },
        ]
      },
    },
    data() {
      return {
        status: null,
        url: '',
        domain: '',
      }
    },
    computed: {
      listGroups() {
        return this.groups.map(g => ({
          text: g.name,
          value: g.id
        }))
      },
      computedGroup: {
        get() {
          return this.group
        },
        set(val) {
          //TODO: update into db
        }
      },
      computedName: {
        get() {
          return this.name
        },
        set(val) {
          //TODO: update into db
        }
      },
      computedAddress: {
        get() {
          return this.address
        },
        set(val) {
          //TODO: update into db
        }
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
