<template>
  <div>
    <g-dialog v-model="dialogNewProduct" fullscreen scrollable eager>
      <div class="dialog-product w-100">
        <div class="form">
          <div class="title">
            Create New Product
          </div>
          <div class="input">
            <pos-text-field :key="'pName'+key" label="Name" placeholder="Fill your number" @click="openDialogDetail('name')" v-model="productName" required/>
            <pos-select :key="'taxCate'+key" label="Tax Category" :items="taxes" item-text="text" item-value="value" v-model="taxCategory" append-icon="mdi-chevron-down" required/>
            <pos-text-field label="Product ID" placeholder="Auto generate" disabled @click="openDialogDetail('id')" v-model="productID"/>
            <pos-select :key="'pCate'+key" label="Product Category" :items="categories" item-text="name" item-value="value" return-object v-model="productCategory" append-icon="mdi-chevron-down" required/>
            <pos-select label="Unit" :items="units" v-model="unit" append-icon="mdi-chevron-down"/>
            <div></div>
            <div class="row-flex">
              <div class="col-6">
                <pos-text-field :key="'pPrice'+key" label="Price" placeholder="Fill your number" @click="openDialogDetail('price')" v-model="productPrice" required>
                  <template v-slot:append>
                    <span style="color: #1471ff">€</span>
                  </template>
                </pos-text-field>
              </div>
              <div class="col-6">
                <pos-text-field label="Barcode/PLU" placeholder="Fill your number" @click="openDialogDetail('barcode')" v-model="productBarcode">
                  <template v-slot:append>
                    <g-icon svg>icon-scanning_barcode</g-icon>
                  </template>
                </pos-text-field>
              </div>
            </div>
            <div></div>
            <div></div>
            <div class="row-flex">
              <div class="col-6">
                <pos-switch dense label="Favorite" v-model="favorite"/>
              </div>
              <div class="col-6">
                <pos-switch dense label="Non-Refundable" v-model="nonRefundable"/>
              </div>
            </div>
            <div class="row-flex justify-between">
              <pos-switch dense label="Active" v-model="active"/>
              <pos-switch dense label='Show on "Order Screen"' v-model="showOnOrderScreen"/>
            </div>
            <pos-switch dense label="Manual Price" v-model="manualPrice"/>
          </div>
          <div class="accordion">
            <g-expansion accordion v-model="expansionItem" :items="expansions" item-header="name">
            </g-expansion>
          </div>
        </div>
        <g-toolbar absolute bottom color="grey lighten 3">
          <g-spacer/>
          <g-btn :uppercase="false" outlined class="mr-2" width="120" @click="dialogNewProduct = false">Cancel</g-btn>
          <g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" width="120" :disabled="!valid" @click="submit">Submit</g-btn>
        </g-toolbar>
      </div>
    </g-dialog>
    <g-dialog v-model="dialogNewProductDetail" overlay-color="#6b6f82" overlay-opacity="0.95" width="90%" eager>
      <div class="dialog-product w-100">
        <div class="form__detail">
          <div class="input__detail">
            <div>
              <pos-text-field :key="'name'+key" ref="name" label="Name" required placeholder="Fill your number" :rules="[rules.required]" v-model="name" @click="keyboardFocus = 'name'"/>
            </div>
            <div>
              <pos-text-field ref="productID" label="Product ID" placeholder="Auto generate" v-model="productID" @click="keyboardFocus = 'id'"/>
            </div>
            <div>
              <pos-text-field :key="'price'+key" ref="price" label="Price" required placeholder="Fill your number" :rules="[rules.number, rules.required]" v-model="price" @click="keyboardFocus = 'price'">
                <template v-slot:append>
                  <span style="color: #1471ff">€</span>
                </template>
              </pos-text-field>
            </div>
            <div>
              <pos-text-field ref="barcode" label="Barcode/PLU" placeholder="Fill your number" v-model="barcode" @click="keyboardFocus = 'barcode'">
                <template v-slot:append>
                  <g-icon svg>icon-scanning_barcode</g-icon>
                </template>
              </pos-text-field>
            </div>
          </div>
          <div class="action">
            <g-btn :uppercase="false" outlined class="mr-2" width="120" @click="dialogNewProductDetail = false">Cancel</g-btn>
            <g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" width="120" @click="save">OK</g-btn>
          </div>
        </div>
        <div class="bg-grey-lighten-1 pa-2">
          <pos-keyboard-full v-model="keyboard"/>
        </div>
      </div>
    </g-dialog>
  </div>
</template>

<script>
  /*import PosKeyboardFull from '../../pos-shared-components/PosKeyboardFull';
  import PosTextField from '../../pos-shared-components/POSInput/PosTextField';
  import PosSwitch from '../../pos-shared-components/PosSwitch';
  import PosSelect from '../../pos-shared-components/POSInput/PosSelect';*/

  export default {
    name: 'dialogNewProduct',
    //components: { PosSelect, PosSwitch, PosTextField, PosKeyboardFull },
    injectService: [
      'PosStore:getAllCategories',
      'PosStore:createNewProduct',
      'PosStore:getAllTaxCategory',
      'PosStore:getHighestProductOrder',
    ],
    data() {
      return {
        taxCategory: null,
        taxes: [],
        productCategory: null,
        categories: [],
        unit: null,
        units: ['Box', 'Pack'],
        productName: '',
        productID: '',
        productPrice: '',
        productBarcode: '',
        favorite: null,
        nonRefundable: null,
        active: null,
        showOnOrderScreen: null,
        manualPrice: null,
        expansions: [
          { name: 'Multiple Unit' },
          { name: 'Attributes' },
          { name: 'More' },
        ],
        expansionItem: null,
        dialogNewProductDetail: false,
        rules: {
          number: value => !isNaN(value) || 'Must be a number',
          required: value => !!value || value === 0 || 'Required',
        },
        keyboardFocus: null,
        name: '',
        id: '',
        price: '',
        barcode: '',
        key: 0,
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      dialogNewProduct: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      keyboard: {
        get() {
          if (this.keyboardFocus) {
            return this[this.keyboardFocus];
          }
        },
        set(val) {
          this[this.keyboardFocus] = val;
        }
      },
      valid() {
        if (typeof this.rules.required(this.name) === 'string') {
          return false
        }
        if (typeof this.rules.required(this.taxCategory) === 'string') {
          return false
        }
        if (typeof this.rules.required(this.productCategory) === 'string') {
          return false
        }
        if (typeof this.rules.required(this.price) === 'string'
            || typeof this.rules.number(this.price) === 'string') {
          return false
        }
        return true
      }
    },
    async created() {
      this.categories = (await this.getAllCategories()).map(c => ({
        ...c,
        value: c.name,
      }));

      this.taxes = this.getAllTaxCategory().map(t => ({
				text: t.name,
				value: t.value
			}));
    },
    methods: {
      openDialogDetail(textfield) {
        this.keyboardFocus = textfield;
        this.dialogNewProductDetail = true;
        setTimeout(() => {
          this.$refs[textfield].$refs.input.focus();
        }, 200);
      },
      save() {
        this.productName = this.name;
        this.productID = this.id;
        this.productPrice = this.price;
        this.productBarcode = this.barcode;
        this.dialogNewProductDetail = false;
      },
      async submit() {
        const maxOrder = await this.getHighestProductOrder(this.productCategory._id);
        const product = {
          name: this.productName,
          category: this.productCategory._id,
          tax: this.taxCategory,
          id: this.productID,
          price: parseFloat(this.productPrice),
          barcode: this.productBarcode,
          unit: this.unit,
          option: {
            favorite: this.favorite,
            nonRefundable: this.nonRefundable,
            active: this.active,
            showOnOrderScreen: this.showOnOrderScreen,
            manualPrice: this.manualPrice,
          },
          layouts: [
            {
              'color': 'white',
              'order': maxOrder+1
            }
          ]
        }
        this.dialogNewProduct = false;
        await this.createNewProduct(product);
      }
    },
    watch: {
      dialogNewProductDetail: function (val) {
        if (!val) {
          this.name = this.productName;
          this.id = this.productID;
          this.price = this.productPrice;
          this.barcode = this.productBarcode;
          this.key++;
        }
      },
      dialogNewProduct: function (val) {
        if (!val) {
          this.taxCategory = null;
          this.productCategory = null;
          this.unit = null;
          this.productName = '';
          this.productID = '';
          this.productPrice = '';
          this.productBarcode = '';
          this.favorite = null;
          this.nonRefundable = null;
          this.active = null;
          this.showOnOrderScreen = null;
          this.manualPrice = null;
          this.keyboardFocus = null;
          this.name = '';
          this.id = '';
          this.price = '';
          this.barcode = '';
          this.key++;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog-product {
    display: flex;
    flex-direction: column;
    background-color: white;
    overflow-y: auto;

    .form {
      padding: 48px;

      .title {
        padding-left: 27px;
        font-size: 16px;
        line-height: 20px;
        color: #1d1d26;
        font-weight: 700;
        margin-bottom: 16px;
      }

      .input {
        display: grid;
        grid-gap: 12px 4px;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(4, auto);
        padding: 0 48px;

        .g-switch-wrapper {
          margin-top: 0;
        }
      }

      .g-expansion-group {
        box-shadow: none;

        ::v-deep .g-expansion,
        ::v-deep .g-expansion > .g-expansion-header {
          border: none;
          padding: 0;
          font-size: 16px;
          line-height: 20px;
          min-height: 42px;
          font-weight: 700;

          .g-expansion-header-prepend {
            width: 16px;
            color: #919191;
          }
        }

        ::v-deep .g-expansion .g-expansion-content {
          background-color: white;
          border: none;
        }
      }
    }

    .form__detail {
      padding: 16px;

      .input__detail {
        padding: 24px 128px;
        display: grid;
        grid-template-rows: repeat(2, minmax(100px, 1fr));
        grid-template-columns: 1fr 1fr;
        grid-gap: 16px 64px;
      }

      .action {
        display: flex;
        justify-content: flex-end;
      }
    }

    ::v-deep .g-btn__outlined {
      border: 1px solid #979797;
      color: #1d1d26;
    }
  }
</style>
