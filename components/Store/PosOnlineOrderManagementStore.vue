<template>

</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'PosOnlineOrderManagementStore',
    domain: 'PosOnlineOrderManagementStore',
    props: {},
    data: function () {
      return {
        storeGroups: [],
        stores: [],
        // --
        searchContent: null,
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
        _.each(this.storeGroups, sg => {
          const group = { name: sg.name, stores: [] }
          _.each(this.stores, store => {
            if (_.includes(store.storeGroups, sg._id))
              group.stores.push({ ...store } )
          })
          groups.push(group)
        })
        return groups
      },
      posManagementModel() {
        if (!this.searchContent && !this.orderBy)
          return this.intermediatePosManagementModel
        const groups = []
        _.each(this.intermediatePosManagementModel, storeGroup => {
          const group = { name: storeGroup.name }
          const stores = []
          _.each(storeGroup.stores, store => {
            if (_.includes(store.name, this.searchContent))
              stores.push(store)
          })
          if (this.orderBy) {
            switch (this.orderBy) {
              case 'lastUpdated':
                group.stores = _.orderBy(stores, [(s1, s2) => true], 'asc')
                break;
              case 'firstUpdated':
                group.stores = _.orderBy(stores, [(s1, s2) => true], 'desc')
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
        })
      }
    },
    methods: {
      async loadStoreGroups() {
        this.storeGroups.splice(0, this.storeGroups.length, ...await cms.getModel('StoreGroup').find({}))
      },
      async loadStores() {
        this.stores.splice(0, this.stores.length, ...await cms.getModel('Store').find({}))
      },
      async addGroup(name) {
        if (_.includes(this.storeGroupNames, name))
          return { ok: false, message: 'This name is already taken!' }
        await cms.getModel('StoreGroup').create({ name })
        await this.loadStoreGroups()
        return { ok: true}
      },
      async addStore({ name, storeGroups, address }) {
        const result = await cms.getModel('Store').create({ name, storeGroups, address })
        await this.loadStores()
        return { ok: true }
      },
      async removeStore(_id) {
        const result = await cms.getModel('Store').remove({_id})
        await this.loadStores()
        return { ok : true }
      },
      async updateStore(_id, change) {
        await cms.getModel('Store').findOneAndUpdate({_id}, {...change})
        await this.loadStores()
        return { ok : true }
      },
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
        posManagementModel: this.posManagementModel
      }
    }
  }
</script>
<style scoped>
</style>
