<template>
  <div style="height: 100%">
    <room v-if="room"
          :name="room.name"
          :room-objects="room.roomObjects"
          @selectRoomObject="selectRoomObj">
      <template #room-object="{roomObject}">
        <div v-if="isTable(roomObject) || !isWall(roomObject)">
          <div>{{ roomObject.name }}</div>
        </div>
      </template>
    </room>
  </div>
</template>
<script>


  export default {
    name: 'RestaurantRoom',
    components: { },
    props: {
      id: String
    },
    data() {
      return {
        room: null,
        roomObj: null,
      }
    },
    async created() {
      await this.loadRoom()
    },
    watch: {
      id() {
        this.loadRoom();
      }
    },
    methods: {
      async loadRoom() {
        this.room = await cms.getModel('Room').findOne({_id: this.id})
      },
      isTable(roomObj) {
        return roomObj.type === 'table'
      },
      isWall(roomObj) {
        return roomObj.type === 'wall'
      },
      selectRoomObj(roomObj) {
        this.roomObj = roomObj;
        this.$router.push(`/view/pos-order-2/${roomObj.name}`)
      },
    }
  }
</script>
<style scoped lang="scss">
  /*
  &:before {
    content: '';
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #0ECBEE;
    transform: translate(50%, -50%) rotate(45deg);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1398);
  }*/
</style>
