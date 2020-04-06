<template>
  <div class="upload-zone" @click="uploadImage">
    <div style="display: flex; align-items: center">
      <img src="/plugins/pos-plugin/assets/img.svg" class="mr-2">
      <div>
        <div class="upload-zone__subtext fw-700">One high resolution image</div>
        <div class="upload-zone__subtext text-grey">PNG, JPG</div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; padding-top: 30px;">
      <img src="/plugins/pos-plugin/assets/upload.svg" class="mb-2">
      <div class="upload-zone__title">Drag and drop an image</div>
      <div>or <span style="color: #2873f2">browse</span> to choose file</div>
      <div class="upload-zone__subtext text-grey">(430x200 or larger recommended, up to 10MB each)</div>
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

<style scoped lang="scss">
  .upload-zone {
    padding: 20px;
    border: 1px dashed #9E9E9E;
    border-radius: 2px;
    height: 244px;
    cursor: pointer;

    &:hover {
      background-color: #FAFAFA;
    }

    &__subtext {
      font-size: 12px;
      line-height: 11px;
    }

    &__title {
      font-size: 18px;
      font-weight: 900;
    }
  }
</style>
