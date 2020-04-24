<template>

</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'PermissionStore',
    domain: 'PermissionStore',
    props: {},
    computed: {
      versionControlPerm() {
        return cms.loginUser.user.role.name === 'admin'
      },
      manageAccountPerm() {
        return _.find(this.permissions, perm => perm.permission === 'manageAccount' && perm.value === true)
      },
      manageGroupPerm() {
        return _.find(this.permissions, perm => perm.permission === 'manageGroup' && perm.value === true)
      },
      manageStorePerm() {
        return _.find(this.permissions, perm => perm.permission === 'manageStore' && perm.value === true)
      },
      remoteControlPerm() {
        return _.find(this.permissions, perm => perm.permission === 'remoteControl' && perm.value === true)
      },
      configOnlineOrderingPerm() {
        return _.find(this.permissions, perm => perm.permission === 'configOnlineOrdering' && perm.value === true)
      },
      settingsPerm() {
        return _.find(this.permissions, perm => perm.permission === 'settings' && perm.value === true)
      },
      updateAppPerm() {
        return _.find(this.permissions, perm => perm.permission === 'updateApp' && perm.value === true)
      },
      featureControlPerm() {
        return _.find(this.permissions, perm => perm.permission === 'featureControl' && perm.value === true)
      }
    },
    data() {
      return {
        permissions: []
      }
    },
    async created() {
      const user = await cms.getModel('User').findOne({ _id: cms.loginUser.user._id }, { permissions : 1 })
      user && this.permissions.splice(0, 0, ...user.permissions)
    },
    provide() {
      return {
        versionControlPerm: this.versionControlPerm,
        manageAccountPerm: this.manageAccountPerm,
        manageGroupPerm: this.manageGroupPerm,
        manageStorePerm: this.manageStorePerm,
        remoteControlPerm: this.remoteControlPerm,
        configOnlineOrderingPerm: this.configOnlineOrderingPerm,
        settingsPerm: this.settingsPerm,
        updateAppPerm: this.updateAppPerm,
        featureControlPerm: this.featureControlPerm
      }
    }
  }
</script>
<style scoped>
</style>
