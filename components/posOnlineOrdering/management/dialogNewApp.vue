<template>
  <g-dialog v-if="value" v-model="value" width="580" eager @input="close">
    <div class="dialog-new-app">
      <div class="dialog-new-app-title">Add New App</div>
      <g-text-field-bs label="App Name" v-model="name" @input="clearResponseMessage"/>
      <div>{{ responseMessage }}</div>
      <div class="dialog-new-app-action">
        <g-btn-bs large text-color="#424242" @click="close">Cancel</g-btn-bs>
        <g-btn-bs large :disabled="!name" width="100" background-color="indigo accent-2" text-color="white" @click="addNewApp">Save</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogNewApp',
    props: {
      value: Boolean
    },
    data: function () {
      return {
        name: '',
        responseMessage: ''
      }
    },
    methods: {
      clearResponseMessage() {
        if (this.responseMessage !== '')
          this.responseMessage = ''
      },
      close() {
        this.$emit('input', false)
      },
      addNewApp() {
        this.$emit('submit', this.name, res => {
          if (!res.ok)
            this.responseMessage = res.message
          else
            this.close()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog-new-app {
    background: white;
    border-radius: 4px;
    width: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;
  
    &-title {
       font-size: 24px;
       font-weight: 600;
       margin-bottom: 16px;
       margin-left: 5px;
     }
    
    &-action {
       display: flex;
       align-self: flex-end;
       margin-top: 24px;
       margin-right: -8px;
     }
  }
</style>
