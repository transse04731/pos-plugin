<template>
  <div class="menu-setting-new-item">
    <!-- Product info -->
    <div class="menu-setting-new-item__main">
      <div class="ta-center">{{ index + 1 }}</div>
      <div class="menu-setting-new-item__image" @click="uploadImage">
        <img v-if="internalImage" :src="internalImage" style="opacity: 0.8; width: 100%; height: 100%"/>
        <div v-else class="menu-setting-new-item__image--upload">
          <img alt src="/plugins/pos-plugin/assets/upload.svg"/>
          <p>Upload</p>
        </div>
      </div>
      <div class="menu-setting-new-item__content">
        <div style="display: grid; grid-template-columns: 50px 1fr 1fr">
          <g-text-field-bs small v-model="internalId" :rules="productRules.id" placeholder="Id *"/>
          <g-text-field-bs small v-model="internalName" :rules="productRules.name" placeholder="Name *"/>
          <g-select text-field-component="GTextFieldBs" :items="printers" v-model="internalPrinter"/>
        </div>
        <div>
          <g-text-field-bs small v-model="internalPrice" :rules="productRules.price" type="number" placeholder="Price *"/>
        </div>
        <g-textarea outlined no-resize :rows="2" v-model="internalDesc" placeholder="Description"/>
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
    <!-- Action button -->
    <div style="display: flex; justify-content: flex-end">
      <g-btn-bs @click="$emit('cancel')">Cancel</g-btn-bs>
      <g-btn-bs text-color="#536DFE" @click="saveMenuItem">Save</g-btn-bs>
    </div>
  </div>
</template>
<script>
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
      groupPrinter: String,
      printers: Array
    },
    data: function () {
      return {
        internalId: this.id || '',
        internalName: this.name,
        internalDesc: this.desc,
        internalPrice: this.price,
        internalTax: this.tax || 7,
        internalImage: this.image,
        internalPrinter: (this.groupPrinter && this.groupPrinter._id)|| null,
        // TODO: Link database
        taxes: [{ text: '19%', value: 19 }, { text: '7%', value: 7 }],
        productRules: {
          id: [ (value) => value ? true : 'Product\'s id is missing' ],
          name: [ (value) => value ? true : 'Product\'s name is missing' ],
          price: [ (value) => value ? true : 'Product\'s price is missing' ]
        }
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
        
        if (!this.internalPrinter) {
          alert('Product\'s printer is missing')
          return
        }
        
        this.$emit('save', {
          id: this.internalId,
          image: this.internalImage,
          name: this.internalName,
          desc: this.internalDesc,
          groupPrinter: this.internalPrinter,
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
      display: grid;
      grid-template-columns: 1fr 140px;
      padding-top: 16px;

      .g-textarea {
        margin: 0 4px;
        width: calc(100% - 10px);

        ::v-deep fieldset {
          border-width: 1px !important;
          border-color: #ced4da;

          &:focus-within {
            border-color: #80bdff !important;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
            z-index: 2;
          }

          .g-tf-input {
            padding: 6px 12px;
            line-height: 16px !important;
            height: 48px !important;
          }

          .g-tf-append__inner {
            display: none;
          }
        }
      }

      .bs-tf-wrapper {
        margin: 0 4px;

        ::v-deep .bs-tf-input {
          width: 100%;
        }
      }

    }

    &__image {
      width: 80px;
      height: 80px;
      border-radius: 15px;
      cursor: pointer;
      border: 1px dashed #B1B5BA;

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
      margin: 4px 6px 4px 4px;
      padding: 4px;
      font-size: 13px;

      .option {
        padding: 2px 8px;
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
