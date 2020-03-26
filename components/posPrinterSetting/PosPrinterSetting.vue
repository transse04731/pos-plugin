<template>
  <div class="h-100 r">
    <div class="configuration">
      <div class="config">
        <g-text-field-bs label="Name" v-model="editableName" append-inner-icon="icon-keyboard-red"/>
        <div class="switch-group">
          <g-switch label="1 Receipt for 1 Article"/>
          <g-switch label="Group Articles"/>
          <g-switch label="Sound"/>
          <g-switch label="ESC POS"/>
        </div>
      </div>
      <div class="config">
        <p class="title mb-3">{{$t('settings.thermalPrinter')}}</p>
        <div class="row-flex flex-wrap">
          <div v-for="(type, i) in printerTypes" :key="i"
               :class="['printer', selectedPrinterType === type && 'printer__active']" @click="select(type)">
            {{type.name}}
          </div>
          <div class="printer" @click="resetPrinter">
            {{$t('settings.reset')}}
          </div>
        </div>
      </div>
      <g-divider inset/>
      <div v-if="selectedPrinterType && selectedPrinterType.value === 'ip'" class="config">
        <div class="row-flex mx-2 align-items-end">
          <g-text-field-bs label="IP Address" v-model="ipAddress" append-inner-icon="icon-keyboard"/>
          <g-btn-bs border-color="#979797" class="w-33">
            {{$t('settings.setupPrinter')}}
          </g-btn-bs>
        </div>
        <g-btn-bs background-color="blue accent 3" style="margin: 16px 0 0 12px; padding: 8px 16px">
          {{$t('settings.testPrinter')}}
        </g-btn-bs>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PosPrinterSetting",
    props: {
      id: null,
      name: String,
      active: Boolean,
    },
    injectService: [
      'SettingsStore:(thermalPrinter, getThermalPrinter, updateThermalPrinter)',
    ],
    data() {
      return {
        hardware: null,
        printerTypes: [
          {name: 'Network Printer', value: 'ip'},
          {name: 'Serial Port', value: 'com'},
          {name: 'USB', value: 'usb'}
        ],
        selectedPrinterType: null,
        editableName: ''
      }
    },
    computed: {
      ipAddress: {
        get() {
          if (this.thermalPrinter) {
            return this.thermalPrinter.ip
          }
          return ''
        },
        set(val) {
          if(!this.active) return
          if (this.thermalPrinter) {
            this.$set(this.thermalPrinter, 'ip', val)
          } else {
            this.thermalPrinter = {
              printerType: 'ip',
              ip: val
            }
          }
        }
      }
    },
    methods: {
      select(type) {
        this.selectedPrinterType = type;
        if (!this.active) return
        if (this.thermalPrinter) {
          this.thermalPrinter.printerType = type.value;
        } else {
          this.thermalPrinter = {
            printerType: type.value
          }
        }
      },
      resetPrinter() {
        this.selectedPrinterType = null;
        if (!this.active) return
        if (this.thermalPrinter) {
          this.thermalPrinter.printerType = null;
        } else {
          this.thermalPrinter = {
            printerType: null
          }
        }
      }
    },
    watch: {
      async active(val) {
        if (!val) {
          if (this.thermalPrinter) {
            this.thermalPrinter = {}
          }
          this.selectedPrinterType = null
          if (this.unwatch) this.unwatch()
          return
        }
        await this.getThermalPrinter();
        if (this.thermalPrinter) {
          this.selectedPrinterType = this.printerTypes.find(t => t.value === this.thermalPrinter.printerType)
        }

        const settingsStore = this.$getService('SettingsStore')
        this.unwatch = settingsStore.$watch('thermalPrinter', async newVal => {
          await this.updateThermalPrinter(newVal._id, newVal)
        }, {deep: true})
      },
      name(val) {
        this.editableName = val
      }
    },
    beforeDestroy() {
      if (this.active)
        this.unwatch()
    }
  }
</script>

<style scoped lang="scss">
  .configuration {
    width: 75%;

    .config {
      padding: 16px 8px 12px;

      .title {
        color: #1D1D26;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        margin-left: 8px;
      }

      .printer {
        width: calc(33% - 16px);
        flex: 0 0 calc(33% - 16px);
        margin: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F0F0F0;
        border: 1px solid #979797;
        border-radius: 2px;
        padding: 20px;
        color: #4D4D4E;
        font-size: 13px;
        line-height: 16px;

        &__active {
          border-color: #1271ff;
        }
      }

      .switch-group {
        width: 65%;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: 1fr 1fr;
        grid-column-gap: 36px;
        margin-left: 4px;

        .g-switch-wrapper {
          ::v-deep .g-switch-label {
            font-size: 13px;
          }
        }
      }
    }

    .bs-tf-wrapper {
      width: 65%;
      margin: 0 0 0 4px;

      ::v-deep .bs-tf-label {
        font-weight: 700;
        margin-bottom: 16px;
      }
    }
  }
</style>
