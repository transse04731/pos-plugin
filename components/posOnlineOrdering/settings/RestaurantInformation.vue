<template>
  <div>
    <div style="font-style: normal; font-weight: bold; font-size: 18px;" class="mb-2">Restaurant Information</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr; grid-gap: 20px">
      <div style="background-color: #FFF; border-radius: 5px; padding: 25px 25px 50px 25px;">
        <div style="font-style: normal; font-weight: bold; font-size: 15px;" class="mb-3">Basic info</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 2fr 1fr 1fr 1fr 1fr; grid-gap: 5px">
          <div style="grid-area: 1/1/2/2">
            <g-text-field-bs label="Restaurant Name"/>
          </div>
          <div style="grid-area: 1/2/2/3">
            <g-text-field-bs label="Restaurant Phone"/>
          </div>
          <div style="grid-area: 2/1/3/3">
            <g-text-field-bs label="Restaurant Address"/>
          </div>
          <div style="grid-area: 3/1/4/3">
            <g-text-field-bs label="Zip code"/>
          </div>
          <div style="grid-area: 4/1/5/3">
            <g-text-field-bs label="Town/City"/>
          </div>
          <div style="grid-area: 5/1/6/3">
            <g-text-field-bs label="Country"/>
          </div>
          <div style="grid-area: 6/1/7/3">
            <g-text-field-bs label="Currency"/>
          </div>
          <div style="grid-area: 7/1/8/3">
            <g-text-field-bs label="Time zone"/>
          </div>
        </div>
      </div>
      <div style="background-color: #FFF; border-radius: 5px; padding: 25px 25px 50px 25px;">
        <div style="font-style: normal; font-weight: bold; font-size: 15px;" class="mb-3">Upload photo</div>
        <div class="mb-5">
          <div class="mb-2" style="font-size: 15px">Image</div>
          <upload-zone/>
        </div>
        <div>
          <div class="mb-2" style="font-size: 15px">Logo</div>
          <upload-zone/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import UploadZone from '../common/UploadZone';
  export default {
    name: 'RestaurantInformation',
    components: { UploadZone },
    props: {},
    data: function () {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>
<style scoped>
</style>
