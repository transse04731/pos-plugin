<template>
  <div style="padding: 20px; border: 1px dashed #9E9E9E; border-radius: 2px; height: 244px;" @click="uploadImage">
    <div style="display: flex; align-items: center">
      <img src="/plugins/pos-plugin/assets/img.svg" style="margin-right: 8px">
      <div>
        <div style="font-weight: bold; font-size: 12px;">One high resolution image</div>
        <div style="font-weight: normal; font-size: 12px; color: #9E9E9E;">PNG, JPG</div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; padding-top: 30px;">
      <img src="/plugins/pos-plugin/assets/upload.svg" class="mb-2">
      <div style="font-weight: 900; font-size: 18px;">Drag and drop an image</div>
      <div>or <span style="color: #2873f2">browse</span> to choose file</div>
      <div style="color: #9E9E9E; font-size: 10px;">(430x200 or larger recommended, up to 10MB each)</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'UploadZone',
    props: {},
    data: function () {
      return {}
    },
    computed: {},
    methods: {
      async uploadImage() {
        this.$emit('url', await this.$getService('FileUploadStore').uploadFile())
      }
    }
  }
</script>
<style scoped>
</style>
