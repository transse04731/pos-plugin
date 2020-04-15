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
        orderBy: null
      }
    },
    computed: {
      storeGroupNames() {
        return _.map(this.storeGroups, sg => sg.name)
      },
      storeNames() {
        return _.map(this.stores, s => s.name)
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
            _.each(storeGroup.stores, store => _.includes(store.name, this.searchText) && stores.push(store))
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
    },
    methods: {
      // store groups
      async loadStoreGroups() {
        this.storeGroups.splice(0, this.storeGroups.length, ...cms.loginUser.user.storeGroups)
      },
      async addGroup(name) {
        if (_.includes(this.storeGroupNames, name))
          return { ok: false, message: 'This name is already taken!' }
        const createdGroup = await cms.getModel('StoreGroup').create({ name })
        const storeGroups = [..._.map(cms.loginUser.user.storeGroups, sg => sg._id), createdGroup._id]
        await cms.getModel('User').findOneAndUpdate({_id: cms.loginUser.user._id}, { storeGroups })
        await cms.updateUserSession()
        await this.loadStoreGroups()
        return { ok: true}
      },

      // stores
      async loadStores() {
        const storeGroupIds = _.map(cms.loginUser.user.storeGroups, sg => sg._id)
        const stores = await cms.getModel('Store').find({ groups: { $elemMatch: { $in: storeGroupIds } } })
        this.stores.splice(0, this.stores.length, ...stores)
      },
      async addStore({ name, groups, address }) {
        if (_.includes(this.storeNames, name))
          return { ok: false, message: 'This name is already taken!' }
        const result = await cms.getModel('Store').create({ name, groups, address, addedDate: dayjs(), pickup: true })
        // assign alias as an id by default
        await cms.getModel('Store').updateOne({_id: result._id}, { alias: result._id })
        await this.loadStores()
        return { ok: true }
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
          return { ok : true }
        }
      },
      async updateStore(_id, change) {
        await cms.getModel('Store').findOneAndUpdate({_id}, {...change})
        await this.loadStores()
        this.showSnackbar = true
        return { ok : true }
      },
      
      // devices
      async addDevice({pairingCode}) {
        
        return { ok: true }
      },
      async removeDevice(_id) {
        return { ok: true }
      },
      async updateDevice(_id, change) {
        return { ok: true }
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
        orderBy: this.orderBy
      }
    }
  }
</script>
<style scoped>
</style>
