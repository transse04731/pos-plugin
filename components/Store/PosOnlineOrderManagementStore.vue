<template>
  <g-snackbar v-model="showSnackbar" top right color="#536dfe">Saved</g-snackbar>
</template>
<script>
  import _ from 'lodash'
  export default {
    name: 'PosOnlineOrderManagementStore',
    domain: 'PosOnlineOrderManagementStore',
    data: function () {
      return {
        showSnackbar: false,
        storeGroups: [],
        stores: [],
        searchText: null,
        orderBy: null,
        apps: [],
      }
    },
    computed: {
      storeGroupNames() {
        return _.map(this.storeGroups, sg => sg.name)
      },
      storeNames() {
        return _.map(this.stores, s => s.name)
      },
      storeAlias() {
        return _.map(this.stores, s => s.alias)
      },
      intermediatePosManagementModel() {
        const groups = []
        _.each(this.storeGroups, storeGroup => {
          const group = { _id: storeGroup._id, name: storeGroup.name, stores: [] }
          _.each(this.stores, store => {
            if (_.find(store.groups, group => group._id === storeGroup._id))
              group.stores.push({...store, id: group.stores.length + 1 })
          })
          groups.push(group)
        })
        return groups
      },
      posManagementModel() {
        if (!this.searchText && !this.orderBy)
          return this.intermediatePosManagementModel
        const groups = []
        _.each(this.intermediatePosManagementModel, storeGroup => {
          const group = { _id: storeGroup._id, name: storeGroup.name }
          const stores = []
          // search
          if (this.searchText) {
            _.each(storeGroup.stores, store => _.includes(_.lowerCase(store.name), _.lowerCase(this.searchText)) && stores.push(store))
          } else {
            stores.push(...storeGroup.stores)
          }
          
          // sort
          if (this.orderBy) {
            switch (this.orderBy) {
              case 'lastUpdated':
                group.stores = _.orderBy(stores, 'addedDate', 'desc')
                break;
              case 'firstUpdated':
                group.stores = _.orderBy(stores, 'addedDate', 'asc')
                break;
              case 'az':
                group.stores = _.orderBy(stores, 'name', 'asc')
                break;
              case 'za':
                group.stores = _.orderBy(stores, 'name', 'desc')
                break;
            }
          } else {
            group.stores = stores
          }
        
          if (group.stores.length > 0)
            groups.push(group)
        })
        return groups
      }
    },
    async created() {
      await this.loadStoreGroups()
      await this.loadStores()
      await this.loadApps()
    },
    methods: {
      // store groups
      async loadStoreGroups() {
        let storeGroups
        if (cms.loginUser.user.role.name === 'admin') {
          storeGroups = await cms.getModel('StoreGroup').find({})
        } else {
          storeGroups = cms.loginUser.user.storeGroups
        }
        this.storeGroups.splice(0, this.storeGroups.length, ...storeGroups)
      },
      async addGroup(name) {
        if (_.includes(this.storeGroupNames, name)) {
          alert('This name is already taken!')
          return
        }
        const createdGroup = await cms.getModel('StoreGroup').create({ name })
        const storeGroups = [..._.map(cms.loginUser.user.storeGroups, sg => sg._id), createdGroup._id]
        await cms.getModel('User').findOneAndUpdate({_id: cms.loginUser.user._id}, { storeGroups })
        await cms.updateUserSession()
        await this.loadStoreGroups()
      },

      // stores
      async loadStores() {
        const storeGroupIds = _.map(this.storeGroups, sg => sg._id)
        const stores = await cms.getModel('Store').find({ groups: { $elemMatch: { $in: storeGroupIds } } })
        this.stores.splice(0, this.stores.length, ...stores)
      },
      async addStore({ name, groups, address }) {
        if (_.includes(this.storeNames, name)) {
          alert('This name is already taken!')
          return
        }
        
        // get unique alias
        const alias = this.getUniqueAlias(_.toLower(name))
        await cms.getModel('Store').create({ name, alias, groups, address, addedDate: dayjs(), pickup: true })
        await this.loadStores()
      },
      getUniqueAlias(alias) {
        let ctr = 0
        let newAlias
        do {
          ctr++
          newAlias = alias + ctr
        } while(_.includes(this.storeAlias, newAlias))
        return newAlias
      },
      async removeStore(groupId, store) {
        const indexOfGroup = _.findIndex(store.groups, g => g._id === groupId)
        store.groups.splice(indexOfGroup, 1)
        const groups = _.map(store.groups, g => g._id)
        if (groups.length > 0) {
          return await this.updateStore(store._id, { groups })
        } else {
          await cms.getModel('Store').remove({_id : store._id})
          await this.loadStores()
        }
      },
      async updateStore(_id, change) {
        if (change.alias) {
          const store = _.find(this.stores, store => store.alias === change.alias)
          if (store) {
            console.log('alias', change.alias, store)
            console.log('store id', store._id)
            console.log('current id', _id)
            if (store._id !== _id) {
              alert('WebShop identity has been taken')
              return
            }
          }
        }
        await cms.getModel('Store').findOneAndUpdate({_id}, {...change})
        await this.loadStores()
      },
      
      // devices
      async addDevice({pairingCode}) {
        // TODO: addDevice
      },
      async removeDevice(_id) {
        // TODO: removeDevice
      },
      async updateDevice(_id, change) {
        // TODO: updateDevice
      },
      
      // apps
      async loadApps() {
        const apps = await cms.getModel('App').find({})
        this.apps.splice(0, this.apps.length, ...apps)
      },
      async uploadApp({file, version, type, status, changeLog}) {
        await this.$getService('FileUploadStore').prepareUploadAppFolder(file.name, version)
        const uploadPath = await this.$getService('FileUploadStore').uploadApp(file, version)
        await cms.getModel('App').create({ name: file.name, version, type, status, changeLog, uploadPath, uploadDate: new Date() })
        await this.loadApps()
      },
      async editApp(_id, change) {
        const appInfo = await cms.getModel('App').findOne({_id})
        if (!appInfo)
          return
        if (appInfo.version !== change.version) {
          await this.$getService('FileUploadStore').prepareUploadAppFolder(appInfo.name, change.version)
          await this.$getService('FileUploadStore').moveApp(appInfo.uploadPath, change.version)
        }
        await cms.getModel('App').updateOne({_id}, change)
        await this.loadApps()
      },
      async removeApp(_id) {
        const appInfo = await cms.getModel('App').findOne({_id})
        // delete file
        await this.$getService('FileUploadStore').removeFile(appInfo.uploadPath)
        // delete app document
        await cms.getModel('App').remove({_id})
        await this.loadApps()
      }
    },
    provide() {
      return {
        loadStoreGroups: this.loadStoreGroups,
        loadStores: this.loadStores,
        addGroup: this.addGroup,
        addStore: this.addStore,
        removeStore: this.removeStore,
        updateStore: this.updateStore,
        addDevice: this.addDevice,
        removeDevice: this.removeDevice,
        updateDevice: this.updateDevice,
        storeGroups: this.storeGroups,
        stores: this.stores,
        posManagementModel: this.posManagementModel,
        searchText: this.searchText,
        orderBy: this.orderBy,
        loadApps: this.loadApps,
        uploadApp: this.uploadApp,
        editApp: this.editApp,
        removeApp: this.removeApp,
        apps: this.apps
      }
    }
  }
</script>
<style scoped>
</style>
