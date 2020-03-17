<template>
  <div style="display: flex; height: 100vh; width: 100vw">
    <pos-dashboard-sidebar :items="sidebarData" :title="user.username">
      <template v-slot:above-spacer>
        <div class="edit-table-plan__add-new-room-btn-wrapper">
          <g-btn @click="addNewRoom"
                 outlined
                 flat dashed
                 border-radius="4"
                 text-color="#2979FF"
                 class="edit-table-plan__add-new-room-btn">+ Add new room</g-btn>
        </div>

        <div v-if="selectedRoom && !selectedRoomObject">
          <div>Room name *:</div>
          <g-text-field :value="selectedRoom.name" @input="changeRoomName"></g-text-field>
        </div>

        <div v-if="selectedRoomObject">
          <template v-if="isTable(selectedRoomObject)">
            <div> Table name:</div>
            <g-text-field v-model="selectedRoomObject.name" @input="changeTableName"/>
            <div> Color: </div>
            <color-selector :value="selectedRoomObject.bgColor" :values="tableColors" @input="updateColor" :item-size="18" :badge-size="12"/>
            <div>Take away: <g-switch/></div>
            <div>
              <g-btn @click="duplicateTable">[] Duplicate</g-btn>
              <g-btn @click="removeTable">[] Delete</g-btn>
            </div>
          </template>
          <template v-else-if="isWall(selectedRoomObject)">
            <div> Color: </div>
            <color-selector :value="selectedRoomObject.bgColor" :values="wallColors" @input="updateColor" :item-size="18" :badge-size="12"/>
          </template>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <g-btn outlined flat @click="addNewWall">+ Wall</g-btn>
          <g-btn flat @click="addNewTable">+ Table</g-btn>
        </div>
        <div>
          <g-btn outlined flat @click="goBack">Back</g-btn>
        </div>
      </template>
    </pos-dashboard-sidebar>
    <room v-if="selectedRoom"
          :name="selectedRoom.name"
          style="width: 100%; height: 100%"
          mode="edit"
          :room-objects="selectedRoom.roomObjects"
          :room-object-container-style="{borderRadius: '4px'}"
          @selectroomobject="onRoomObjectSelected"
          @roomobjectchanged="onRoomObjectChanged">
      <template #room-object="{roomObject}">
        <div class="room__object__content" :style="getRoomObjectStyle(roomObject)">
          <div v-if="isTable(roomObject)">
            <div>{{ roomObject.clock }}</div>
            <div>{{ roomObject.name }}</div>
            <div>{{ roomObject.minute }}</div>
          </div>
          <div v-else-if="!isWall(roomObject)">
            <div>{{ roomObject.name }}</div>
          </div>
        </div>
      </template>
    </room>
  </div>
</template>
<script>
  import _ from 'lodash';
  import Room from './Room';
  import PosDashboardSidebar from '../Dashboard/PosDashboardSidebar';
  import DialogChangeValue from '../pos-shared-components/dialogChangeValue';
  import GButtonMerger from '../FnButton/components/GButtonMerger';
  import ColorSelector from '../common/ColorSelector';

  export default {
    name: 'EditTablePlan',
    components: { ColorSelector, GButtonMerger, DialogChangeValue, PosDashboardSidebar, Room },
    injectService: ['PosStore:user'],
    props: {},
    data: function () {
      return {
        selectedRoom: null,
        selectedRoomObject: null,
        sidebarData: [{
          title: 'Restaurant', icon: 'icon-restaurant', items: []
        }],
        tableColors: this.convertToColorSelectorModel(['#FFFFFF', '#FBE4EC', '#EDE7F6', '#E1F5FE', '#FFFDE7', '#E8F5E9', '#EFEBE9', '#F5F5F5']),
        wallColors: this.convertToColorSelectorModel(['#FFFFFF', '#CCCCCC', '#4D0019', '#404040', '#86592D', '#A6A6A6', '#FFD480', '#E4E4E4'])
      }
    },
    methods: {
      convertToColorSelectorModel(colors) {
        return _.map(colors, (c, i) => ({ index:i, text: c, value: c}))
      },
      // room
      async loadRooms() {
        const rooms = await cms.getModel('Room').find({})
        this.updateSidebarItems(_.map(rooms, this.convertRoomToSideBarItem))
      },
      convertRoomToSideBarItem(room) {
        return {
          title: room.name,
          icon: 'radio_button_unchecked',
          iconType: 'small',
          onClick: () => {
            this.selectedRoom = room
            this.selectedRoomObject = null
          }
        }
      },
      updateSidebarItems(newSideBarItems) {
        this.sidebarData[0].items.splice(0, this.sidebarData[0].items.length, ...newSideBarItems)
      },

      // room objects
      isTable(roomObject) {
        return roomObject.type === 'table'
      },
      isWall(roomObject) {
        return roomObject.type === 'wall'
      },
      getRoomObjectStyle(roomObj) {
        const roomObjStyle = {
          backgroundColor: roomObj.bgColor,
          width: '100%',
          height: '100%'
        };

        if (this.isTable(roomObj)) {
          roomObjStyle.width = '100%';
          roomObjStyle.height = '100%';
          roomObjStyle.boxShadow = '0px 2px 4px rgba(131, 146, 167, 0.2)';
          roomObjStyle.borderRadius = `4px`;
        }

        return roomObjStyle
      },
      onRoomObjectSelected(roomObj) {
        console.log('room selected')
        this.selectedRoomObject = roomObj;
      },
      async onRoomObjectChanged(roomObj) {
        await cms.getModel('Room').findOneAndUpdate({_id: this.selectedRoom._id}, { roomObjects: this.selectedRoom.roomObjects })
      },

      // above spacer
      async addNewRoom() {
        await cms.getModel('Room').create({ name: 'New Room' });
        await this.loadRooms()
      },

      async changeRoomName(value) {
        this.selectedRoom.name = value
        await cms.getModel('Room').findOneAndUpdate({_id: this.selectedRoom._id}, { name: this.selectedRoom.name })
      },

      async changeTableName() {
        await cms.getModel('Room').findOneAndUpdate({_id: this.selectedRoom._id}, { roomObjects: this.selectedRoom.roomObjects })
      },

      async updateColor(color) {
        if (color === null)
          color = 'black'
        this.selectedRoomObject.bgColor = color
        await cms.getModel('Room').findOneAndUpdate(
            { 'roomObjects._id': this.selectedRoomObject._id },
            { '$set': { 'roomObjects.$.bgColor': color } })
      },

      // table info
      async duplicateTable() {
        const newTable = {
          ..._.cloneDeep(this.selectedRoomObject),
          _id: null,
          location: { x: 0, y: 0 }
        };
        console.log('duplicate table', newTable)
        await this._addNewTable(newTable)
      },
      async removeTable() {
        // TODO: Prevent serving table item
      },

      //
      async addNewWall() {
        const newWall = {
          location: { x: 0, y: 0 },
          size: { width: 300, height: 10 },
          type: 'wall',
          bgColor: 'black'
        };
        const roomObjects = [...this.selectedRoom.roomObjects, newWall]
        await cms.getModel('Room').findOneAndUpdate({_id: this.selectedRoom._id}, {roomObjects});
        this.selectedRoom.roomObjects.push(newWall)
      },
      async addNewTable() {
        const newTable = {
          name: 'New Table',
          location: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          type: 'table',
          bgColor: 'white'
        };
        await this._addNewTable(newTable)
      },
      async _addNewTable(table) {
        const roomObjects = [...this.selectedRoom.roomObjects, table]
        await cms.getModel('Room').findOneAndUpdate({_id: this.selectedRoom._id}, {roomObjects});
        this.selectedRoom.roomObjects.push(table)
      },

      goBack() {
        // TODO: ...
      }
    },
    created() {
      this.loadRooms()
      this.timeInterval = setInterval(() => this.now = dayjs().format('HH:mm'), 1000)
    },
    beforeDestroy() {
      clearInterval(this.timeInterval)
    },
  }
</script>
<style scoped lang="scss">
  .edit-table-plan {
    &__add-new-room-btn {
      border: 1px dashed;
      width: 100%;

      &-wrapper {
        padding: 7px;
        background-color: #F7F7F7;
      }
    }
  }


  .room__object__content {
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
</style>


<!--&:before {-->
<!--  content: '';-->
<!--  width: 50px;-->
<!--  height: 50px;-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  right: 0;-->
<!--  background-color: #0ECBEE;-->
<!--  transform: translate(50%, -50%) rotate(45deg);-->
<!--  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1398);-->
<!--}-->
