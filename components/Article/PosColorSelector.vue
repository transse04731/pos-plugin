<template>
  <g-grid-select :grid="false" :items="buttonColors" v-model="selectedColor">
    <template #default="{toggleSelect, item, index}">
      <g-btn :background-color="item.value" :key="index" :ripple="false" @click="toggleSelect(item)" style="margin-right: 17px; box-shadow: none; border-radius: 50%; width: 38px; min-width: 38px;height: 38px; border: 1px solid #D2D2D2;"></g-btn>
    </template>
    <template #selected="{toggleSelect, item, index}">
      <g-badge :badge-size="12" overlay style="margin-right: 17px;">
        <template v-slot:badge>
          <g-icon>done</g-icon>
        </template>
        <g-btn :background-color="item.value" :class="activeClass" @click="toggleSelect(item)" style="box-shadow: none; border-radius: 50%; width: 38px; min-width: 38px; height: 38px;">
          {{item.optionTitle}}
        </g-btn>
      </g-badge>
    </template>
  </g-grid-select>
</template>

<script>


  import GGridSelect from 'pos-vue-framework/src/components/GGridSelect/GGridSelect';
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GBadge from 'pos-vue-framework/src/components/GBadge/GBadge';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  export default {
    name: 'PosColorSelector',
    components: { GIcon, GBadge, GBtn, GGridSelect },
    data: () => ({
      selectedColor: null,
      activeClass: 'color-select-active',
      buttonColors: [
        {
          id: 1,
          text: 'black',
          value: 'black'
        },
        {
          id: 2,
          text: 'purple',
          value: 'purple'
        },
        {
          id: 3,
          text: 'green',
          value: 'green'
        },
        {
          id: 4,
          text: 'blue',
          value: 'blue'
        },
        {
          id: 5,
          text: 'violet',
          value: 'violet'
        },
        {
          id: 6,
          text: 'red',
          value: 'red'
        },
        {
          id: 7,
          text: 'brown',
          value: 'brown'
        },
      ],
    })
  }
</script>

<style lang="scss" scoped>
  ::v-deep .g-badge {
    background-color: #1271FF !important;
    width: 12px;
    min-width: 12px;
    left: 20px;
    top: 5px;

    .g-icon {
      font-size: 10px !important;
      font-weight: bold;
    }
  }

  .color-select-active {
    border: 2px solid #1271FF;
  }
</style>
