<template>
  <div class="setting">
    <div class="checkbox-group">
      <g-checkbox color="#1271FF" label="Use Multiple Printer For Kitchen Printer" v-model="useMultiPrinterForKitchenPrinter" @change="changeSetting"/>
      <g-checkbox color="#1271FF" label="Use Multiple Printer For Invoice Printer" v-model="useMultiPrinterForInvoicePrinter" @change="changeSetting"/>
      <g-checkbox color="#1271FF" label="Use Multiple Printer For Entire Printer" v-model="useMultiPrinterForEntirePrinter" @change="changeSetting"/>
    </div>
    <div class="setting-title">Number of Entire Receipt</div>
    <div class="row-flex flex-wrap">
      <div v-for="(number, i) in listNoEntireReceipt" :key="i"
           :class="['setting-option', number === entireReceipt && 'setting-option--selected']" @click="_updateNoEntireReceipt(number)">
        {{number}}
      </div>
    </div>
    <dialog-confirm-delete v-model="dialog.value" :type="dialog.label" @submit="_removeEntireReceipt"/>
  </div>
</template>

<script>
  export default {
    name: "PosPrinterSettingGeneral",
    props: {

    },
    injectService: ['SettingsStore:(getPrinterGeneralSetting, printerGeneralSetting, updatePrinterGeneralSetting, addEntirePrinter, removeEntirePrinter)'],
    data() {
      return {
        listNoEntireReceipt: [0, 1, 2, 3, 4],
        dialog: {
          value: false,
          label: '',
          upper: 0,
          lower: 0,
        },
        entireReceipt: null
      }
    },
    computed: {
      useMultiPrinterForKitchenPrinter: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.useMultiPrinterForKitchenPrinter
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'useMultiPrinterForKitchenPrinter', val)
        }
      },
      useMultiPrinterForInvoicePrinter: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.useMultiPrinterForInvoicePrinter
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'useMultiPrinterForInvoicePrinter', val)
        }
      },
      useMultiPrinterForEntirePrinter: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.useMultiPrinterForEntirePrinter
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'useMultiPrinterForEntirePrinter', val)
        }
      },
    },
    methods: {
      async changeSetting() {
        await this.updatePrinterGeneralSetting()
      },
      async _updateNoEntireReceipt(number) {
        this.entireReceipt = number
        if(!this.printerGeneralSetting.entireReceipt) {
          await this.addEntirePrinter(0, this.entireReceipt)
          this.$set(this.printerGeneralSetting, 'entireReceipt', this.entireReceipt)
          await this.updatePrinterGeneralSetting()
        }
        if(this.entireReceipt > this.printerGeneralSetting.entireReceipt) {
          await this.addEntirePrinter(this.printerGeneralSetting.entireReceipt, this.entireReceipt)
          this.$set(this.printerGeneralSetting, 'entireReceipt', this.entireReceipt)
          await this.updatePrinterGeneralSetting()
        }
        if(this.entireReceipt < this.printerGeneralSetting.entireReceipt) {
          this.dialog.upper = this.printerGeneralSetting.entireReceipt
          this.dialog.lower = this.entireReceipt
          this.dialog.label = ' number of entire receipt from ' + this.dialog.upper + ' to ' + this.dialog.lower
          this.dialog.value = true
          this.entireReceipt = this.printerGeneralSetting.entireReceipt
        }
      },
      async _removeEntireReceipt() {
        this.entireReceipt = this.dialog.lower
        await this.removeEntirePrinter(this.dialog.lower, this.dialog.upper)
        this.$set(this.printerGeneralSetting, 'entireReceipt', this.entireReceipt)
        await this.updatePrinterGeneralSetting()
      }
    },
    async created() {
      await this.getPrinterGeneralSetting()
      this.entireReceipt = this.printerGeneralSetting.entireReceipt
    }
  }
</script>

<style scoped lang="scss">
  .setting {
    padding: 24px 32px;

    &-title {
      color: #1d1d26;
      font-weight: 700;
      margin: 24px 0 12px 4px;
    }

    ::v-deep .g-col {
      padding: 0;
    }

    &-option {
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
</style>
