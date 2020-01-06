<template>
  <g-grid-layout :layout="layout" style="height: 100%">
    <div area="payment-button-name">
      <pos-text-field :value="textFieldValue"
                      @change="updateButtonItems"
                      @input="updateButton($event, 'text')"
                      label="Button Name"
                      placeholder="Fill your text">
        <template v-slot:append>
          <g-icon color="#757575">mdi-keyboard</g-icon>
        </template>
      </pos-text-field>
    </div>

    <div area="button-name-clear">
      <g-btn :uppercase="false" @click="resetSelectedButton" background-color="white" elevation="0" height="100%" text-color="red">
        <g-icon size="16" style="margin-right: 8px">fas fa-undo</g-icon>
        Clear button
      </g-btn>
    </div>

    <div area="button-fn">
      <p class="title">Function</p>
      <pos-select :items="listButtonFunctions"
                  @input="updateButtonFunction"
                  clearable
                  item-text="text"
                  item-value="value"
                  placeholder="Select"
                  v-model="selectedFunction"
      >
      </pos-select>
    </div>

    <div area="button-fn-value">
      <pos-text-field
          :value="textFieldFunctionValue" @change="updateButtonItems"
          @input="updateButton($event, 'buttonFunctionValue')"
          label="Value"
          placeholder="Fill your value"
          v-if="isButtonSelected && !isInConfigLayoutMode && showFunctionValue"
      ></pos-text-field>
    </div>

    <div area="color">
      <p class="title">Color</p>
      <g-grid-select :grid="false" :items="buttonColors" return-object v-model="selectedColor">
        <template #default="{toggleSelect, item, index}">
          <g-btn :key="index" :ripple="false"
                 :style="calculateColorStyle(item)"
                 :uppercase="false"
                 @click="toggleSelect(item); updateButtonItems();"></g-btn>
        </template>
        <template #selected="{toggleSelect, item, index}">
          <g-badge :badge-size="12" overlay style="margin-right: 14px;">
            <template v-slot:badge>
              <g-icon>done</g-icon>
            </template>
            <g-btn :ripple="false"
                   :style="calculateSelectedColorStyle(item)"
                   :uppercase="false">
            </g-btn>
          </g-badge>
        </template>
      </g-grid-select>
    </div>

    <div area="left-layout-overlay" v-show="selectedButtons.length >= 2 || isButtonSelected === false || mergeMode || splitMode">
      <div class="left-layout-overlay-info" v-show="!isButtonSelected || mergeMode || splitMode">
        <g-icon size="62" svg>icon-info-green</g-icon>
        <p class="overlay-instruction-line" v-if="!isInConfigLayoutMode && !isButtonSelected">Select a button to configure</p>
        <p class="overlay-instruction-line" v-else-if="mergeMode">Select multiple buttons to merge</p>
        <p class="overlay-instruction-line" v-else="splitMode">Select a button to split</p>
      </div>
    </div>

    <div area="payment-details">
      <div class="payment-details-textfield-container">
        <div class="balance-due-textfield">
          <div class="title-holder">
            <p>Balance Due</p>
            <p style="margin-left: auto">Amount Tendered</p>
          </div>
          <div class="payment-detail-textfield"></div>
        </div>
        <div class="change-textfield">
          <div class="title-holder">
            <p>Change</p>
          </div>
          <div class="payment-detail-textfield"></div>
        </div>
      </div>

      <div style="height: 15%">
        <g-btn :uppercase="false" background-color="#2979FF" border-radius="4px"
               flat height="100%" style="pointer-events: none; margin-right: 16px" text-color="#fff" width="130px">
          <g-icon class="mr-2" svg>icon-cash</g-icon>
          Cash
        </g-btn>

        <g-btn :uppercase="false" border-radius="4px" flat
               height="100%" style="border: 1px solid #1271FF; pointer-events: none;" width="130px">
          <g-icon class="mr-2" svg>icon-credit_card</g-icon>
          Card
        </g-btn>
      </div>
    </div>

    <g-button-merger :items="buttonItems" :received-merge-map="mergeMap" :received-merged-buttons="mergedButtons" :value="selectedButtons" @input="updateButtonItems" @merged="setMergedButtons" area="button-merger" cols="1fr 1fr 1fr 1fr 1fr" ref="paymentMerger" rows="1fr 1fr 1fr 1fr 1fr" style="height: 100%; padding: 4px;">
      <template #default="{toggleSelect, item, index}">
        <g-btn :disabled="item.disabled"
               :style="calculateButtonStyle(item)"
               :uppercase="false"
               @click="toggleSelect(item)"
               elevation="0" height="100%" width="100%">
          {{item.text}}
        </g-btn>
      </template>
      <template #selected="{toggleSelect, item, index}">
        <g-btn :class="activeSelectedButton"
               :style="calculateSelectedButtonStyle(item)"
               :uppercase="false" @click="toggleSelect(item)"
               elevation="0" height="100%" width="100%">
          {{item.text}}
        </g-btn>
      </template>
    </g-button-merger>

    <div area="toolbar">
      <g-btn :uppercase="false" @click="$router.push({ path: '/view/pos-settings' })" background-color="white" class="mr-2">
        <g-icon class="mr-2" svg>icon-back</g-icon>
        <span style="color: rgba(0, 0, 0, 0.87)">Back</span>
      </g-btn>

      <g-menu nudge-top="5" top v-model="showMenu">
        <template v-slot:activator="{toggleContent}">
          <g-btn :uppercase="false" @click="toggleContent" background-color="white" class="mr-2" v-if="!isInConfigLayoutMode">
            <g-icon class="mr-2" svg>icon-menu</g-icon>
            <span style="color: rgba(0, 0, 0, 0.87)">More</span>
          </g-btn>

          <g-btn :uppercase="false" @click="toggleMode('cancel')" background-color="white" class="mr-2" v-if="isInConfigLayoutMode">
            <g-icon class="mr-2" color="red">mdi-close-circle</g-icon>
            <span style="color: rgba(0, 0, 0, 0.87)">Cancel</span>
          </g-btn>
        </template>
        <div style="display: flex; flex-direction: column;">
          <g-btn :uppercase="false" @click="toggleMode('merge')">
            <g-icon style="margin-right: 5px;" svg>icon-merge</g-icon>
            Merge Mode
          </g-btn>
          <g-btn :uppercase="false" @click="toggleMode('split')">
            <g-icon style="margin-right: 5px" svg>icon-split</g-icon>
            Split Mode
          </g-btn>
        </div>
      </g-menu>
      <g-spacer/>
      <g-btn :disabled="selectedButtons.length <= 1" :uppercase="false" @click="onMerge" background-color="#1976D2" text-color="white" v-if="mergeMode">
        <g-icon style="margin-right: 5px;" svg>icon-merge</g-icon>
        Merge
      </g-btn>
      <g-btn :disabled="validateSplit()" :uppercase="false" @click="onSplit" background-color="#1976D2" text-color="white" v-if="splitMode">
        <g-icon style="margin-right: 5px" svg>icon-split</g-icon>
        Split
      </g-btn>

    </div>
  </g-grid-layout>
</template>

<script>
  import GButtonMerger from './components/GButtonMerger';
  import paymentLayout from './paymentLayout'
  import PosTextField from '../pos-shared-components/POSInput/PosTextField';
  import PosSelect from '../pos-shared-components/POSInput/PosSelect';

  export default {
    name: 'PosPaymentLayoutConfig',
    components: { PosSelect, PosTextField, GButtonMerger },
    data: () => ({
      mergeMap: null,
      layout: paymentLayout,
      mergedButtons: [],
      activeSelectedButton: 'active-selected',
      showMenu: false,
      mergeMode: false,
      splitMode: false,
      selectedButtons: [],
      buttonItems: [
        {
          col: [1, 2],
          row: [1, 2],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '7',
          disabled: true,
        },
        {
          col: [2, 3],
          row: [1, 2],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '8',
          disabled: true
        },
        {
          col: [3, 4],
          row: [1, 2],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '9',
          disabled: true
        },
        {
          col: [1, 2],
          row: [2, 3],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '4',
          disabled: true
        },
        {
          col: [2, 3],
          row: [2, 3],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '5',
          disabled: true
        },
        {
          col: [3, 4],
          row: [2, 3],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '6',
          disabled: true
        },
        {
          col: [1, 2],
          row: [3, 4],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '1',
          disabled: true
        },
        {
          col: [2, 3],
          row: [3, 4],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '2',
          disabled: true
        },
        {
          col: [3, 4],
          row: [3, 4],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '3',
          disabled: true
        },
        {
          col: [1, 2],
          row: [4, 5],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '0',
          disabled: true
        },
        {
          col: [2, 3],
          row: [4, 5],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: '.',
          disabled: true
        },
        {
          col: [3, 4],
          row: [4, 5],
          style: {
            backgroundColor: null,
            textColor: null
          },
          text: 'Back',
          disabled: true
        },
      ],
      listButtonFunctions: [
        { text: 'Banknote', value: 'banknote', hasValue: true },
        { text: 'Pay', value: 'pay', hasValue: false },
        { text: 'Discount', value: 'discount', hasValue: false },
        { text: 'Cashdrawer', value: 'cashDrawer', hasValue: false },
      ],
      buttonColors: [
        {
          text: '#FFFFFF',
          value: '#FFFFFF'
        },
        {
          text: '#FFA726',
          value: '#FFA726'
        },
        {
          text: '#FF87E9',
          value: '#FF87E9'
        },
        {
          text: '#73F8F8',
          value: '#73F8F8'
        },
        {
          text: '#66BB6A',
          value: '#66BB6A'
        },
        {
          text: '#1976D2',
          value: '#1976D2'
        },
        {
          text: '#7575FF',
          value: '#7575FF'
        },
        {
          text: '#F6787C',
          value: '#F6787C'
        },
      ],
      selectedFunction: null,
      selectedColor: null,
      textFieldValue: '',
      textFieldFunctionValue: ''
    }),
    watch: {
      selectedButtons(newVal) {
        if (!newVal[0]) {
          return
        }

        const selectedBtn = newVal[0]
        this.activeSelectedButton = 'active-selected'

        if (!this.isInConfigLayoutMode && newVal && newVal.length >= 2) {
          this.selectedButtons = [this.selectedButtons[this.selectedButtons.length - 1]];
        }

        if (selectedBtn) {
          this.textFieldValue = selectedBtn.text || '';
          this.textFieldFunctionValue = selectedBtn.buttonFunctionValue || '';
          this.selectedFunction = selectedBtn.buttonFunction || null;
        }
        if (newVal.length > 0 && selectedBtn.style && selectedBtn.style.backgroundColor) {
          this.selectedColor = this.buttonColors.find((x) => x.value === selectedBtn.style.backgroundColor);
        }

        if (newVal.length === 0 || (selectedBtn && !selectedBtn.style.backgroundColor)) {
          this.selectedColor = null;
        }
      },
    },
    computed: {
      isButtonSelected() {
        return this.selectedButtons.length > 0;
      },
      isInConfigLayoutMode() {
        return this.mergeMode || this.splitMode;
      },
      showFunctionValue() {
        if (!this.selectedFunction || !this.listButtonFunctions) {
          return false;
        }
        const showFunctionValue = this.listButtonFunctions.filter((item) => item.value === this.selectedFunction);
        return showFunctionValue.length > 0 ? showFunctionValue[0].hasValue : false;
      },
    },
    methods: {
      resetSelectedButton() {
        if (this.selectedButtons.length !== 1) {
          return;
        }

        this.selectedColor = this.buttonColors.find((color) => color.value === '#FFFFFF');
        this.selectedFunction = null;
        this.textFieldValue = null;

        let resetButton = this.findSelectedButton(this.selectedButtons[0]);
        if (resetButton) {
          try {
            resetButton = Object.assign(resetButton, {
              style: {
                backgroundColor: '#FFFFFF',
                textColor: '#000000'
              },
              buttonFunction: null,
              buttonFunctionValue: null,
              text: ''
            });
            this.updatePosSettings(resetButton, 'paymentFunctionButtons')
          } catch (e) {
            console.log('Error updating: ', e);
          }
        }
      },
      updateButtonFunction(value) {
        this.updateButton(value, 'buttonFunction');
        this.updateButtonItems();
      },
      toggleMode(mode) {
        switch (mode) {
          case 'merge':
            this.mergeMode = !this.mergeMode;
            this.selectedButtons = []
            this.splitMode = false;
            this.showMenu = false;
            break;
          case 'split':
            this.splitMode = !this.splitMode;
            this.selectedButtons = []
            this.mergeMode = false;
            this.showMenu = false;
            break;
          case 'cancel':
            this.splitMode = false;
            this.selectedButtons = []
            this.mergeMode = false;
            this.showMenu = false;
            break;
          default:
            throw new Error('Invalid mode')
        }
      },
      calculateSelectedColorStyle(item) {
        return {
          boxShadow: 'none',
          borderRadius: '50%',
          width: '38px',
          minWidth: '38px',
          height: '38px',
          border: '2px solid #1271FF',
          backgroundColor: item.value
        }
      },
      calculateColorStyle(item) {
        return {
          marginRight: '14px',
          boxShadow: 'none',
          borderRadius: '50%',
          width: '38px',
          minWidth: '38px',
          height: '38px',
          border: '1px solid #D2D2D2',
          backgroundColor: item.value
        }
      },
      calculateSelectedButtonStyle(item) {
        return {
          display: this.mergedButtons.indexOf(item.buttonId) >= 0 ? 'none' : '',
          gridRow: item.row[0] + '/' + item.row[1],
          gridColumn: item.col[0] + '/' + item.col[1],
          backgroundColor: item.style.backgroundColor,
          color: item.style.backgroundColor && item.style.backgroundColor !== '#FFFFFF' ? item.style.textColor : '',
        }
      },
      calculateButtonStyle(item) {
        return {
          display: this.mergedButtons.indexOf(item.buttonId) >= 0 ? 'none' : '',
          gridRow: item.row[0] + '/' + item.row[1],
          gridColumn: item.col[0] + '/' + item.col[1],
          backgroundColor: item.style.backgroundColor,
          color: item.style.backgroundColor && item.style.backgroundColor !== '#FFFFFF' ? item.style.textColor : '',
          border: '1px solid #979797'
        }
      },
      validateSplit() {
        return this.selectedButtons[0]
          ? ((!this.mergeMap.hasOwnProperty(this.selectedButtons[0].buttonId))
            || this.selectedButtons.length !== 1)
          : true;
      },
      onMerge() {
        try {
          this.$refs.paymentMerger.mergeButtons();
        } catch (e) {
          this.activeSelectedButton = 'active-error'
          return;
        }
        this.mergeMode = false;
        this.splitMode = false;
        this.selectedButtons = []
      },
      onSplit() {
        this.$refs.paymentMerger.splitButtons();
        this.mergeMode = false;
        this.splitMode = false;
        this.selectedButtons = []
      },
      setMergedButtons(mergedButtons, mergeMap) {
        this.mergedButtons = mergedButtons;
        this.mergeMap = mergeMap
      },
      updateButton(newVal, updatedField) {
        if (this.selectedButtons[0]) {
          const item = this.findSelectedButton(this.selectedButtons[0]);
          if (item) {
            item[updatedField] = newVal;
          }
        }
      },
      findSelectedButton(button) {
        if (!button) {
          return null;
        }

        return this.buttonItems.find((x) => x.buttonId === button.buttonId);
      },
      async updatePosSettings(item, dbButtonList) {
        try {
          await cms.getModel('PosSetting').findOneAndUpdate({ [`${dbButtonList}._id`]: item.buttonId }, {
            '$set': {
              [`${dbButtonList}.$.backgroundColor`]: item.style.backgroundColor,
              [`${dbButtonList}.$.text`]: item.text,
              [`${dbButtonList}.$.rows`]: item.row,
              [`${dbButtonList}.$.cols`]: item.col,
              [`${dbButtonList}.$.textColor`]: item.style.backgroundColor !== '#FFFFFF' ? '#FFFFFF' : '#000000',
              [`${dbButtonList}.$.buttonFunction`]: item.buttonFunction,
              [`${dbButtonList}.$.buttonFunctionValue`]: item.buttonFunctionValue,
              [`${dbButtonList}.$.containedButtons`]: this.mergeMap && this.mergeMap[item.buttonId] ? this.mergeMap[item.buttonId] : []
            }
          });
        } catch (e) {
          console.log('Error updating updatePosSettings', e);
        }
      },
      updateButtonItems() {
        if (!this.selectedButtons[0]) {
          return
        }

        let foundItem = this.findSelectedButton(this.selectedButtons[0]);
        if (foundItem) {
          foundItem.style.backgroundColor = this.selectedColor ? this.selectedColor.value : null;
          foundItem.style.textColor = this.selectedColor && this.selectedColor.value !== '#FFFFFF' ? '#FFFFFF' : '#000000';
          try {
            this.updatePosSettings(foundItem, 'paymentFunctionButtons')
          } catch (e) {
            console.log('Error updating: ', e);
          }
        }
      },
      mapFetchedButtons(buttonList, dataList) {
        for (let item of buttonList) {
          const {
            backgroundColor, buttonFunction, buttonFunctionValue, originalRows, originalCols,
            text, textColor, containedButtons, _id, rows, cols
          } = item;

          dataList.push({
            row: rows,
            col: cols,
            originalRow: originalRows,
            originalCol: originalCols,
            text,
            style: { backgroundColor: backgroundColor, textColor: textColor },
            buttonFunction,
            buttonFunctionValue,
            buttonId: _id,
          })

          this.mergedButtons = this.mergedButtons.concat(containedButtons);
          if (containedButtons.length > 0) {
            if (this.mergeMap) {
              this.mergeMap = Object.assign(this.mergeMap, { [_id]: containedButtons });
            } else {
              this.mergeMap = Object.assign({}, { [_id]: containedButtons });
            }
          }
        }
      },
      refreshData() {
        this.posSettings = cms.getList('PosSetting')[0];
        if (this.posSettings) {
          this.mapFetchedButtons(this.posSettings['paymentFunctionButtons'], this.buttonItems);
        }
      }
    },
    mounted() {
      this.selectedColor = this.buttonColors[0]
      this.refreshData();
    }
  }
</script>

<style lang="scss" scoped>
  .payment-details-textfield-container {
    width: 100%;
    display: flex;
    height: 30%;
  }

  .overlay-instruction-line {
    margin-top: 10px;
  }

  .balance-due-textfield {
    margin-right: 8px;
    flex: 2;
  }

  .title-holder {
    display: flex;
    font-style: normal;
    font-weight: bold;
    font-size: 13px;
    line-height: 16px;
    margin-bottom: 9px;
    color: #1D1D26;
  }

  .payment-detail-textfield {
    height: 53%;
    border: 1px solid #c9c9c9;
    background-color: #F0F0F0;
    border-radius: 4px;
  }

  .change-textfield {
    flex: 1;
  }

  ::v-deep .g-badge {
    background-color: #1271FF !important;
    width: 12px;
    min-width: 12px;
    left: 20px;
    top: 5px;

    .g-icon {
      font-size: 10px !important;
      font-weight: bold;
    }
  }

  .left-layout-overlay {
    .left-layout-overlay-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 100;
    }

    background-color: #ffffff;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .payment-details {
    padding: 9px;
  }

  .title {
    font-size: 13px;
    line-height: 16px;
  }

  .payment-button-name {
    padding: 12px;

    ::v-deep .bs-tf-wrapper {
      margin: 0;
    }
  }

  .button-merger {
    ::v-deep .grid-item-selector {
      .g-btn {
        font-size: 16px;
      }
    }
  }

  .active-selected {
    border: 2px solid #1271FF !important
  }

  .active-error {
    border: 2px solid darkred !important;
  }

  .button-fn {
    padding: 13px 12px 8px 13px;
  }

  .button-fn {
    ::v-deep .g-select .g-tf-wrapper {
      margin: 8px 0 24px 0;
    }

    ::v-deep .bs-tf-wrapper {
      margin: 0;
    }
  }

  .color {
    padding: 8px 8px 8px 13px;

    ::v-deep .g-row {
      margin-top: 20px;
    }
  }

  .color-select-active {
    border: 2px solid #1271FF;
  }

  .toolbar {
    background-color: #EEEEEE;
    padding: 12px;
    position: relative;
    bottom: 0;
    display: flex;

    .g-btn {
      min-width: 0 !important;
    }
  }

  .button-fn-value {
    padding: 8px;
    display: flex;

    .bs-tf-wrapper {
      width: 100%;
      padding-right: 23px;
      margin: 0;
    }
  }

  ::v-deep .right-layout {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.252295);
  }

  .button-name-clear {
    width: 100%;
    padding: 12px;
    display: flex;
    justify-content: center;
    margin-top: 26px;
  }
</style>
