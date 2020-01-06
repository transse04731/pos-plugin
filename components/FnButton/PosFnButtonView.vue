<template>
  <g-grid-layout :layout="layout" style="height: 100%">

    <div area="button-name" v-show="isButtonSelected && !isInConfigLayoutMode">
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

    <div area="button-action">
      <g-btn :uppercase="false" @click="resetSelectedButton" background-color="white" elevation="0" height="100%" text-color="red" v-show="isButtonSelected && !isInConfigLayoutMode">
        <g-icon size="16" style="margin-right: 8px">fas fa-undo</g-icon>
        Clear button
      </g-btn>
    </div>

    <div area="function" v-show="isButtonSelected && !isInConfigLayoutMode">
      <p class="title">Functions</p>
      <pos-select :items="listButtonFunctions"
                  @input="updateButtonFunction"
                  clearable
                  item-text="text"
                  item-value="value"
                  placeholder="Select"
                  v-model="selectedFunction"
      >
      </pos-select>

      <dialog-fn-button-product-lookup @selectProduct="productLookup">
        <template v-slot:activator="{open, close}">
          <pos-text-field :value="buybackProductName" @click="open" label="Buyback" read-only v-if="selectedFunction === 'buybackProduct'">
            <template v-slot:append>
              <g-icon color="#757575" size="16px">fas fa-search</g-icon>
            </template>
          </pos-text-field>
        </template>
      </dialog-fn-button-product-lookup>

    </div>

    <div area="function-action">
      <pos-text-field :value="textFieldFunctionValue" @change="updateButtonItems"
                      @input="updateButton($event, 'buttonFunctionValue')"
                      label="Value"
                      placeholder="Fill your value"
                      v-if="isButtonSelected && !isInConfigLayoutMode && showFunctionValue"></pos-text-field>
      <pos-text-field @change="updateButtonItems"
                      label="Price"
                      placeholder="Fill your value"
                      style="height: fit-content; margin-top: auto;"
                      v-if="isButtonSelected && !isInConfigLayoutMode && selectedFunction === 'buybackProduct'"
                      v-model="buybackProductPrice"></pos-text-field>
    </div>

    <div area="color" v-show="isButtonSelected && !isInConfigLayoutMode">
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
              {{item.optionTitle}}
            </g-btn>
          </g-badge>
        </template>
      </g-grid-select>
    </div>

    <g-button-merger :cols="computedLeftBtnMergerCols"
                     :items="buttonGroupItems"
                     :received-merge-map="mergeMap"
                     :received-merged-buttons="mergedButtons"
                     :rows="computedLeftBtnMergerRows"
                     :style="computedLeftBtnStyles"
                     :value="selectedButtons"
                     @input="updateButtonItems"
                     @merged="setMergedButtons"
                     area="button-chooser"
                     class="pa-2"
                     ref="merger">
      <template #default="{toggleSelect, item, index}">
        <g-btn :style="calculateButtonStyle(item)" :uppercase="false"
               @click="toggleSelect(item)"
               elevation="0" height="100%" width="100%">
          {{item.text}}
        </g-btn>
      </template>
      <template #selected="{toggleSelect, item, index}">
        <g-btn :class="activeSelectedButton"
               :style="calculateSelectedButtonStyle(item)"
               :uppercase="false"
               @click="toggleSelect(item)"
               elevation="0" height="100%" width="100%">
          {{item.text}}
        </g-btn>
      </template>
    </g-button-merger>


    <div area="function-overlay" v-show="selectedButtons.length >= 2 || isButtonSelected === false || mergeMode || splitMode">
      <div class="function-overlay-info" v-show="!isButtonSelected || mergeMode || splitMode">
        <g-icon size="62" svg>icon-info-green</g-icon>
        <p style="margin-top: 10px" v-if="!isInConfigLayoutMode && !isButtonSelected">Select a button to configure</p>
        <p style="margin-top: 10px" v-else-if="mergeMode">Select multiple buttons to merge</p>
        <p style="margin-top: 10px" v-else="splitMode">Select a button to split</p>
      </div>
    </div>

    <div area="button-control">
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
    <div area="menu">
      <g-btn :key="i" :uppercase="false" background-color="#fff" elevation="0"
             height="100%" text-color="#1d1d26" v-for="i in 8"></g-btn>
    </div>

    <div area="menu__overlay" class="menu-disabled">

    </div>
    <div area="main">
      <g-scroll-window :show-arrows="false" area="window">
        <g-scroll-window-item>
          <g-btn :uppercase="false" background-color="#9F9F9F " flat height="100%" v-for="(item, index) in 28" :key="index"></g-btn>
        </g-scroll-window-item>
      </g-scroll-window>

      <g-item-group area="delimeter" mandatory>
        <template v-slot:default="{ toggle, active }">
          <template v-for="(item, index) in 3">
            <g-item :key="index">
              <g-btn></g-btn>
            </g-item>
          </template>
        </template>
      </g-item-group>
    </div>

    <div area="main__overlay" class="menu-disabled"></div>

    <div area="keyboard__overlay"></div>

    <g-number-keyboard :items="numpadItems" area="keyboard">
      <template v-slot:screen>
        <div class="number-key-show ba-thin bg-grey-lighten-3" style="height: calc(16.6667% - 4px)">
          <input class="number-key-text col-12 self-center bg-transparent fs-large-2 fw-700 pl-2" id="number_key_output" style="border: none; outline: none">
        </div>
      </template>
    </g-number-keyboard>

    <g-button-merger :items="sideButtonItems" :received-merge-map="mergeMap" :received-merged-buttons="mergedButtons" :value="selectedButtons" @input="updateButtonItems" @merged="setMergedButtons" area="buttons" cols="1fr 1fr" ref="sideMerger" rows="1fr 1fr 1fr 1fr 1fr 1fr">
      <template #default="{toggleSelect, item, index}">
        <g-btn :style="calculateButtonStyle(item)"
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
  </g-grid-layout>
</template>

<script>
  import _ from 'lodash'
  import fnButtonLayout from './fnButtonLayout'
  import cms from 'cms'
  import PosTextField from '../pos-shared-components/POSInput/PosTextField';
  import DialogFnButtonProductLookup from './components/dialogFnButtonProductLookup';

  export default {
    name: 'PosFnButtonView',
    components: { DialogFnButtonProductLookup, PosTextField },
    data: () => ({
      layout: fnButtonLayout,
      numberOfConfigBtn: 0,
      buybackProductName: '',
      buybackProductUnit: null,
      buybackProductPrice: null,
      selectedBuybackProduct: null,
      quickFnRows: 0,
      mergeMode: false,
      splitMode: false,
      showMenu: false,
      activeClass: 'color-select-active',
      textFieldFunctionValue: '',
      textFieldValue: '',
      selectedColor: null,
      posSettings: null,
      buttonGroupItems: [],
      sideButtonItems: [],
      mergedButtons: [],
      mergeMap: null,
      selectedButtons: [],
      selectedFunction: null,
      listButtonFunctions: [
        { text: 'Discount single item (dialog)', value: 'discountSingleItemDialog', hasValue: false },
        { text: 'Discount single item by %', value: 'discountSingleItemByPercent', hasValue: true },
        { text: 'Discount single item by €', value: 'discountSingleItemByAmount', hasValue: true },
        { text: 'Product Lookup', value: 'productLookup', hasValue: false },
        { text: 'Change price', value: 'changePrice', hasValue: true },
        { text: 'Quick Cash', value: 'quickCash', hasValue: false },
        { text: 'Save order', value: 'saveOrder', hasValue: false },
        { text: 'Pay', value: 'pay', hasValue: false },
        { text: 'Buyback Product', value: 'buybackProduct', hasValue: false },
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
      numpadItems: [
        { content: ['7'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key7; border: 1px solid #979797' },
        { content: ['8'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key8; border: 1px solid #979797' },
        { content: ['9'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key9; border: 1px solid #979797' },
        { content: ['4'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key4; border: 1px solid #979797' },
        { content: ['5'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key5; border: 1px solid #979797' },
        { content: ['6'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key6; border: 1px solid #979797' },
        { content: ['1'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key1; border: 1px solid #979797' },
        { content: ['2'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key2; border: 1px solid #979797' },
        { content: ['3'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key3; border: 1px solid #979797' },
        { content: ['0'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key0; border: 1px solid #979797' },
        { content: ['00'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value, append) => (value + append), style: 'grid-area: key00; border: 1px solid #979797' },
        { content: ['x'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: (value) => value.substring(0, value.length - 1), style: 'grid-area: keyX; border: 1px solid #979797' },
        { content: ['C'], classes: 'key-number bg-white ba-blue-9 ba-thin', action: () => '0', style: 'grid-area: keyC; border: 1px solid #979797' },
        { content: ['&crarr;'], classes: 'key-number white', type: 'enter', action: () => null, style: 'grid-area: Enter; border: 1px solid #979797; background-color: #eeeeee' }
      ],
      menuSelected: null,
      activeSelectedButton: 'active-selected'
    }),
    watch: {
      selectedButtons: function (newVal) {
        if (!newVal[0]) {
          return
        }

        const selectedBtn = newVal[0]
        this.activeSelectedButton = 'active-selected'

        if (!this.isInConfigLayoutMode && newVal && newVal.length >= 2) {
          this.selectedButtons = [this.selectedButtons[this.selectedButtons.length - 1]];
        }

        if (selectedBtn) {
          this.textFieldValue = selectedBtn.text;
          this.textFieldFunctionValue = selectedBtn.buttonFunctionValue || '';
          this.selectedFunction = selectedBtn.buttonFunction || null;
          if (selectedBtn.buyback) {
            this.buybackProductUnit = selectedBtn.buyback.unit;
            this.buybackProductPrice = selectedBtn.buyback.price;
            this.buybackProductName = selectedBtn.buyback.product.name;
          }
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
      computedLeftBtnMergerRows() {
        return `repeat(${this.quickFnRows}, 1fr)`;
      },
      computedLeftBtnMergerCols() {
        return '1fr 1fr 1fr 1fr'
      },
      computedLeftBtnStyles() {
        if (this.quickFnRows === 0) {
          return { height: 0 }
        } else if (this.quickFnRows === 1) {
          return { height: '50%', marginTop: 'auto' }
        } else {
          return { height: '100%' }
        }
      },
      showFunctionValue() {
        if (!this.selectedFunction || !this.listButtonFunctions) {
          return false;
        }
        const showFunctionValue = this.listButtonFunctions.filter((item) => item.value === this.selectedFunction);
        return showFunctionValue.length > 0 ? showFunctionValue[0].hasValue : false;
      },
      isSideMerger() {
        if (!this.selectedButtons[0]) {
          return false;
        }
        const sideButtonIndex = this.sideButtonItems.findIndex((item) => this.selectedButtons[0].buttonId === item.buttonId);
        return sideButtonIndex >= 0;
      },
      isButtonSelected() {
        return this.selectedButtons.length > 0;
      },
      isInConfigLayoutMode() {
        return this.mergeMode || this.splitMode;
      },
    },
    methods: {
      calculateSelectedButtonStyle(item) {
        return {
          display: this.mergedButtons.indexOf(item.buttonId) >= 0 ? 'none' : '',
          gridRow: item.row[0] + '/' + item.row[1],
          gridColumn: item.col[0] + '/' + item.col[1],
          backgroundColor: item.style.backgroundColor,
          color: item.style.backgroundColor && item.style.backgroundColor !== '#FFFFFF' ? item.style.textColor : ''
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
      updateButtonFunction(value) {
        this.updateButton(value, 'buttonFunction');
        this.updateButtonItems();
      },
      resetSelectedButton() {
        if (this.selectedButtons[0].length < 0) {
          return;
        }
        this.selectedButtons[0] = Object.assign(this.selectedButtons[0], {
          style: {
            backgroundColor: '#FFFFFF',
            textColor: 'black'
          },
          buyback: null,
          buttonFunction: null,
          buttonFunctionValue: null,
          text: ''
        })

        this.buybackProductName = null;
        this.selectedColor = this.buttonColors.find((color) => color.value === '#FFFFFF');
        this.buybackProductUnit = null;
        this.buybackProductPrice = null;
        this.selectedFunction = null;
        this.textFieldValue = null;

        let resetButton = this.buttonGroupItems.find((item) => item.buttonId === this.selectedButtons[0].buttonId);
        if (resetButton) {
          try {
            resetButton = Object.assign(resetButton, this.selectedButtons[0]);
            this.updatePosSettings(resetButton, 'leftFunctionButtons')
          } catch (e) {
            console.log('Error updating: ', e);
          }
        }

        let resetSideButton = this.sideButtonItems.find((item) => item.buttonId === this.selectedButtons[0].buttonId);
        if (resetSideButton) {
          try {
            resetButton = Object.assign(resetSideButton, this.selectedButtons[0]);
            this.updatePosSettings(resetSideButton, 'rightFunctionButtons')
          } catch (e) {
            console.log('Error updating: ', e);
          }
        }
      },
      productLookup(product) {
        this.selectedBuybackProduct = product;
        this.buybackProductUnit = product.unit;
        this.buybackProductName = product.name;

        this.updateButton({ product, unit: product.unit, price: product.price }, 'buyback');
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
      onMerge() {
        if (this.isSideMerger) {
          try {
            this.$refs.sideMerger.mergeButtons();
          } catch (e) {
            this.activeSelectedButton = 'active-error'
            return;
          }
        } else {
          try {
            this.$refs.merger.mergeButtons();
          } catch (e) {
            this.activeSelectedButton = 'active-error'
            return;
          }
        }
        this.mergeMode = false;
        this.splitMode = false;
        this.selectedButtons = []
      },
      onSplit() {
        if (this.isSideMerger) {
          this.$refs.sideMerger.splitButtons();
        } else {
          this.$refs.merger.splitButtons();
        }
        this.mergeMode = false;
        this.splitMode = false;
        this.selectedButtons = []
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
                [`${dbButtonList}.$.buyback`]: item.buyback,
                [`${dbButtonList}.$.containedButtons`]: this.mergeMap && this.mergeMap[item.buttonId] ? this.mergeMap[item.buttonId] : []
              }
            });
        } catch (e) {
          console.log('Error updating updatePosSettings', e);
        }
      },
      updateSelectedBtnStyle() {
        this.selectedButtons[0].style.textColor = this.selectedColor.value !== '#FFFFFF' ? '#FFFFFF' : '#000000';
        this.selectedButtons[0].style.backgroundColor = this.selectedColor.value;
        if (this.selectedButtons[0].buyback) {
          this.selectedButtons[0].buyback.price = this.buybackProductPrice;
        }
      },
      updateButtonItems() {
        const selectedBtnId = this.selectedButtons[0].buttonId;
        let foundItem = this.buttonGroupItems.find((item) => item.buttonId === selectedBtnId);
        if (foundItem) {
          this.updateSelectedBtnStyle();
          try {
            foundItem = Object.assign(foundItem, this.selectedButtons[0]);
            this.updatePosSettings(foundItem, 'leftFunctionButtons')
          } catch (e) {
            console.log('Error updating: ', e);
          }
        }

        let foundSideItem = this.sideButtonItems.find((item) => item.buttonId === selectedBtnId);
        if (foundSideItem) {
          this.updateSelectedBtnStyle();
          try {
            foundSideItem = Object.assign(foundSideItem, this.selectedButtons[0]);
            this.updatePosSettings(foundSideItem, 'rightFunctionButtons')
          } catch (e) {
            console.log('Error updating: ', e);
          }
        }
      },
      setMergedButtons(mergedButtons, mergeMap) {
        this.mergedButtons = mergedButtons;
        this.mergeMap = mergeMap
      },
      validateSplit() {
        return this.selectedButtons[0]
          ? ((!this.$refs.merger.mergeMap.hasOwnProperty(this.selectedButtons[0].buttonId)
            && !this.$refs.sideMerger.mergeMap.hasOwnProperty(this.selectedButtons[0].buttonId))
            || this.selectedButtons.length !== 1)
          : true;
      },
      updateButton(newVal, updatedField) {
        if (this.selectedButtons[0]) {
          this.selectedButtons[0][updatedField] = newVal;

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

        return this.buttonGroupItems.find((x) => x.buttonId === button.buttonId) || this.sideButtonItems.find((x) => x.buttonId === button.buttonId);
      },
      mapFetchedButtons(buttonList, dataList) {
        for (let item of buttonList) {
          const {
            backgroundColor, buttonFunction, buttonFunctionValue, originalRows, originalCols,
            text, textColor, containedButtons, _id, rows, cols, buyback
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
            buyback
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
          this.quickFnRows = this.posSettings['generalSetting']['quickFnRows'] || 0;
          this.numberOfConfigBtn = 4 * this.quickFnRows;

          this.buttonGroupItems = [];
          this.sideButtonItems = [];

          this.mapFetchedButtons(_.slice(this.posSettings['leftFunctionButtons'], 0, this.numberOfConfigBtn), this.buttonGroupItems);
          this.mapFetchedButtons(this.posSettings['rightFunctionButtons'], this.sideButtonItems);
        }
      }
    },
    mounted() {
      this.refreshData();
    },
    activated() {
      this.refreshData();
    }
  }
</script>

<style lang="scss" scoped>
  .active-selected {
    border: 2px solid #1271FF !important;
  }

  .active-error {
    border: 2px solid darkred !important;
  }

  .menu__overlay, .main__overlay, .keyboard__overlay {
    background-color: rgba(255, 255, 255, 0.54);
    z-index: 99;
  }

  .function-overlay {
    .function-overlay-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 100;
    }

    background-color: rgba(255, 255, 255, 0.54);
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-control {
    background-color: #EEEEEE;
    padding: 12px;
    position: relative;
    bottom: 0;
    display: flex;

    .g-btn {
      min-width: 0 !important;
    }
  }

  .button-name {
    padding: 12px;

    ::v-deep .bs-tf-wrapper {
      margin: 0;
    }
  }

  .main {
    ::v-deep .g-window {
      box-shadow: none;
    }
  }

  .button-name {
    ::v-deep .bs-tf-wrapper .bs-tf-input-group .bs-tf-inner-input-group {
      width: 100%;
    }
  }

  .button-action {
    width: 100%;
    padding: 12px;
    display: flex;
    justify-content: center;
    margin-top: 26px;
  }

  .title {
    font-size: 13px;
    line-height: 16px;
  }

  .button-chooser {
    ::v-deep .g-row .g-col {
      padding: 2.5px !important;
    }

    .g-btn {
      min-width: 0 !important;
    }

  }

  .color {
    padding: 8px 8px 8px 13px;

    ::v-deep .g-row {
      margin-top: 20px;
    }
  }

  .function {
    padding: 13px 12px 8px 13px;

    .g-select {
      ::v-deep .g-tf-wrapper {
        fieldset {
          .g-tf {
            .inputGroup .input .g-tf-input {
              font-size: 15px;
            }
          }
        }
      }
    }
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

  .function-action {
    padding: 8px;
    display: flex;

    .bs-tf-wrapper {
      width: 100%;
      padding-right: 23px;
      margin: 0;
    }
  }

  .color-select-active {
    border: 2px solid #1271FF;
  }

  .button-group-item {
    border: 1px solid #979797;
    height: 80% !important;
    box-shadow: none;
    margin: 5px;
  }


  .menu {
    background-color: #90CAF9;
    overflow-x: auto;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-auto-columns: 31.25%;
    grid-gap: 6px;
    grid-auto-flow: column;
    padding: 6px;

    &::-webkit-scrollbar {
      display: none;
    }

    &__active {
      background-color: #2979FF !important;
      color: white !important;
    }

    &:after {
      content: '';
      width: 1px;
      height: 100%;
    }
  }

  .function {
    ::v-deep .g-select .g-tf-wrapper {
      margin: 8px 0 24px 0;
    }

    ::v-deep .bs-tf-wrapper {
      margin: 0;
    }
  }

  .g-btn {
    &.g-btn__outlined {
      border: 1px solid #979797;
      background-color: #fafafa;
    }

    &.g-btn__disabled {
      background-color: #DFDFDF;
    }

    &.g-btn__text {
      border: 0;
    }
  }

  .main {
    padding: 6px 6px 0 6px;
    overflow: hidden;

    ::v-deep .g-window {
      width: 100%;

      .g-window__container {
        height: 100%;
      }

      .g-window-item,
      .g-scroll-window-item {
        height: 100%;
        display: grid;
        grid-template-rows: repeat(7, 1fr);
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 6px;
        margin-right: 6px;
      }
    }

    .g-item-group {
      align-items: center;
      justify-content: center;

      .g-btn {
        width: 8px !important;
        height: 8px !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 6px;
        box-shadow: none;
        background-color: #E0E0E0 !important;
      }

      .g-item__active .g-btn {
        background-color: #2196F3 !important;
      }
    }
  }

  .keyboard {
    padding: 8px 0 8px 8px;
  }

  .buttons {
    padding: 8px 8px 8px 0;
  }
</style>
