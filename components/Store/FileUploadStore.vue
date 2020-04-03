<template>

</template>
<script>
  import createGridFsHandlers from 'vue-file-explorer/api-handlers/grid-fs'
  
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
      uploadFile(file) {
        return new Promise((resolve, reject) => {
          try {
            this.gridFsHandler.uploadFile(file, '/', fileMetaData => resolve(fileMetaData))
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
