<template>
  <g-dialog v-model="dialog.editDeviceName" @input="internalValue = false">
    <div class="dialog">
      <div class="dialog__title">Edit Device Name</div>
      <g-text-field-bs label="Device Name:" v-model="internalName"/>
      <div class="dialog__buttons">
        <g-btn-bs @click="internalValue = false">Cancel</g-btn-bs>
        <g-btn-bs @click="save">Save</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogEditDeviceName',
    props: {
      value: Boolean,
      device: Object
    },
    data: function () {
      return {}
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set() {
          this.$emit('input', false)
        }
      },
      internalName() {
        return this.device.name
      }
    },
    methods: {
      save() {
        this.$emit('save', this.device._id, this.internalValue)
        this.internalValue = false
      }
    }
  }
</script>
<style scoped lang="scss">
  .dialog {
    background: white;
    border-radius: 4px;
    width: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;
  
    &__title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 28px;
    }
  
    &__buttons {
      display: flex;
      align-self: flex-end;
      margin-top: 24px;
      margin-right: -8px;
    }
  }
</style>
