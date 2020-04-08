<template>
  <div class="restaurant-info">
    <div class="restaurant-info__title">Restaurant Information</div>
    <div class="restaurant-info__main">
      <div class="restaurant-info__main--left">
        <div class="mb-3 ml-1 fw-700">Basic info</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 2fr 1fr 1fr 1fr 1fr; grid-gap: 5px">
            <g-text-field-bs label="Restaurant Name"
                             placeholder="Restaurant Name"
                             :value="store.name"
                             @input="$emit('update', { name: $event })"/>
            <g-text-field-bs label="Restaurant Phone"
                             placeholder="Restaurant Phone"
                             :value="store.phone"
                             @input="$emit('update', { phone: $event })"/>
            <div class="span-2">
              <p class="ml-1">Restaurant Address</p>
              <g-textarea outlined no-resize placeholder="Address..."
                          :rows="3"
                          :value="store.address"
                          @input="$emit('update', { address: $event })"/>
            </div>
            <g-text-field-bs label="Zip code"
                             :value="store.zipCode"
                             @input="$emit('update', {zipCode: $event})"/>
            <g-text-field-bs label="Town/City"
                             :value="store.townCity"
                             @input="$emit('update', {townCity: $event})"/>
            <g-text-field-bs class="span-2"
                             label="Country"
                             :value="store.country"
                             @input="$emit('update', {country: $event})"/>
            <g-text-field-bs class="span-2"
                             label="Currency"
                             :value="store.currency"
                             @input="$emit('update', {currency: $event})"/>
            <g-text-field-bs class="span-2"
                             label="Time zone"
                             :value="store.timeZone"
                             @input="$emit('update', {timeZone: $event})"/>
        </div>
      </div>
      <div class="restaurant-info__main--right">
        <div class="mb-3 fw-700">Upload photo</div>
        <div class="mb-5">
          <div class="mb-2">Restaurant Photo</div>
          <upload-zone :url="store.orderHeaderImageSrc" @url="saveImage"/>
        </div>
        <div>
          <div class="mb-2">Restaurant Logo</div>
          <upload-zone :url="store.logoImageSrc" @url="saveLogo"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import UploadZone from './UploadZone';
  
  // TODO:
  // - remove old image when user change to new image
  // - input debounce
  
  export default {
    name: 'RestaurantInformation',
    components: { UploadZone },
    props: {
      store: Object
    },
    data: function () {
      return {}
    },
    computed: {},
    methods: {
      async saveImage(url) {
        this.$emit('update', { orderHeaderImageSrc: url })
      },
      async saveLogo(url) {
        this.$emit('update', { logoImageSrc: url })
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
