<template>
  <div class="room"
       @mousemove.prevent.stop="onMouseMove"
       @mouseup.prevent.stop="e => onMouseUp(e)"
       @touchmove.prevent.stop="onMouseMove"
       @touchend.prevent.stop="e => onMouseUp(e)"
       ref="room">
    <div v-for="(roomObject, index) in roomObjects"
         :key="index"
         @mousedown.prevent.stop="e => onMouseDown(e, roomObject, actions.move)"
         @touchstart.prevent.stop="e => onMouseDown(e, roomObject, actions.move)"
         :style="getRoomObjectContainerStyle(roomObject)">
      <slot name="room-object" v-bind:roomObject="roomObject"/>
      <div v-if="(selectingObj === roomObject) && inEditMode"
           @mousedown.prevent.stop="e => onMouseDown(e, roomObject, actions.resize)"
           @touchstart.prevent.stop="e => onMouseDown(e, roomObject, actions.resize)"
           class="room__object__resizer" >
        <img src="/plugins/pos-plugin/assets/resize.svg" draggable="false"/>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import * as mouseEventUtil from '../../utils/mouseEventUtil'

  export default {
    name: 'Room',
    props: {
      name: String,
      mode: String, // view | edit
      edge: {
        type: Number,
        default: 6
      },
      roomObjects: Array, // table and wall
      roomObjectContainerStyle: Object
    },
    data: function () {
      return {
        selectingObj: null,
        // define a list of action available
        actions: {
          move: this.moveAction,
          resize: this.resizeAction,
        },
        action: null, // current action -- see list of available action above
        lastPos: null, // store last mouse clientX, Y position which already handled by "applyChange throttle"
      }
    },
    computed: {
      inEditMode() {
        return this.mode === 'edit'
      }
    },
    created() {
      this.applyChange = _.throttle(e => {
        const change = {
          offsetX: e.clientX - this.lastPos.x,
          offsetY: e.clientY - this.lastPos.y };

        if (change.offsetX === 0 && change.offsetY === 0)
          return;

        this.action(change);

        // update last position
        this.lastPos = { x: e.clientX, y: e.clientY }
      }, 20)
    },
    methods: {
      // styling stuff
      getRoomObjectContainerStyle(roomObj) {
        let style = {
          position: 'absolute',
          left: `${roomObj.location.x}px`,
          top: `${roomObj.location.y}px`,
          width: `${roomObj.size.width}px`,
          height: `${roomObj.size.height}px`,
          transform: `rotate(${roomObj.rotate}deg)`,
          transformOrigin: '50% 50%',
          border: '1px solid transparent',
          cursor: 'pointer'
        };

        if ((this.selectingObj === roomObj) && this.inEditMode) {
          style.border = '1px solid #1271FF'
        }

        if (this.roomObjectContainerStyle) {
          style = {
            ...style,
            ...this.roomObjectContainerStyle
          }
        }

        return style
      },
      // action trigger
      onMouseDown(e, roomObject, action) {
        this.selectingObj = roomObject;
        this.action = action;
        mouseEventUtil.normalizeEvent(e);
        if (this.inEditMode) {
          this.lastPos = { x: e.clientX, y: e.clientY };
          this.$emit('selectroomobject', roomObject)
        } else {
          this.$emit('selectroomobject', roomObject)
        }
      },
      onMouseMove(e) {
        mouseEventUtil.normalizeEvent(e);
        if (this.action)
          this.applyChange(e)
      },
      onMouseUp(e) {
        // clear the action
        if (this.action) {
          this.$emit('roomobjectchanged', this.selectingObj);
          this.action = null
        }
      },
      // actions
      moveAction(change) {
        this.selectingObj.location.x += change.offsetX;
        this.selectingObj.location.y += change.offsetY;
        // prevent out of bound
        if (this.selectingObj.location.x < 0)
          this.selectingObj.location.x = 0;
        if (this.selectingObj.location.y < 0)
          this.selectingObj.location.y = 0;
        const viewportRect = this.$refs['room'].getBoundingClientRect();
        if (this.selectingObj.location.x + this.selectingObj.size.width > viewportRect.width)
          this.selectingObj.location.x = viewportRect.width - this.selectingObj.size.width;
        if (this.selectingObj.location.y + this.selectingObj.size.height > viewportRect.height)
          this.selectingObj.location.y = viewportRect.height - this.selectingObj.size.height
      },
      resizeAction(change) {
        this.selectingObj.size.width += change.offsetX;
        this.selectingObj.size.height += change.offsetY;
      }
    }
  }
</script>
<style scoped lang="scss">
  .room {
    position: relative;
    background-image: url('/plugins/pos-plugin/assets/background.png');

    &__object__resizer {
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background-color: #2979FF;
      position: absolute;
      right: 0;
      bottom: 0;
      transform: translate(100%, 100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__object__rotate {
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background-color: #2979FF;
      position: absolute;
      right: 0;
      bottom: 0;
      transform: translateX(100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
