<template>
  <g-grid-select :grid="false" :items="values" :value="internalColor" @input="updateColor" style="padding: 5px">

    <template #default="{toggleSelect, item, index}">
      <div style="margin-right: 5px">
        <div :key="index" :ripple="false" :style="getColorItemStyle(item)" @click="toggleSelect(item)"/>
      </div>
    </template>

    <template #selected="{toggleSelect, item, index}">
      <div :style="`margin-right: 5px`">
        <g-badge :badge-size="badgeSize" overlay nudge-top="-2" nudge-right="-2">
          <template v-slot:badge>
            <g-icon color="#FFF">done</g-icon>
          </template>
          <div :key="index" :ripple="false" :style="getColorItemStyle(item)" @click="toggleSelect(item)"/>
        </g-badge>
      </div>
    </template>

  </g-grid-select>
</template>

<script>

  export default {
    name: 'ColorSelector',
    props: {
      value: String,
      values: {
        type: Array,
        default: () => [
          { id: 1, text: '#FBE4EC', value: '#FBE4EC' },
          { id: 2, text: '#CE93D8', value: '#CE93D8' },
          { id: 3, text: '#B2EBF2', value: '#B2EBF2' },
          { id: 4, text: '#C8E6C9', value: '#C8E6C9' },
          { id: 5, text: '#DCE775', value: '#DCE775' },
          { id: 6, text: '#FFF59D', value: '#FFF59D' },
          { id: 7, text: '#FFCC80', value: '#FFCC80' },
          { id: 8, text: '#FFAB91', value: '#FFAB91' },
        ]
      },
      itemSize: {
        type: [Number, String],
        default: 38
      },
      badgeSize: {
        type: Number,
        default: 12,
      },
      itemBorderColor: {
        type: String,
        default: '#D2D2D2'
      }
    },
    data: function () {
      return {
        internalColor: this.value
      }
    },
    methods: {
      updateColor(color) {
        this.internalColor = color
        this.$emit('input', color)
      },
      getColorItemStyle(item) {
        const itemSelected = this.internalColor === item.value
        return {
          boxShadow: 'none',
          width: `${this.itemSize}px`,
          minWidth: `${this.itemSize}px`,
          height: `${this.itemSize}px`,
          border: `${itemSelected? 2 : 1}px solid ${ itemSelected ? '#1271FF' : '#D2D2D2'}`,
          backgroundColor: item.value,
          borderRadius: '100%'
        };
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .g-badge {
    background-color: #1271FF !important;
    width: 12px;
    min-width: 12px;

    .g-icon {
      font-size: 10px !important;
      font-weight: bold;
    }
  }
</style>
