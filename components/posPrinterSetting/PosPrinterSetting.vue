<template>
  <div class="configuration">
    <div v-if="type === 'kitchen'" class="config">
      <g-text-field-bs label="Name" v-model="editableName" append-inner-icon="icon-keyboard-red"
                       @input="changePrinterName"/>
    </div>
    <div class="config">
      <p class="title">{{$t('settings.thermalPrinter')}}</p>
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
      </div>
      <g-btn-bs background-color="blue accent 3" style="margin: 16px 0 0 8px; padding: 8px 16px">
        {{$t('settings.testPrinter')}}
      </g-btn-bs>
    </div>
    <div v-if="type === 'entire'" class="receipt-config">
      <g-switch label="Only Take Away" v-model="onlyTakeAway"/>
      <div class="title">Include:</div>
      <g-grid-select multiple item-cols="auto" :items="listReceipt" v-model="includes">
        <template v-slot:default="{toggleSelect, item}">
          <div class="option" @click="e => {toggleSelect(item);}">
            {{item}}
          </div>
        </template>
        <template v-slot:selected="{toggleSelect, item}">
          <div class="option option--selected" @click="e => {toggleSelect(item);}">
            {{item}}
          </div>
        </template>
      </g-grid-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PosPrinterSetting",
    props: {
      id: null,
      name: String,
      type: String,
      index: Number
    },
    injectService: [
      'SettingsStore:(printer, getPrinterById, updateGroupPrinterName, updatePrinter, getGroupPrintersByType)',
    ],
    data() {
      return {
        printerTypes: [
          {name: 'Network Printer', value: 'ip'},
          {name: 'Serial Port', value: 'com'},
          {name: 'USB', value: 'usb'}
        ],
        selectedPrinterType: null,
        editableName: this.name,
        listReceipt: []
      }
    },
    computed: {
      ipAddress: {
        get() {
          if (this.printer) {
            return this.printer.ip
          }
          return ''
        },
        async set(val) {
          if (this.printer) {
            this.$set(this.printer, 'ip', val)
          } else {
            this.printer = {
              printerType: 'ip',
              ip: val
            }
          }
          await this.updatePrinter(this.printer._id, this.printer, this.id, this.index)
        }
      },
      onlyTakeAway: {
        get() {
          if (this.printer) {
            return this.printer.onlyTakeAway
          }
          return false
        },
        async set(val) {
          if (this.printer) {
            this.$set(this.printer, 'onlyTakeAway', val)
          } else {
            this.printer = {
              onlyTakeAway: val
            }
          }
          await this.updatePrinter(this.printer._id, this.printer, this.id, this.index)
        }
      },
      includes: {
        get() {
          if (this.printer) {
            return this.printer.includes
          }
          return []
        },
        async set(val) {
          if (this.printer) {
            this.$set(this.printer, 'includes', val)
          } else {
            this.printer = {
              includes: val
            }
          }
          await this.updatePrinter(this.printer._id, this.printer, this.id, this.index)
        }
      }
    },
    methods: {
      async select(type) {
        this.selectedPrinterType = type;
        if (this.printer) {
          this.printer.printerType = type.value;
        } else {
          this.printer = {
            printerType: type.value
          }
        }
        await this.updatePrinter(this.printer._id, this.printer, this.id, this.index)
      },
      async resetPrinter() {
        this.selectedPrinterType = null;
        if (this.printer) {
          this.printer.printerType = null;
        } else {
          this.printer = {
            printerType: null
          }
        }
        await this.updatePrinter(this.printer._id, this.printer, this.id, this.index)
      },
      async setupPrinter() {
        await this.getPrinterById(this.id, this.index)
        if (this.printer) {
          this.selectedPrinterType = this.printerTypes.find(t => t.value === this.printer.printerType)
        }
      },
      async changePrinterName() {
        await this.updateGroupPrinterName(this.id, this.editableName)
      }
    },
    watch: {
      name(val) {
        this.editableName = val
      },
      async id(val) {
        if (!val) {
          if (this.printer) {
            this.printer = {}
          }
          this.selectedPrinterType = null
          return
        }
        await this.setupPrinter()
      },
      async index() {
        await this.setupPrinter()
      },
      async type(val) {
        if(val && val === 'receipt') {
          const receipts = await this.getGroupPrintersByType('kitchen')
          this.listReceipt = receipts.map(r => r.name)
        }
      }
    },
    async created() {
      await this.setupPrinter()
      const receipts = await this.getGroupPrintersByType('kitchen')
      this.listReceipt = receipts.map(r => r.name)
    },
  }
</script>

<style scoped lang="scss">
  .configuration {
    width: 75%;
    padding-left: 32px;

    .title {
      color: #1D1D26;
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
      margin-left: 4px;
      margin-bottom: 4px;
    }

    .config {
      padding: 16px 8px 12px;

      .printer {
        width: calc(33% - 16px);
        flex: 0 0 calc(33% - 16px);
        margin: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F0F0F0;
        border: 1px solid #979797;
        border-radius: 2px;
        padding: 16px;
        color: #4D4D4E;
        font-size: 13px;
        line-height: 16px;
        cursor: pointer;

        &__active {
          border-color: #1271ff;
          background: #E3F2FD;
        }
      }
    }

    .bs-tf-wrapper {
      width: 65%;
      margin: 0;

      ::v-deep .bs-tf-label {
        font-weight: 700;
        margin-bottom: 8px;
      }
    }

    .receipt-config {
      padding: 0 12px;

      ::v-deep .g-col {
        padding: 0;
      }

      ::v-deep .g-switch-label {
        font-size: 13px;
      }

      .option {
        padding: 2px 8px;
        text-align: center;
        font-size: 13px;
        font-style: italic;
        border-radius: 2px;
        border: 1px solid #E0E0E0;
        min-width: 50px;
        margin-right: 4px;

        &--selected {
          border-color: #90CAF9;
          background-color: #E3F2FD;
        }
      }
    }
  }
</style>
