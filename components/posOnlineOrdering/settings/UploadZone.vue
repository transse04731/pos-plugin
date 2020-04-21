<template>
  <div class="upload-zone" >
    <div v-if="url">
      <img :src="url" class="uploaded-image" draggable="false"/>
      <g-btn-bs @click="showUploadDialog" class="edit-image-btn" text-color="#424242" background-color="#FFF" :elevation="elevation">
        <g-icon>photo_camera</g-icon>
        <span style="margin-left: 4px">Edit Photo</span>
      </g-btn-bs>
    </div>
    <div v-else @click="showUploadDialog" style="padding: 20px;">
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
    <g-dialog v-model="dialog.upload" persistent>
      <div style="width: 580px; background-color: #FFF; border-radius: 5px; margin: 0 auto;">
        <!-- src -->
        <div style="font-family: Muli; font-weight: 600;font-size: 24px;color: #212121; padding: 35px 0 28px 35px" >Upload Restaurant Photo</div>
        <template v-if="view === 'src'">
          <div style="margin-bottom: -1px;">
            <span @click="tab = 'url'" :style=" {...getTabStyle('url'), marginLeft: '35px' }">Paste Photo Url</span>
            <span @click="tab= 'upload'" :style="getTabStyle('upload')">Upload a photo</span>
          </div>
          <div style="border: 1px solid #9E9E9E; background-color: #E4E6EB; padding: 36px;">
            <template v-if="tab === 'url'">
              <g-text-field-bs v-model="photoUrl" label="Photo URL"/>
            </template>
            <template v-else>
              <div style="height: 70px; display: flex; align-items: center">
                <g-btn-bs @click="choosePhoto" background-color="#FFF">Choose Photo</g-btn-bs>
                <span>{{ fileName }}</span>
              </div>
            </template>
            <div style="display: flex; justify-content: flex-end; margin-top: 34px;">
              <g-btn-bs height="44" @click="closeDialog">Cancel</g-btn-bs>
              <g-btn-bs @click="view = 'crop'" background-color="#536DFE" width="98" height="44" text-color="#FFF">Next</g-btn-bs>
            </div>
          </div>
        </template>
        <!-- crop -->
        <template v-else>
          <div style="text-align: center; background: #EFEFEF; ">
            <div style="display: inline-block; position: relative;">
              <img :src="imageSrc" style="height: 281px" ref="previewImage">
              <div :style="overlayStyle"></div>
            </div>
          </div>
          <div style="display: flex; align-items: center; height: 55px; border-bottom: 1px solid #BDBDBD; margin-bottom: 50px">
            <g-spacer/>
            <g-icon small>fas fa-minus</g-icon>
            <g-slider style="flex: 3" v-model="scaleRatio"/>
            <g-icon small>fas fa-plus</g-icon>
            <g-spacer/>
          </div>
          <div style="display: flex; justify-content: flex-end; padding-bottom: 35px; padding-right: 35px;">
            <g-btn-bs height="44" @click="view = 'src'">Back</g-btn-bs>
            <g-btn-bs background-color="#536DFE" text-color="#FFF" width="98" height="44" @click="uploadImage">Save</g-btn-bs>
          </div>
        </template>
      </div>
    </g-dialog>
  </div>
</template>
<script>
  import TableExpansionRow from '../../Order/components/TableExpansionRow';
  export default {
    name: 'UploadZone',
    components: { TableExpansionRow },
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
        photoUrl: `/cms-files/files/view//images/Smoked_Salmon_Pate_0.jpg`,
        file: null,
        scaleRatio: 100,
        overlayStyle: null,
        dialog: {
          upload: false,
        }
      }
    },
    injectService: ['FileUploadStore:(openUploadFileDialog,uploadFile)'],
    computed: {
      fileName() {
        return this.file ? this.file.name : 'No file chosen'
      },
      imageSrc() {
        return this.tab === 'url' ? this.photoUrl : URL.createObjectURL(this.file)
      }
    },
    watch: {
      scaleRatio(val) {
        console.log('overlay style', this.$refs)
        if (!this.$refs.previewImage)
          return

        const { width, height } = this.$refs.previewImage.getBoundingClientRect()
        const hPadding = (width * (100 - this.scaleRatio)/100) / 2 + 'px'
        const vPadding = (height * (100 -this.scaleRatio)/100) / 2 + 'px'

        this.$set(this, 'overlayStyle', {
          position: 'absolute',
          top: 0,
          left:0,
          width: '100%',
          height: '100%',
          opacity: 0.5,
          borderColor: '#FFF',
          borderStyle: 'solid',
          'border-top-width': hPadding,
          'border-right-width': vPadding,
          'border-bottom-width': hPadding,
          'border-left-width': vPadding,
        })
      }
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
          background: tab === this.tab ? '#E4E6EB' : 'transparent',
          cursor: 'pointer'
        }
      },
      showUploadDialog() {
        this.dialog.upload = true
      },
      closeDialog() {
        this.dialog.upload = false
      },
      choosePhoto() {
        this.openUploadFileDialog(file => this.file = file)
      },
      async uploadImage() {
        
        // this.$emit('url', await this.$getService('FileUploadStore').openAndUploadImage())
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
