<template>

</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'PermissionStore',
    domain: 'PermissionStore',
    props: {},
    computed: {
      haveManageAccountPermission() {
        return _.find(cms.loginUser.user.permissions, perm => perm.permission === 'manageAccount' && perm.value === true)
      },
      haveManageGroupPermission() {
        return _.find(cms.loginUser.user.permissions, perm => perm.permission === 'manageGroup' && perm.value === true)
      },
      haveManageStorePermission() {
        return _.find(cms.loginUser.user.permissions, perm => perm.permission === 'manageStore' && perm.value === true)
      },
      haveRemoteControlPermission() {
        return _.find(cms.loginUser.user.permissions, perm => perm.permission === 'remoteControl' && perm.value === true)
      },
      haveConfigOnlineOrderingPermission() {
        return _.find(cms.loginUser.user.permissions, perm => perm.permission === 'configOnlineOrdering' && perm.value === true)
      },
      haveSettingPermission() {
        return _.find(cms.loginUser.user.permissions, perm => perm.permission === 'setting' && perm.value === true)
      },
      haveUpdatePermission() {
        return _.find(cms.loginUser.user.permissions, perm => perm.permission === 'update' && perm.value === true)
      }
    },
    methods: {
    },
    provide() {
      return {
        haveManageAccountPermission: this.haveManageAccountPermission,
        haveManageGroupPermission: this.haveManageGroupPermission,
        haveManageStorePermission: this.haveManageStorePermission,
        haveRemoteControlPermission: this.haveRemoteControlPermission,
        haveConfigOnlineOrderingPermission: this.haveConfigOnlineOrderingPermission,
        haveSettingPermission: this.haveSettingPermission,
        haveUpdatePermission: this.haveUpdatePermission
      }
    }
  }
</script>
<style scoped>
</style>
