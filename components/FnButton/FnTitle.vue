<template>
  <div style="padding: 12px 12px 8px 13px">
    <p class="title">Functions</p>
    <p-o-s-select :items="items"
                  clearable
                  item-Text="text"
                  placeholder="Select"
                  v-model="selectedButton"
    >
    </p-o-s-select>
  </div>
</template>

<script>
  import POSSelect from '../pos-shared-components/POSInput/PosSelect';

  export default {
    name: 'FnTitle',
    components: { POSSelect },
    data: () => ({
      selectedButton: null,
      items: [
        { text: 'Jason Oner', subtitle: 'Jason the ant', value: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        { text: 'Ranee Carlson', value: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        { text: 'Cindy Baker', value: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
        { text: 'Ali Connors', value: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
      ],
    })
  }
</script>

<style lang="scss" scoped>

  ::v-deep .g-select .g-menu--activator .g-tf-wrapper {
    margin: 8px 0 0 0;
  }

  .title {
    font-size: 13px;
    line-height: 16px;
  }
</style>
