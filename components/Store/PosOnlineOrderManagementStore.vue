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
        //
        apps: [],
        appItems: [],
        // view model
        appShows: {},
        versionControlOrderBy: { order: 'desc', type: 'uploadDate' },
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
      },
      //
      appNames() {
        return _.map(this.apps, app => app.name)
      },
      newAppItemDialogViewModel() {
        return {
          listGroup: _.map(this.apps, app => ({ text: app.name, value: app._id })),
          listBaseVersions: _.map(this.versionControlViewModel, app => {
            return {
              group: app._id,
              versions: _.map(app.files, file => ({ text: file.version, value: file.version }))
            }
          }),
          listRelease: [
            {text: 'Beta', value: 'Beta'},
            {text: 'Stable', value: 'Stable'},
            {text: 'Archived', value: 'Archived'},
          ],
          listType: [
            {text: 'APK', value: 'APK'},
            {text: 'Patch', value: 'Patch'}
          ],
        }
      },
      orderedAppItems() {
        return _.orderBy(this.appItems, this.versionControlOrderBy.type, this.versionControlOrderBy.order)
      },
      versionControlViewModel() {
        return _.map(this.apps, app => {
          const appViewModel = {
            _id: app._id,
            group: app.name,
            files: [],
            show: this.appShows[app._id]
          }
          _.each(this.orderedAppItems, appItem => {
            if (appItem.app._id === app._id)
              appViewModel.files.push({
                ..._.pick(appItem, ['_id', 'version', 'type', 'release', 'uploadDate', 'uploadPath']),
                base: appItem.baseVersion,
                note: appItem.changeLog,
                menu: false
              })
          })
          return appViewModel
        })
      }
    },
    async created() {
      await this.loadStoreGroups()
      await this.loadStores()
      await this.loadApps()
      await this.loadAppItems()
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
      
      async addApp(name, callback) {
        if (_.includes(this.appNames, name)) {
          callback && callback({ ok: false, message: 'App name has been taken!' })
        } else {
          await cms.getModel('App').create({ name })
          callback && callback({ ok: true })
          await this.loadApps()
        }
      },
      
      async changeAppName(_id, name, callback) {
        const app = _.find(this.apps, app => app.name === name)
        if (app) {
          if (app._id === _id) {
            return
          } else {
            callback && callback({ ok: false, message: 'Name has been taken!' })
            return
          }
        }
        
        await cms.getModel('App').updateOne({_id}, { name })
        callback && callback({ ok: true })
        await this.loadApps()  // TODO: just change app name, consider setting value locally without loadApps
      },
      
      // appItems
      async loadAppItems() {
        const appItems = await cms.getModel('AppItem').find({})
        this.appItems.splice(0, this.appItems.length, ...appItems)
      },
      
      async uploadAppItem({ file, group, version, type, base, release, note }) {
        await this.$getService('FileUploadStore').prepareUploadAppFolder(file.name, version)
        const uploadPath = await this.$getService('FileUploadStore').uploadApp(file, version)
        await cms.getModel('AppItem').create({ version, type, changeLog: note, uploadPath, uploadDate: new Date(), app: group, baseVersion: base, release })
        await this.loadAppItems()
      },
      
      async editAppItem(_id, { release, note}) {
        const appItem = await cms.getModel('AppItem').findOne({_id})
        if (!appItem)
          return
        await cms.getModel('AppItem').updateOne({_id}, { changeLog: note, release })
        await this.loadAppItems()
      },
      
      async removeAppItem(_id) {
        const appItem = await cms.getModel('AppItem').findOne({_id})
        // delete file in file explorer
        await this.$getService('FileUploadStore').removeFile(appItem.uploadPath)
        // delete app document
        await cms.getModel('AppItem').remove({_id})
        await this.loadAppItems()
      },
      
      toggleHideShowApp(_id) {
        if (_.has(this.appShows, _id)) {
          this.appShows[_id] = !this.appShows[_id]
        } else {
          this.$set(this.appShows, _id, true)
        }
      }
    },
    provide() {
      return {
        // groups
        storeGroups: this.storeGroups,
        loadStoreGroups: this.loadStoreGroups,
        addGroup: this.addGroup,

        // stores
        stores: this.stores,
        loadStores: this.loadStores,
        addStore: this.addStore,
        removeStore: this.removeStore,
        updateStore: this.updateStore,
        
        // store management display model
        posManagementModel: this.posManagementModel,
        searchText: this.searchText,
        orderBy: this.orderBy,
        
        // devices
        addDevice: this.addDevice,
        removeDevice: this.removeDevice,
        updateDevice: this.updateDevice,
        
        // apps
        apps: this.apps,
        loadApps: this.loadApps,
        addApp: this.addApp,
        changeAppName: this.changeAppName,
        
        // app items
        loadAppItems: this.loadAppItems,
        uploadAppItem: this.uploadAppItem,
        editAppItem: this.editAppItem,
        removeAppItem: this.removeAppItem,
        appItems: this.appItems,
        
        //
        versionControlViewModel: this.versionControlViewModel,
        newAppItemDialogViewModel: this.newAppItemDialogViewModel,
        versionControlOrderBy: this.versionControlOrderBy,
        toggleHideShowApp: this.toggleHideShowApp,
      }
    }
  }
</script>
<style scoped>
</style>
