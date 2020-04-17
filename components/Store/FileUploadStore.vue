<template>
  <file-upload-progress-dialog
      v-model="showFileUploadProgressDialog"
      :uploading-items="uploadingItems"
      @update:uploadingItems="uploadingItems = $event"
  />
</template>
<script>
  import _ from 'lodash'
  import createGridFsHandlers from 'vue-file-explorer/api-handlers/grid-fs'
  import openUploadFileDialog from 'vue-file-explorer/api-handlers/openUploadFileDialog'
  import FileUploadProgressDialog from 'vue-file-explorer/components/FileExplorerPanel/dialogs/FileUploadProgressDialog.vue'
  
  export default {
    name: 'FileUploadStore',
    domain: 'FileUploadStore',
    components: {FileUploadProgressDialog},
    async created() {
      this.gridFsHandler = createGridFsHandlers({
        // namespace: this.$getService('PosStore').accountId,
        apiBaseUrl: 'http://localhost:8888/cms-files'
      })
      
      await this.createFolder('/', 'images')
      await this.createFolder('/', 'upload')
    },
    data() {
      return {
        uploadingItems: [],
        showFileUploadProgressDialog: false,
      }
    },
    computed: {},
    methods: {
      openAndUploadImage() {
        return new Promise((resolve, reject) => {
          try {
            openUploadFileDialog({ multiple: false, mimeType: 'image/*' }, files => {
              this.showFileUploadProgressDialog = true
              this.uploadingItems.push(this.gridFsHandler.uploadFile(files[0], '/images', response => {
                if (response.data[0].uploadSuccess) {
                  resolve(`${location.origin}/cms-files/files/view/${response.data[0].createdFile.folderPath}${response.data[0].createdFile.fileName}`)
                } else {
                  reject(response)
                }
              }))
            })
          } catch(e) {
            reject(e)
          }
        })
      },
      async prepareUploadAppFolder(file, version) {
        await this.createFolder('/update', file.name)
        await this.createFolder(`/update/${file.name}`, version)
      },
      uploadApp(file, version) {
        return new Promise(async (resolve ,reject) => {
          this.showFileUploadProgressDialog = true
          this.uploadingItems.push(this.gridFsHandler.uploadFile(file, `/update/${file.name}/${version}`, response => {
            if (response.data[0].uploadSuccess) {
              resolve(`${location.origin}/cms-files/files/view/${response.data[0].createdFile.folderPath}${response.data[0].createdFile.fileName}`)
            } else {
              reject(response)
            }
          }))
        })
      },
      removeFile(fileMetaData) {
        this.gridFsHandler.deleteFile({ _id: fileMetaData._id })
      },
      async isFolderExist(folderPath) {
        try {
          await this.gridFsHandler.getFilesInPath(folderPath)
          return true
        } catch (e) {
          return false
        }
      },
      async createFolder(folderPath, parentPath) {
        const separator = _.endsWith(parentPath, '/') ? '' : '/'
        const folderExist = await this.isFolderExist(`${parentPath}${separator}${folderPath}`)
        if (!folderExist)
          await this.gridFsHandler.createNewFolder(parentPath, folderPath)
      }
    },
    provide() {
      return {
        openAndUploadImage: this.openAndUploadImage,
        prepareUploadAppFolder: this.prepareUploadAppFolder,
        uploadApp: this.uploadApp,
        removeFile: this.removeFile,
        createFolder: this.createFolder
      }
    }
  }
</script>
<style scoped>
</style>
