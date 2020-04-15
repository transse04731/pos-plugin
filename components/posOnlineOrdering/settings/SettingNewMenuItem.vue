<template>
  <div class="menu-setting-new-item">
    <!-- Product info -->
    <div class="menu-setting-new-item__main">
      <div class="ta-center">{{ index + 1 }}</div>
      <div class="menu-setting-new-item__image" @click="uploadImage">
        <img v-if="internalImage" :src="internalImage" draggable="false" style="opacity: 0.8; max-width: 100%; max-height: 100%"/>
        <div v-else class="menu-setting-new-item__image--upload">
          <img alt src="/plugins/pos-plugin/assets/upload.svg"/>
          <p>Upload</p>
        </div>
      </div>
      <div class="menu-setting-new-item__content">
        <div class="menu-setting-new-item__content--upper">
          <div class="col-1">
            <g-text-field-bs small v-model="internalId" type="number" placeholder="No."/>
          </div>
          <div class="col-6">
        <g-text-field-bs small v-model="internalName" :rules="productRules.name" placeholder="Name *"/>
          </div>
          <div class="col-3">
            <g-select v-if="useMultiplePrinters" small text-field-component="GTextFieldBs" v-model="internalPrinter" :items="internalAvailablePrinters"/>
            <g-text-field-bs small v-else-if="availablePrinters.length" :value="availablePrinters[0]" readonly/>
          </div>
          <div class="col-2">
            <g-text-field-bs small v-model="internalPrice" :rules="productRules.price" type="number" placeholder="Price *"/>
          </div>
        </div>
        <div class="menu-setting-new-item__content--lower">
          <div class="col-9">
            <g-textarea outlined no-resize :rows="2" v-model="internalDesc" placeholder="Description"/>
          </div>
          <div class="col-3">
            <div class="menu-setting-new-item__tax">
              <div>Tax:</div>
              <div>
                <g-grid-select mandatory :value="internalTax" :items="taxes" itemCols="6">
                  <template #default="{ toggleSelect, item, index }">
                    <div class="option" @click="e =>{ toggleSelect(item); internalTax = item.value;}">
                      {{item.text}}
                    </div>
                  </template>
                  <template #selected="{ toggleSelect, item, index }">
                    <div class="option option--selected" @click="e => {toggleSelect(item); internalTax = item.value;}">
                      {{item.text}}
                    </div>
                  </template>
                </g-grid-select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Action button -->
    <div style="display: flex; justify-content: flex-end">
      <g-btn-bs @click="$emit('cancel')">Cancel</g-btn-bs>
      <g-btn-bs text-color="#536DFE" @click="saveMenuItem">Save</g-btn-bs>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'NewMenuItem',
    props: {
      id: String,
      index: Number,
      name: String,
      desc: String,
      price: [String, Number],
      tax: Number,
      image: String,
      number: Number,
      printer: String,
      availablePrinters: Array,
      useMultiplePrinters: Boolean,
    },
    data: function () {
      return {
        internalId: this.id || '',
        internalName: this.name,
        internalDesc: this.desc,
        internalPrice: this.price,
        internalTax: this.tax || 7,
        internalImage: this.image,
        internalPrinter: this.printer || (this.availablePrinters.length && this.availablePrinters[0]),
        // TODO: Link database
        taxes: [{ text: '19%', value: 19 }, { text: '7%', value: 7 }],
        productRules: {
          id: [ (value) => value ? true : 'Product\'s id is missing' ],
          name: [ (value) => value ? true : 'Product\'s name is missing' ],
          price: [ (value) => value ? true : 'Product\'s price is missing' ]
        }
      }
    },
    computed: {
      internalAvailablePrinters() {
        return _.map(this.availablePrinters, printer => ({ text: printer, value: printer }))
      }
    },
    methods: {
      async uploadImage() {
        this.internalImage = await this.$getService('FileUploadStore').uploadFile()
      },
      saveMenuItem() {
        if (!this.internalName) {
          alert('Product name is missing')
          return
        }
        
        if (!this.internalPrice) {
          alert('Product\'s price is missing')
          return
        }
        
        if (!this.internalId) {
          alert('Product\'s id is missing')
          return
        }

        if (!this.internalPrinter.length) {
          alert('Product\'s printer is missing')
          return
        }

        this.$emit('save', {
          id: this.internalId,
          image: this.internalImage,
          name: this.internalName,
          desc: this.internalDesc,
          printer: this.internalPrinter,
          price: this.internalPrice,
          tax: this.internalTax,
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .menu-setting-new-item {
    background: #FFF;

    &__main {
      display: grid;
      grid-template-columns: 40px 80px 1fr;
      grid-gap: 15px;
      align-items: center;
    }

    &__content {
      padding-right: 16px;

      &--upper,
      &--lower {
        display: flex;
        margin-top: 4px;
      }

      .g-textarea {
        margin: 0 2px;
        width: calc(100% - 4px);

        ::v-deep fieldset {
          border-width: 1px !important;
          border-color: #ced4da;

          &:focus-within {
            border-color: #80bdff !important;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
            z-index: 2;
          }

          .g-tf-input {
            padding: 6px;
            line-height: 18px !important;
            height: 40px !important;
          }

          .g-tf-append__inner {
            display: none;
          }
        }
      }

      .g-select {
        ::v-deep .bs-tf-wrapper {
          margin: 0 2px;
          width: calc(100% - 4px);

          .bs-tf-inner-input-group {
            height: 30px;
            font-size: 14px;

            .bs-tf-input {
              height: 28px;
            }
          }
        }
      }

      .bs-tf-wrapper {
        margin: 0 2px;
        width: calc(100% - 4px);

        ::v-deep .bs-tf-inner-input-group {
          padding: 0 6px;
        }

        ::v-deep .bs-tf-input {
          width: 100%;
          outline: none;
        }
      }

    }

    &__image {
      width: 80px;
      height: 80px;
      border-radius: 15px;
      cursor: pointer;
      border: 1px dashed #B1B5BA;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      &--upload {
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 16px;
        color: #E0E0E0;

        img {
          width: 60%;
        }
      }
    }

    &__tax {
      border: 1px solid #ced4da;
      border-radius: 4px;
      margin: 0 2px;
      padding: 0 4px 3px;
      font-size: 13px;

      .option {
        padding: 0px 8px;
        text-align: center;
        font-size: 15px;
        font-style: italic;
        border-radius: 2px;
        border: 1px solid #E0E0E0;
        margin-right: 4px;
        cursor: pointer;

        &--selected {
          border-color: #90CAF9;
          background-color: #E3F2FD;
        }
      }

      ::v-deep .g-col {
        padding: 0;
      }
    }
  }
</style>
