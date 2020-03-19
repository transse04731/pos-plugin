<template>
  <fragment>
    <div class="main">
      <div class="main__item">
        <pos-text-field :label="$t('settings.companyName')" v-model="name" @click="dialogCompanyName = true">
          <template v-slot:append>
            <g-icon svg>icon-keyboard</g-icon>
          </template>
        </pos-text-field>
      </div>
      <div class="main__item">
        <pos-text-field :label="$t('settings.address')" v-model="address" @click="dialogCompanyAddress = true">
          <template v-slot:append>
            <g-icon svg>icon-keyboard</g-icon>
          </template>
        </pos-text-field>
      </div>
      <div class="main__item">
        <pos-text-field :label="$t('settings.tel')" v-model="telephone" @click="dialogCompanyTelephone = true">
          <template v-slot:append>
            <g-icon svg>icon-keyboard</g-icon>
          </template>
        </pos-text-field>
      </div>
      <div class="main__item">
        <pos-text-field :label="$t('settings.taxNo')" v-model="taxNumber" @click="dialogCompanyTaxNumber = true">
          <template v-slot:append>
            <g-icon svg>icon-keyboard</g-icon>
          </template>
        </pos-text-field>
      </div>
      <div class="main__item">
        <p class="item-label">{{$t('settings.logo')}}</p>
        <g-file-input outlined filled dense prependInnerIcon="icon-upload" svg-icon v-model="file" @change="convertImg" accept="image/*" placeholder="Upload"></g-file-input>
      </div>
      <div class="main__item">
        <p class="item-label">{{$t('settings.logoSize')}}</p>
        <div class="logo">
          <div v-for="i in 6" :key="i" :class="['item', logoSize === i && 'item__selected']" @click="changeLogoSize(i)">
            {{i}}
          </div>
        </div>
      </div>
      <div class="main__item item__big">
        <p class="item-label">{{$t('settings.logoPreview')}}</p>
        <div class="preview-wrapper">
          <img alt :style="imgStyle" :src="logo">
        </div>
      </div>
    </div>
    <dialog-text-filter :label="$t('settings.companyName')" :default-value="name" v-model="dialogCompanyName" @submit="changeName($event)"/>
    <dialog-text-filter :label="$t('settings.address')" :default-value="address" v-model="dialogCompanyAddress" @submit="changeAddress($event)"/>
    <dialog-text-filter :label="$t('settings.tel')" :default-value="telephone" v-model="dialogCompanyTelephone" @submit="changeTelephone($event)"/>
    <dialog-text-filter :label="$t('settings.taxNo')" :default-value="taxNumber" v-model="dialogCompanyTaxNumber" @submit="changeTaxNumber($event)"/>
  </fragment>
</template>

<script>
  import { convertToUnit } from 'pos-vue-framework';

  export default {
    name: 'viewCompany',
    injectService: [
      'SettingsStore:(companyInfo, getCompanyInfo, updateCompanyInfo)'
    ],
    data() {
      return {
        file: null,
        dialogCompanyName: false,
        dialogCompanyAddress: false,
        dialogCompanyTelephone: false,
        dialogCompanyTaxNumber: false,
      }
    },
    computed: {
      name: {
        get() {
          if (this.companyInfo) {
            return this.companyInfo.name;
          }
        },
        set(val) {
          this.$set(this.companyInfo, 'name', val)
        }
      },
      address: {
        get() {
          if (this.companyInfo) {
            return this.companyInfo.address;
          }
        },
        set(val) {
          this.$set(this.companyInfo, 'address', val)
        }
      },
      telephone: {
        get() {
          if (this.companyInfo) {
            return this.companyInfo.telephone;
          }
        },
        set(val) {
          this.$set(this.companyInfo, 'telephone', val)
        }
      },
      taxNumber: {
        get() {
          if (this.companyInfo) {
            return this.companyInfo.taxNumber;
          }
        },
        set(val) {
          this.$set(this.companyInfo, 'taxNumber', val)
        }
      },
      logo: {
        get() {
          if (this.companyInfo) {
            return this.companyInfo.logo;
          }
        },
        set(val) {
          this.$set(this.companyInfo, 'logo', val)
        }
      },
      logoSize: {
        get() {
          if (this.companyInfo) {
            return this.companyInfo.logoSize;
          }
        },
        set(val) {
          this.$set(this.companyInfo, 'logoSize', val)
        }
      },
      imgStyle() {
        const base = 20;
        return {
          width: convertToUnit(base * this.logoSize),
          height: convertToUnit(base * this.logoSize),
        }
      }
    },
    async created() {
      await this.getCompanyInfo();
    },
    methods: {
      convertImg() {
        const reader = new FileReader();
        reader.onload = async () => {
          this.logo = reader.result
          await this.updateCompanyInfo();
        }
        if (this.file) {
          reader.readAsDataURL(this.file);
        }
      },
      async changeName(name) {
        this.name = name;
        await this.updateCompanyInfo();
      },
      async changeAddress(address) {
        this.address = address;
        await this.updateCompanyInfo();
      },
      async changeTelephone(telephone) {
        this.telephone = telephone;
        await this.updateCompanyInfo();
      },
      async changeTaxNumber(taxNumber) {
        this.taxNumber = taxNumber;
        await this.updateCompanyInfo();
      },
      async changeLogoSize(size) {
        this.logoSize = size;
        await this.updateCompanyInfo();
      }
    }
  }
</script>

<style scoped lang="scss">
  .main {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-auto-columns: 1fr 1fr;
    grid-auto-flow: column;
    grid-gap: 12px 24px;
    padding: 32px 52px;
  }

  .bs-tf-wrapper ::v-deep {
    .bs-tf-inner-input-group {
      border-radius: 2px;

      .bs-tf-input {
        padding: 8px;
      }
    }

    .g-icon.icon-keyboard {
      cursor: pointer;
    }
  }

  .g-tf-wrapper {
    margin: 8px 0 0 4px;

    ::v-deep .g-tf .g-tf-input {
      padding: 4px 6px;
    }

    ::v-deep .g-tf-append__inner {
      margin-right: 8px;
    }
  }

  .g-file-input {
    &.g-tf-wrapper.g-tf__filled.g-tf__outlined ::v-deep .g-file-input--text {
      padding: 8px;

      p {
        font-weight: 700;
        color: #9E9E9E;
        opacity: 1 !important;
        font-size: 14px;
      }
    }

    ::v-deep .g-tf-prepend__outer {
      display: none;
    }

    ::v-deep .g-tf-prepend__inner {
      padding: 0 !important;
      margin: 0 0 0 16px;

      .g-icon {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
      }
    }

    ::v-deep fieldset {
      border-color: #ced4da !important;
      border-radius: 2px !important;
    }

    &:focus-within ::v-deep fieldset {
      border-color: #1471ff !important;
    }
  }

  .main__item {
    padding-right: 32px;

    .item-label {
      font-size: 13px;
      line-height: 16px;
      margin-left: 4px;
      margin-top: 8px;
    }

    &.item__big {
      grid-row: span 2;
      display: flex;
      flex-direction: column;

      .preview-wrapper {
        margin: 8px 4px 4px;
        flex: 1;
        display: flex;
        border: 1px solid #ced4da;
        border-radius: 2px;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
      }
    }
  }

  .logo {
    display: flex;
    margin-left: 4px;

    .item {
      background: #F0F0F0;
      border: 1px solid #C9C9C9;
      box-sizing: border-box;
      border-radius: 2px;
      padding: 12px 16px;
      margin: 8px 8px 0 0;
      font-size: 13px;
      line-height: 16px;

      &.item__selected {
        border-color: #1471ff;
        border-width: 2px;
      }
    }

  }
</style>
