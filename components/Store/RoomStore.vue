<template>
</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'RoomStore',
    domain: 'RoomStore',
    data: function () {
      return {
        rooms: null
      }
    },
    created() {
      this.rooms = this.orderRooms(cms.getList('Room'))
    },
    methods: {
      async reloadRooms() {
        this.rooms.splice(0, this.rooms.length, ...this.orderRooms(await cms.getModel('Room').find({})))
      },
      orderRooms(rooms) {
        return _.orderBy(rooms, ['order'], ['asc']);
      }
    },
    provide() {
      return {
        rooms: this.rooms,
        reloadRooms: this.reloadRooms
      }
    }
  }
</script>
<style scoped>
</style>
