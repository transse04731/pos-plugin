<template>
  <div>
    <g-dialog v-model="dialogNewProduct" fullscreen scrollable eager :key="'dialogNewProduct'+key">
      <div class="dialog-product w-100">
        <div class="form">
          <div class="title">
            Create New Product
          </div>
          <div class="input">
            <pos-text-field label="Name" placeholder="Fill your number" @click="openDialogDetail('name')" v-model="productName" required/>
            <div class="input__tax">
              <p class="label">Tax <span class="text-red">*</span></p>
              <div class="row-flex">
                <div v-for="(tax, i) in taxes" :key="i"
                     :class="['tax', taxCategory && tax.value === taxCategory.value && 'selected__tax']"
                     @click="selectTax(tax)">
                  {{tax.name}}
                </div>
              </div>
            </div>
            <pos-text-field label="Product ID" placeholder="Auto generate" disabled @click="openDialogDetail('id')" v-model="productID"/>
            <pos-select label="Product Category" :items="categories" item-text="name" item-value="value" return-object v-model="productCategory" append-icon="mdi-chevron-down" required/>
            <pos-select label="Unit" :items="units" v-model="unit" append-icon="mdi-chevron-down"/>
            <div></div>
            <pos-text-field :key="'pPrice'+key" label="Price" placeholder="Fill your number" @click="openDialogDetail('price')" v-model="productPrice" required>
              <template v-slot:append>
                <span style="color: #1471ff">€</span>
              </template>
            </pos-text-field>
            <pos-text-field label="Barcode/PLU" placeholder="Fill your number" @click="openDialogDetail('barcode')" v-model="productBarcode">
              <template v-slot:append>
                <g-icon svg>icon-scanning_barcode</g-icon>
              </template>
            </pos-text-field>
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
          <g-btn :uppercase="false" outlined class="mr-2" width="120" @click="back()">Cancel</g-btn>
          <g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" width="120" :disabled="!valid" @click="submit">Submit</g-btn>
        </g-toolbar>
      </div>
    </g-dialog>
    <g-dialog v-model="dialogNewProductDetail" overlay-color="#6b6f82" overlay-opacity="0.95" width="90%" eager :key="'dialogNewProductDetail'+key">
      <div class="dialog-product w-100">
        <div class="form__detail">
          <div class="input__detail">
            <div>
              <pos-text-field ref="name" label="Name" required placeholder="Fill your number" :rules="[rules.required]" v-model="name" @click="keyboardFocus = 'name'"/>
            </div>
            <div>
              <pos-text-field ref="productID" label="Product ID" placeholder="Auto generate" v-model="productID" @click="keyboardFocus = 'id'"/>
            </div>
            <div>
              <pos-text-field ref="price" label="Price" required placeholder="Fill your number" :rules="[rules.number, rules.required]" v-model="price" @click="keyboardFocus = 'price'">
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

  export default {
    name: 'dialogNewProduct',
    injectService: [
      'PosStore:getAllCategories',
      'PosStore:createNewProduct',
      'PosStore:getAllTaxCategory',
      'PosStore:getHighestProductOrder',
      'PosStore:selectedProduct',
      'PosStore:updateProduct',
    ],
    data() {
      return {
        taxCategory: null,
        taxes: [],
        productCategory: null,
        categories: [],
        unit: null,
        units: ['box', 'pack'],
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
        isEditProduct: false,
        internalValue: false,
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      dialogNewProduct: {
        get() {
          return this.internalValue
        },
        set(val) {
          this.internalValue = val;
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

      this.taxes = this.getAllTaxCategory().sort((a,b) => (a.value - b.value))
    },
    methods: {
      open(isEdit) {
        this.isEditProduct = isEdit;
        if (this.isEditProduct && this.selectedProduct) {
          const p = this.selectedProduct;
          //update new dialog
          this.productName = p.name;
          this.productCategory = this.categories.find(c => c._id === p.category._id);
          this.taxCategory = this.taxes.find(t => t.value === p.tax);
          this.productID = p.id;
          this.productPrice = '' + p.price;
          this.productBarcode = p.barcode;
          this.unit = p.unit;
          this.favorite = p.option && p.option.favorite;
          this.nonRefundable = p.option && p.option.nonRefundable;
          this.active = p.option && p.option.active;
          this.showOnOrderScreen = p.option && p.option.showOnOrderScreen;
          this.manualPrice = p.option && p.option.manualPrice;
          //update detail dialog
          this.name = this.productName;
          this.id = this.productID;
          this.price = this.productPrice;
          this.barcode = this.productBarcode;
        } else {
          this.productName = '';
          this.productCategory = null;
          this.taxCategory = null;
          this.productID = '';
          this.productPrice = '';
          this.productBarcode = '';
          this.unit = null;
          this.favorite = null;
          this.nonRefundable = null;
          this.active = null;
          this.showOnOrderScreen = null;
          this.manualPrice = null;
          this.name = '';
          this.id = '';
          this.price = '';
          this.barcode = '';
        }
        this.key++;
        this.keyboardFocus = null;
        this.dialogNewProduct = true;
      },
      back() {
        this.dialogNewProduct = false;
      },
      selectTax(tax) {
        this.taxCategory = tax;
      },
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
              'order': maxOrder + 1
            }
          ]
        }
        this.dialogNewProduct = false;
        if (this.isEditProduct) {
          await this.updateProduct({ ...product, _id: this.selectedProduct._id })
        } else {
          await this.createNewProduct(product);
        }
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

        &__tax {
          padding: 4px 4px 8px;

          .label {
            font-size: 13px;
            line-height: 16px;
            font-weight: 400;
            margin-top: 5px;
          }

          .tax {
            background: #F0F0F0;
            border: 1px solid #C9C9C9;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            margin: 8px;
            flex-grow: 1;

            &:first-child {
              margin-left: 0;
            }

            &:last-child {
              margin-right: 0;
            }
          }

          .selected__tax {
            position: relative;
            border-color: #1976D2;
            background: #E0F1FF;

            &:before {
              position: absolute;
              content: '\F12C';
              font-family: "Material Design Icons", sans-serif;
              top: 0;
              right: 0;
              color: #fff;
              transform: translate(50%, -50%);
              border-radius: 50%;
              background-color: #1976D2;
              line-height: 1;
            }
          }
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

<style lang="scss">
  .g-dialog-content {
    display: flex;
  }
</style>
