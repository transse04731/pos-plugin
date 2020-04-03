<template>

</template>
<script>
  import createGridFsHandlers from 'vue-file-explorer/api-handlers/grid-fs'
  import openUploadFileDialog from 'vue-file-explorer/api-handlers/openUploadFileDialog'
  
  export default {
    name: 'FileUploadStore',
    domain: 'FileUploadStore',
    created() {
      this.gridFsHandler = createGridFsHandlers({
        // namespace: this.$getService('PosStore').accountId,
        apiBaseUrl: 'http://localhost:8888'
      })
    },
    computed: {},
    methods: {
      uploadFile() {
        return new Promise((resolve, reject) => {
          try {
            openUploadFileDialog({ multiple: false, mimeType: 'image/*' }, files => {
              this.gridFsHandler.uploadFile(files[0], '/', fileMetaData => resolve(fileMetaData))
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
