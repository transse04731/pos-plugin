<template>
  <file-upload-progress-dialog
      v-model="showFileUploadProgressDialog"
      :uploading-items="uploadingItems"
      @update:uploadingItems="uploadingItems = $event"
  />
</template>
<script>
  import createGridFsHandlers from 'vue-file-explorer/api-handlers/grid-fs'
  import openUploadFileDialog from 'vue-file-explorer/api-handlers/openUploadFileDialog'
  import FileUploadProgressDialog from 'vue-file-explorer/components/FileExplorerPanel/dialogs/FileUploadProgressDialog.vue'
  
  export default {
    name: 'FileUploadStore',
    domain: 'FileUploadStore',
    components: {FileUploadProgressDialog},
    created() {
      this.gridFsHandler = createGridFsHandlers({
        // namespace: this.$getService('PosStore').accountId,
        apiBaseUrl: 'http://localhost:8888/cms-files'
      })
    },
    data() {
      return {
        uploadingItems: [],
        showFileUploadProgressDialog: false,
      }
    },
    computed: {},
    methods: {
      uploadFile() {
        return new Promise((resolve, reject) => {
          try {
            openUploadFileDialog({ multiple: false, mimeType: 'image/*' }, files => {
              this.showFileUploadProgressDialog = true
              this.uploadingItems.push(this.gridFsHandler.uploadFile(files[0], '/', response => {
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
      removeFile(fileMetaData) {
        this.gridFsHandler.deleteFile({ _id: fileMetaData._id })
      }
    },
    provide() {
      return {
        uploadFile: this.uploadFile,
        removeFile: this.removeFile
      }
    }
  }
</script>
<style scoped>
</style>
