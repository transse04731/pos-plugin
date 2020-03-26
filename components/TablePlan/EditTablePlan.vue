<template>
  <div style="display: flex; height: 100vh; width: 100vw">
    <!-- side bar -->
    <pos-dashboard-sidebar
        :items="sidebarData"
        :title="user.username"
        @toggle="onSidebarToggle"
        :default-path="defaultPath"
        :after-mount-fn="selectFirstRoom">
      <template v-slot:above-spacer>
        <!-- Add more room -->
        <div v-if="showAddNewRoomBtn"
             class="edit-table-plan__add-new-room-btn-wrapper">
          <g-btn @click="addNewRoom"
                 outlined
                 flat dashed
                 border-radius="4"
                 text-color="#2979FF"
                 class="edit-table-plan__add-new-room-btn">+ Add new room
          </g-btn>
        </div>

        <!-- Room info -->
        <div v-if="room && !roomObj" class="card-info">
          <pos-text-field v-model="room.name" label="Room name *:"
                          @input="changeRoomName"
                          @click="dialog.showRoomNameKbd = true">
            <template v-slot:append>
              <g-icon svg color="#F00">icon-keyboard-red</g-icon>
            </template>
          </pos-text-field>
          <div style="display: flex; justify-content: flex-end; margin-right: 5px">
            <g-btn @click="removeRoom" background-color="#FF4452" text-color="#FFF"><g-icon>delete</g-icon>Delete</g-btn>
          </div>
        </div>

        <!-- Room object info -->
        <div v-if="roomObj" class="card-info">
          <!-- table -->
          <template v-if="isTable(roomObj)">
            <pos-text-field v-model="roomObj.name" label="Table name: "
                            @input="changeTableName"
                            @click="dialog.showTableNameKbd = true">
              <template v-slot:append>
                <g-icon svg color="#F00">icon-keyboard-red</g-icon>
              </template>
            </pos-text-field>
            <div style="margin: 5px">
              <div> Color:</div>
              <color-selector :value="roomObj.bgColor" :colors="tableColors" @input="changeRoomObjColor" :item-size="18" :badge-size="12"/>
              <div style="display: flex; align-items: center">
                <span style="margin-right: 10px">Take away:</span>
                <g-switch v-model="roomObj.takeAway" @change="changeRoomObjTakeAway"/>
              </div>
            </div>
          </template>

          <!-- wall -->
          <template v-else-if="isWall(roomObj)">
            <div style="margin: 5px">
              <div> Color:</div>
              <color-selector :value="roomObj.bgColor" :colors="wallColors" @input="changeRoomObjColor" :item-size="18" :badge-size="12"/>
            </div>
          </template>
          <div style="display: flex; margin: 5px; justify-content: space-between">
            <g-btn @click="duplicateRoomObj" width="48%" style="font-size: 13px" outlined flat text-color="#2979FF">
              <g-icon size="13">fas fa-clone</g-icon>
              Duplicate
            </g-btn>
            <g-btn @click="removeRoomObj" width="48%" background-color="#FF4452" text-color="#FFF" style="margin-left: 5px; font-size: 13px">
              <g-icon size="13">delete</g-icon>
              Delete
            </g-btn>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <!-- Add new room object -->
        <div style="display: flex; margin: 5px; justify-content: space-between" v-if="room">
          <g-btn outlined flat @click="addNewWall" width="48%" text-color="#2979FF">+ Wall</g-btn>
          <g-btn flat @click="addNewTable" width="48%" background-color="#2979FF" text-color="#FFF">+ Table</g-btn>
        </div>

        <!-- Go back -->
        <div style="display: flex; margin: 5px; justify-content: space-between">
          <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" @click="back" style="flex: 1">
            <g-icon class="mr-2" svg>
              icon-back
            </g-icon>
            Back
          </g-btn>
        </div>
      </template>
    </pos-dashboard-sidebar>

    <!-- room view -->
    <room v-if="room"
          :name="room.name"
          :room-objects="room.roomObjects"
          editable
          @selectRoomObject="selectRoomObj"
          @roomObjectChanged="changeRoomObjUI">
      <template #room-object="{roomObject}">
        <div v-if="isTable(roomObject) || !isWall(roomObject)">
          <div>{{ roomObject.name }}</div>
        </div>
      </template>
    </room>
    <template>
      <dialog-text-filter label="Room name" v-if="room" :default-value="room.name" v-model="dialog.showRoomNameKbd" @submit="changeRoomName"/>
      <dialog-text-filter label="Table name" v-if="roomObj" :default-value="roomObj.name" v-model="dialog.showTableNameKbd" @submit="changeTableName"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import Room from './Room';
  import PosDashboardSidebar from '../Dashboard/PosDashboardSidebar';
  import DialogChangeValue from '../pos-shared-components/dialogChangeValue';
  import GButtonMerger from '../FnButton/components/GButtonMerger';
  import ColorSelector from '../common/ColorSelector';
  import PosTextField from '../pos-shared-components/POSInput/PosTextField';
  import DialogTextFilter from '../pos-shared-components/dialogFilter/dialogTextFilter';

  export default {
    name: 'EditTablePlan',
    components: { DialogTextFilter, PosTextField, ColorSelector, GButtonMerger, DialogChangeValue, PosDashboardSidebar, Room },
    injectService: ['PosStore:user'],
    props: {},
    data: function () {
      return {
        rooms: null,
        room: null,
        roomObj: null,
        tableColors: ['#FFFFFF', '#FBE4EC', '#EDE7F6', '#E1F5FE', '#FFFDE7', '#E8F5E9', '#EFEBE9', '#F5F5F5'],
        wallColors: ['#FFFFFF', '#CCCCCC', '#4D0019', '#404040', '#86592D', '#A6A6A6', '#FFD480', '#E4E4E4'],
        showAddNewRoomBtn: false,
        dialog: {
          showRoomNameKbd: false,
          showTableNameKbd: false,
        },
        defaultPath: 'item.0.item.0'
      }
    },
    computed: {
      sidebarData() {
        return [{
          title: 'Restaurant', icon: 'icon-restaurant',
          items: _.map(this.rooms, this.convertRoomToSideBarItem)
        }]
      }
    },
    methods: {
      async loadRooms() {
        this.rooms = await cms.getModel('Room').find({})
        this.showAddNewRoomBtn = true
      },
      onSidebarToggle(path, toggled) {
        // in this window, only Restaurant item is collapsible so we don't need to care about path
        // just update the visibility of Add new button depend on toggled state
        this.showAddNewRoomBtn = toggled
      },
      selectFirstRoom() {
        const firstRoom = cms.getList('Room')[0]
        if (firstRoom)
          this.$set(this, 'room', firstRoom)
      },
      convertRoomToSideBarItem(room) {
        return {
          title: room.name,
          icon: 'radio_button_unchecked',
          iconType: 'small',
          onClick: () => {
            this.room = room;
            this.roomObj = null
          }
        }
      },
      async addNewRoom() {
        const createdRoom = await cms.getModel('Room').create({ name: 'New Room' });
        this.rooms.push(createdRoom)
      },
      async removeRoom() {
        // todo: verify
        await cms.getModel('Room').remove({ _id: this.room._id })
        const roomIndex = _.findIndex(this.rooms, r => r === this.room)
        this.rooms.splice(roomIndex, 1)
      },
      async changeRoomName(name) {
        await cms.getModel('Room').findOneAndUpdate({ _id: this.room._id }, { name });
        this.room.name = name
      },

      // room object helper methods
      isTable(roomObj) {
        return roomObj.type === 'table'
      },
      isWall(roomObj) {
        return roomObj.type === 'wall'
      },

      selectRoomObj(roomObj) {
        console.log('select room')
        this.roomObj = roomObj;
      },

      // add room object
      async addNewWall() {
        await this._addRoomObj({ size: { width: 300, height: 10 }, location: { x: 0, y: 0 }, type: 'wall', bgColor: 'black' })
      },
      async addNewTable() {
        await this._addRoomObj({ size: { width: 100, height: 100 }, location: { x: 0, y: 0 }, type: 'table', bgColor: 'white', name: 'New Table', takeAway: false })
      },
      async duplicateRoomObj() {
        await this._addRoomObj({ ..._.cloneDeep(this.roomObj), _id: null, location: { x:0, y: 0 } })
      },
      async removeRoomObj() {
        if (this.isTable(this.roomObj)) {
          // do smt to check if delete is allowed
        }
        const idOfRoomObj = _.findIndex(this.room.roomObjects, ro => ro === this.roomObj);
        this.room.roomObjects.splice(idOfRoomObj, 1)
        this.roomObj = null;
        // TODO: Remove item in Array using $pull
        await cms.getModel('Room').findOneAndUpdate({ _id: this.room._id }, { roomObjects: this.room.roomObjects })
      },
      async _addRoomObj(ro) {
        // TODO: Do sth if update fail
        const result = await cms.getModel('Room').findOneAndUpdate(
            { _id: this.room._id },
            { $push: { roomObjects: ro } },
            { new : true });
        this.room.roomObjects.push(_.last(result.roomObjects))
      },

      // update room object
      async changeRoomObjTakeAway(takeAway) {
        await this._updateRoomObject({ takeAway });
      },
      async changeRoomObjColor(bgColor) {
        if (bgColor === null) bgColor = 'black';
        await this._updateRoomObject({ bgColor });
        this.roomObj.bgColor = bgColor
      },
      async changeRoomObjUI() {
        await this._updateRoomObject({
          location: this.roomObj.location,
          size: this.roomObj.size,
          bgColor: this.roomObj.bgColor,
          rotate: this.roomObj.rotate || 0
        });
      },
      async changeTableName(name) {
        await this._updateRoomObject({name});
        this.roomObj.name = name
      },

      async _updateRoomObject(change) {
        const qry = { 'roomObjects._id': this.roomObj._id }

        const setObj = {}
        _.each(_.keys(change), k => setObj[`roomObjects.$.${k}`] = change[k]);
        const set =  { $set: setObj }

        // console.log('update', qry, 'set', set)
        await cms.getModel('Room').findOneAndUpdate(qry, set)
      },

      back() {
        // TODO: Use go back instead
        // Issue: go back return exactly previous page (Dashboard -> Functions)
        // but the problem is it doesn't refresh the UI
        // so in case we add or remove room, the change will not be updated
        // in Dashboard page
        this.$router.push('/view/pos-dashboard')
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

  .card-info {
    margin: 5px;
    padding-bottom: 13px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1398);
    border-radius: 4px;
  }

  .keyboard {
    position: absolute;
    bottom: 0;
    background-color: #efefef;
    padding: 8px;
    width: 100%;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15);
    z-index: 1;
  }
</style>
