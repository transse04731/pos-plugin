<template>
  <g-dialog v-model="internalValue" width="580" eager persistent>
    <div class="dialog">
      <div class="dialog-title">{{edit ? 'Edit' : 'Create New'}} Account</div>
      <div class="dialog-content">
        <div>
          <g-text-field-bs label="Name" v-model="internalName"/>
        </div>
        <div>
          <g-text-field-bs label="Email" v-model="internalUsername"/>
        </div>
        <div v-if="!edit">
          <g-text-field-bs label="Password" type="password" v-model="internalPassword"/>
        </div>
        <div v-if="!edit">
          <g-text-field-bs label="Retype Password" type="password" v-model="retypePassword"/>
        </div>
        <div class="span-2">
          <g-autocomplete deletable-chips multiple text-field-component="GTextFieldBs" label="Group" v-model="internalStoreGroups" :items="availableGroupsViewModel"/>
        </div>
        <div class="dialog-content__permission">
          <p class="span-2 ml-2 mt-3">Permission</p>
          <g-checkbox
              v-for="(perm, i) in internalPermissions"
              :key="i"
              :label="perm.permission | startCase"
              v-model="perm.value"
              color="#536DFE"/>
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
      //
      name: String,
      username: String,
      password: String,
      storeGroups: Array,
      permissions: Array,
    },
    filters: {
      startCase(val) {
        return _.startCase(val)
      }
    },
    injectService: [
      'PosOnlineOrderManagementStore:availableGroupsViewModel',
      'PermissionStore:allPermissions'
    ],
    data() {
      return {
        internalName: this.name,
        internalUsername: this.username,
        internalPassword: this.password,
        retypePassword: '',
        internalStoreGroups: this.storeGroups,
        internalPermissions: null,
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
    created() {
      this.internalPermissions = _.map(this.allPermissions, availPerm => {
        const definedPerm = _.find(this.permissions, defPerm => defPerm.permission === availPerm)
        return definedPerm ? definedPerm : { permission: availPerm, value: false }
      })
    },
    methods: {
      save() {
        if (this.edit) {
          const changes = {
            storeGroups: this.internalStoreGroups,
            permissions: this.internalPermissions
          };
          this.name !== this.internalName && (changes.name = this.internalName)
          this.username !== this.internalUsername && (changes.username = this.internalUsername)
          this.$emit('edit', changes)
          this.internalValue = false
        } else {
          if (this.internalPassword !== this.retypePassword) {
            // TODO: UX
            alert('Retype password mismatch!')
            return
          }
          this.$emit('add', {
            name: this.internalName,
            password: this.internalPassword,
            username: this.internalUsername,
            storeGroups: this.internalStoreGroups,
            permissions: this.internalPermissions
          })
          this.internalValue = false
        }
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

     .g-autocomplete ::v-deep .input {
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

     .g-autocomplete ::v-deep .bs-tf-append-inner {
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
