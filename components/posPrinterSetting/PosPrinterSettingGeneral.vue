<template>
  <div class="setting">
    <div class="checkbox-group">
      <g-checkbox color="#1271FF" label="Use Multiple Printer For Kitchen Printer" v-model="useMultiPrinterForKitchenPrinter" @change="changeSetting"/>
      <g-checkbox color="#1271FF" label="Use Multiple Printer For Invoice Printer" v-model="useMultiPrinterForInvoicePrinter" @change="changeSetting"/>
      <g-checkbox color="#1271FF" label="Use Multiple Printer For Receipt Printer" v-model="useMultiPrinterForReceiptPrinter" @change="changeSetting"/>
    </div>
    <div class="switch-group">
      <g-switch label="1 Receipt for 1 Article" v-model="oneReceiptForOneArticle" @change="changeSetting"/>
      <g-switch label="Group Articles" v-model="groupArticles" @change="changeSetting"/>
      <g-switch label="Sound" v-model="sound" @change="changeSetting"/>
      <g-switch label="ESC POS" v-model="escPOS" @change="changeSetting"/>
    </div>
    <div class="setting-title">Receipt Font Size</div>
    <g-grid-select mandatory item-cols="auto" :items="listFontSize" v-model="fontSize" @input="changeSetting">
      <template v-slot:default="{ toggleSelect, item }">
        <div class="setting-option" @click="toggleSelect(item)">
          {{item}}
        </div>
      </template>
      <template v-slot:selected="{ toggleSelect, item }">
        <div class="setting-option setting-option--selected">
          {{item}}
        </div>
      </template>
    </g-grid-select>
    <div class="setting-title">Receipt Top Margin</div>
    <g-grid-select mandatory item-cols="auto" :items="listMarginSize" v-model="marginTop" @input="changeSetting">
      <template v-slot:default="{ toggleSelect, item }">
        <div class="setting-option" @click="toggleSelect(item)">
          {{item}}
        </div>
      </template>
      <template v-slot:selected="{ toggleSelect, item }">
        <div class="setting-option setting-option--selected">
          {{item}}
        </div>
      </template>
    </g-grid-select>
    <div class="setting-title">Number of Entire Receipt</div>
    <g-grid-select mandatory item-cols="auto" :items="listNoEntireReceipt" v-model="entireReceipt" @input="_updateNoEntireReceipt">
      <template v-slot:default="{ toggleSelect, item }">
        <div class="setting-option" @click="toggleSelect(item)">
          {{item}}
        </div>
      </template>
      <template v-slot:selected="{ toggleSelect, item }">
        <div class="setting-option setting-option--selected">
          {{item}}
        </div>
      </template>
    </g-grid-select>
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
        listFontSize: ['Mini', '1', '2', '3', 4],
        listMarginSize: ['+ 0 Cm', '+ 1 Cm', '+ 2 Cm', '+ 3 Cm', '+ 4 Cm'],
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
      useMultiPrinterForReceiptPrinter: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.useMultiPrinterForReceiptPrinter
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'useMultiPrinterForReceiptPrinter', val)
        }
      },
      oneReceiptForOneArticle: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.oneReceiptForOneArticle
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'oneReceiptForOneArticle', val)
        }
      },
      groupArticles: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.groupArticles
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'groupArticles', val)
        }
      },
      sound: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.sound
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'sound', val)
        }
      },
      escPOS: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.escPOS
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'escPOS', val)
        }
      },
      fontSize: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.fontSize
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'fontSize', val)
        }
      },
      marginTop: {
        get() {
          if(this.printerGeneralSetting) {
            return this.printerGeneralSetting.marginTop
          }
        },
        set(val) {
          this.$set(this.printerGeneralSetting, 'marginTop', val)
        }
      },
    },
    methods: {
      async changeSetting() {
        await this.updatePrinterGeneralSetting()
      },
      async _updateNoEntireReceipt() {
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
    created() {
      this.getPrinterGeneralSetting()
      this.entireReceipt = this.printerGeneralSetting.entireReceipt
    }
  }
</script>

<style scoped lang="scss">
  .setting {
    padding: 24px 32px;

    .switch-group {
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-template-columns: auto 1fr;
      grid-column-gap: 36px;

      .g-switch-wrapper ::v-deep .g-switch-label {
        font-size: 13px;
      }
    }

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
