<template>
  <div class="restaurant-info">
    <div class="restaurant-info__title">Restaurant Information</div>
    <div class="restaurant-info__main">
      <div class="restaurant-info__main--left">
        <div class="mb-3 ml-1 fw-700">Basic info</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 2fr 1fr 1fr 1fr 1fr; grid-gap: 5px">
            <g-text-field-bs label="Restaurant Name" placeholder="Restaurant Name"/>
            <g-text-field-bs label="Restaurant Phone" placeholder="Restaurant Phone"/>
            <div class="span-2">
              <p class="ml-1">Restaurant Address</p>
              <g-textarea outlined no-resize placeholder="Address..." :rows="3"/>
            </div>
            <g-text-field-bs label="Zip code"/>
            <g-text-field-bs label="Town/City"/>
            <g-text-field-bs class="span-2" label="Country"/>
            <g-text-field-bs class="span-2" label="Currency"/>
            <g-text-field-bs class="span-2" label="Time zone"/>
        </div>
      </div>
      <div class="restaurant-info__main--right">
        <div class="mb-3 fw-700">Upload photo</div>
        <div class="mb-5">
          <div class="mb-2">Restaurant Photo</div>
          <upload-zone @url="saveImage"/>
        </div>
        <div>
          <div class="mb-2">Restaurant Logo</div>
          <upload-zone @url="saveLogo"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import UploadZone from './UploadZone';
  export default {
    name: 'RestaurantInformation',
    components: { UploadZone },
    props: {},
    data: function () {
      return {}
    },
    computed: {},
    methods: {
      async saveImage(url) {
        debugger
        await this.$getService('PosOnlineOrderSettingStore').changeRestaurantInfo({ orderHeaderImageSrc: url })
      },
      async saveLogo(url) {
        await this.$getService('PosOnlineOrderSettingStore').changeRestaurantInfo({ logoImageSrc: url })
      }
    }
  }
</script>

<style scoped lang="scss">
  .restaurant-info {

    &__title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    &__main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-gap: 20px;

      &--left,
      &--right {
        background-color: #FFF;
        border-radius: 5px;
        padding: 25px 25px 50px 25px;

        .span-2 {
          grid-column: span 2;
        }
      }

      .g-textarea {
        margin-left: 4px;
        margin-right: 4px;
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
            padding: 12px;
          }

          .g-tf-append__inner {
            display: none;
          }
        }
      }
    }


  }
</style>
