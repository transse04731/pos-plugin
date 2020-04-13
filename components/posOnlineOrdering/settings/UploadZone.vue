<template>
  <div class="upload-zone" >
    <div v-if="url">
      <img :src="url" class="uploaded-image" draggable="false"/>
      <g-btn @click="uploadImage" class="edit-image-btn" text-color="#424242" background-color="#FFF" :elevation="elevation">
        <g-icon>photo_camera</g-icon>
        <span style="margin-left: 4px">Edit Photo</span>
      </g-btn>
    </div>
    <div v-else @click="uploadImage" style="padding: 20px;">
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
  </div>
</template>
<script>
  export default {
    name: 'UploadZone',
    props: {
      url: String,
      elevation: {
        type: Number,
        default: 0
      }
    },
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
    border: 1px dashed #9E9E9E;
    border-radius: 2px;
    height: 244px;
    cursor: pointer;
    overflow: hidden;
    position: relative;

    &:hover {
      background-color: #FAFAFA;
    }

    .uploaded-image {
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }
    
    .edit-image-btn {
      position: absolute;
      right: 20px;
      bottom: 20px;
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
