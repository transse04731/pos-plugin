<template>
  <div>
    <g-grid-select :grid="true" :items="buttonGroupItems" multiple v-model="selectedButtons">
      <template #default="{ toggleSelect, item, index }">
        <g-btn :ripple="false" @click="toggleSelect(item)" style="width: 100%; height: 50px;  border: 1px solid #979797; box-shadow: none">
          {{item.text}}
        </g-btn>
      </template>
      <template #selected="{ toggleSelect, item, index }">
        <g-btn :ripple="false" @click="toggleSelect(item)" style="width: 100%; height: 50px;  border: 2px solid #1271FF; box-shadow: none">{{item.text}}
        </g-btn>
      </template>
    </g-grid-select>
  </div>
</template>

<script>
  import GGridSelect from 'pos-vue-framework/src/components/GGridSelect/GGridSelect';
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  export default {
    name: 'FnButtonChooser',
    components: { GBtn, GGridSelect },
    data: () => ({
      buttonGroupItems: [
        { area: 'btn-1', disabled: true, text: 'Note', value: 'Note' },
        { area: 'btn-2', disabled: false, text: 'F5', value: 'F5' },
        { area: 'btn-3', disabled: true, text: '', value: '1' },
        { area: 'btn-4', disabled: true, text: '', value: '2' },
        { area: 'btn-5', disabled: false, text: 'F1', value: 'F1' },
        { area: 'btn-6', disabled: false, text: 'F2', value: 'F2' },
        { area: 'btn-7', disabled: false, text: 'F3', value: 'F3' },
        { area: 'btn-8', disabled: false, text: 'F4', value: 'F4' },
      ],
      selectedButtons: [],
    })
  }
</script>

<style lang="scss" scoped>
  ::v-deep .g-row .g-col {
    padding: 2.5px !important;
  }
</style>
