<template>
  <g-dialog v-model="internalValue" width="580" eager persistent>
    <div class="dialog">
      <div class="dialog-title">Set New Password</div>
      <div class="dialog-content">
        <div>
          <g-text-field-bs label="Password" type="password" v-model="internalPassword"/>
        </div>
        <div>
          <g-text-field-bs label="Retype Password" type="password" v-model="retypePassword"/>
        </div>
      </div>
      <div class="dialog-action">
        <g-btn-bs large text-color="#424242" @click="internalValue = false">Cancel</g-btn-bs>
        <g-btn-bs width="100" large background-color="indigo accent-2" text-color="white" @click="save">Save</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogNewAccountPassword',
    props: { value: Boolean },
    data: function () {
      return {
        internalPassword: null,
        retypePassword: null
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
    },
    methods: {
      save() {
        if (this.internalPassword !== this.retypePassword) {
          // TODO: UX
          alert('Password mismatch!')
          return
        }
        this.$emit('save', { password: this.internalPassword })
        this.internalValue = false
      }
    }
  }
</script>
<style scoped lang="scss">
  .dialog {
    width: 100%;
    background-color: white;
    border-radius: 4px;
    padding: 24px 32px;
  
    &-title {
      font-size: 24px;
      font-weight: 600;
      color: #212121;
      margin-bottom: 24px;
    }
  
    &-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: auto;
      grid-gap: 5px;
    }
  
    &-action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
</style>
