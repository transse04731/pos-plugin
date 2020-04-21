<template>
  <g-dialog v-model="internalValue" width="580" eager>
    <div class="dialog">
      <div class="dialog-title">{{edit ? 'Edit' : 'Create New'}} Account</div>
      <div class="dialog-content">
        <div>
          <g-text-field-bs label="Name" v-model="internalName"/>
        </div>
        <div>
          <g-text-field-bs label="Email" v-model="internalEmail"/>
        </div>
        <div v-if="!edit">
          <g-text-field-bs label="Password" type="password" v-model="internalPassword"/>
        </div>
        <div v-if="!edit">
          <g-text-field-bs label="Retype Password" type="password" v-model="retypePassword"/>
        </div>
        <div class="span-2">
          <g-combobox deletable-chips multiple text-field-component="GTextFieldBs" label="Group" v-model="groups"/>
        </div>
        <div class="dialog-content__permission">
          <p class="span-2 ml-2 mt-3">Permission</p>
          <g-checkbox color="#536DFE" label="Add new group" value="Add new group" v-model="permissions"/>
          <g-checkbox color="#536DFE" label="Settings" value="Settings" v-model="permissions"/>
          <g-checkbox color="#536DFE" label="Add new store" value="Add new store" v-model="permissions"/>
          <g-checkbox color="#536DFE" label="Update" value="Update" v-model="permissions"/>
          <g-checkbox color="#536DFE" label="Remote control" value="Remote control" v-model="permissions"/>
          <g-checkbox color="#536DFE" label="Account management" value="Account management" v-model="permissions"/>
          <g-checkbox color="#536DFE" label="Config online ordering" value="Config online ordering" v-model="permissions"/>
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
    name: "dialogAccount",
    props: {
      value: Boolean,
      edit: Boolean,
      name: String,
      email: String,
      password: String,
      group: Array,
      permission: Array
    },
    data() {
      return {
        internalName: '',
        internalEmail: '',
        internalPassword: '',
        retypePassword: '',
        groups: [],
        permissions: []
      }
    },
    watch: {
      name(val) {
        this.internalName = val || ''
      },
      email(val) {
        this.internalEmail = val || ''
      },
      group(val) {
        this.groups = val || []
      },
      permission(val) {
        this.permissions = val || []
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

     .span-2 {
       grid-column: span 2;
     }

     &__permission {
       grid-column: span 2;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-auto-rows: 1fr;
       grid-gap: 5px;
       align-items: center;
     }

     .bs-tf-wrapper ::v-deep .g-icon {
       margin-right: 0 !important;
     }

     .g-combobox ::v-deep .input {
       display: flex;
       flex-wrap: wrap;
       height: 96px;
       overflow: auto;

       .bs-tf-input {
         height: 32px;
         min-width: 0;
         flex: 1;
       }

       .g-chip {
         border-radius: 2px;
         color: #000000;
       }
     }

     .g-combobox ::v-deep .bs-tf-append-inner {
       display: none;
     }
   }

   &-action {
     display: flex;
     align-items: center;
     justify-content: flex-end;
     margin-top: 16px;
   }
 }
</style>
