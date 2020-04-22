<template>
  <div class="upload-zone">
    <slot v-bind:showUploadDialog="showUploadDialog">
      <div v-if="url" style="height: 244px">
        <img :src="url" class="uploaded-image" draggable="false"/>
        <g-btn-bs @click="showUploadDialog('crop')" class="edit-image-btn" text-color="#424242" background-color="#FFF" :elevation="elevation">
          <g-icon>photo_camera</g-icon>
          <span style="margin-left: 4px">Edit Photo</span>
        </g-btn-bs>
      </div>

      <div v-else @click="showUploadDialog('src')" style="padding: 20px; height: 244px">
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
    </slot>
    <!-- -->
    <g-dialog v-model="dialog.upload" persistent>
      <div style="width: 580px; background-color: #FFF; border-radius: 5px; margin: 0 auto;">
        <!-- src -->
        <div style="font-weight: 600;font-size: 24px;color: #212121; padding: 35px 0 28px 35px">Upload Restaurant Photo</div>
        <template v-if="view === 'src'">
          <div style="margin-bottom: -1px;">
            <span @click="tab = 'url'" :style=" {...getTabStyle('url'), marginLeft: '35px' }">Paste Photo Url</span>
            <span @click="tab= 'upload'" :style="getTabStyle('upload')">Upload a photo</span>
          </div>
          <div style="border: 1px solid #9E9E9E; background-color: #EFEFEF; padding: 36px;">
            <template v-if="tab === 'url'">
              <g-text-field-bs v-model="photoUrl" label="Photo URL"/>
            </template>
            <template v-else>
              <div style="height: 70px; display: flex; align-items: center">
                <g-btn-bs @click="choosePhoto" background-color="#FFF" border-color="#C4C4C4" text-color="#424242" width="150">Choose Photo</g-btn-bs>
                <span>{{ fileName }}</span>
              </div>
            </template>
            <div style="display: flex; justify-content: flex-end; margin-top: 34px;">
              <g-btn-bs height="44" @click="closeDialog">Cancel</g-btn-bs>
              <g-btn-bs @click="moveToCropView" background-color="#536DFE" width="98" height="44" text-color="#FFF">Next</g-btn-bs>
            </div>
          </div>
        </template>
        <!-- crop -->
        <template v-else>
          <div style="text-align: center; background: #EFEFEF; ">
            <div v-if="loadingImage">Loading image...</div>
            <div v-if="initializingCropper">Preparing cropper...</div>
            <img :src="imageSrc" style="height: 281px" ref="previewImage" @load="imageLoaded">
          </div>
          <div style="display: flex; justify-content: flex-end; padding: 35px;">
            <g-btn-bs height="44" @click="moveToSrcView">Back</g-btn-bs>
            <g-btn-bs :disabled="initializingCropper" background-color="#536DFE" text-color="#FFF" width="98" height="44" @click="_uploadImage">Save</g-btn-bs>
          </div>
        </template>
      </div>
    </g-dialog>
  </div>
</template>
<script>
  const Cropper = () => import('cropperjs');
  
  export default {
    name: 'UploadZone',
    props: {
      url: String,
      elevation: {
        type: Number,
        default: 2
      }
    },
    data: function () {
      return {
        view: 'src', // src | crop
        tab: 'url', // url | upload
        
        // via link
        loadingImage: false,
        photoUrl: this.url || '',
        
        // via file
        file: null,
        
        // cropper
        cropper: null,
        initializingCropper: false,
        
        //
        dialog: {
          upload: false,
        },
      }
    },
    injectService: ['FileUploadStore:(openUploadFileDialog,uploadImage)'],
    computed: {
      fileName() {
        return this.file ? this.file.name : 'No file chosen'
      },
      isExternalFile() {
        // external file is file which starts with http
        // internal file is file which hosted by grid fs and starts with /cmsfiles
        return this.photoUrl.startsWith('http')
      },
      imageSrc() {
        if (this.tab === 'url') {
          return this.isExternalFile ? `/store/upload-zone/prepare?url=${this.photoUrl}` : this.photoUrl
        } else {
          // upload from file
          return URL.createObjectURL(this.file)
        }
      },
    },
    methods: {
      getTabStyle(tab) {
        return {
          display: 'inline-block',
          'font-family': 'Muli',
          'font-weight': 'bold',
          'font-size': '15px',
          'padding': '8px 10px',
          'border': `1px solid ${ tab === this.tab? '#9E9E9E' : 'transparent' }`,
          'border-bottom': `1px solid ${ tab === this.tab? 'transparent' : '#9E9E9E' }`,
          background: tab === this.tab ? '#EFEFEF' : 'transparent',
          cursor: 'pointer'
        }
      },
      showUploadDialog(view = 'src') {
        this.dialog.upload = true
        this.view = view
      },
      moveToSrcView() {
        this.view = 'src'
        // remove cropper
        this.cropper && this.cropper.destroy()
      },
      moveToCropView() {
        this.view = 'crop'
        this.loadingImage = true
        this.initializingCropper = true
      },
      imageLoaded() {
        this.loadingImage = false
        this.$nextTick(async () => {
          const image = this.$refs.previewImage
          if (!image) return
          const cropperCtor = (await Cropper()).default
          const cropper = new cropperCtor(image, {
            oncrop() {

            }
          });
          this.$set(this, 'cropper', cropper)
          this.initializingCropper = false
        })
      },
      closeDialog() {
        this.dialog.upload = false
        this.removeTemporaryFileIfExist()
      },
      choosePhoto() {
        this.openUploadFileDialog(file => this.file = file)
      },
      async _uploadImage() {
        const options = { imageSmoothingEnabled: true, imageSmoothingQuality: 'high' }
        this.cropper.getCroppedCanvas(options).toBlob(async (blob) => {
          let uploadedUrl
          if (this.tab === 'url') {
            uploadedUrl = await this.uploadImage(new File([blob], this.photoUrl.substr(this.photoUrl.lastIndexOf('/') + 1)), { type: 'image/*' })
            this.removeTemporaryFileIfExist()
          } else {
            uploadedUrl = await this.uploadImage(new File([blob], this.file.name, { type: this.file.type }))
          }
          this.$emit('url', uploadedUrl)
          this.dialog.upload = false
        })
      },
      removeTemporaryFileIfExist() {
        if (this.photoUrl && this.isExternalFile)
          axios.post(`/store/upload-zone/clean?url=${this.photoUrl}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  .upload-zone {
    border: 1px dashed #9E9E9E;
    border-radius: 2px;
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

  .bs-tf-wrapper ::v-deep .bs-tf-inner-input-group {
    background: white;
  }
</style>
<style lang="scss">
  @import "~cropperjs/src/index.scss";
</style>
