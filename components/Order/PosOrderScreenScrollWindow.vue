<template>
  <div class="main">
    <g-scroll-window area="window" :show-arrows="false" v-model="activeProductWindow" elevation="0">
      <g-scroll-window-item v-for="(items, i) in listProducts" :key="i">
        <g-btn v-for="(item, i) in items" :key="i" flat :background-color="item.color" height="100%">{{item.title}}</g-btn>
      </g-scroll-window-item>
    </g-scroll-window>
    <g-item-group area="delimiter" :items="listProducts" v-model="activeProductWindow" :return-object="false" mandatory>
      <template v-slot:default="{ toggle, active }">
        <template v-for="(item, index) in listProducts">
          <g-item :is-active="active(item)" :key="index">
            <g-btn @click="toggle(item)"></g-btn>
          </g-item>
        </template>
      </template>
    </g-item-group>
  </div>
</template>

<script>
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GScrollWindow from 'pos-vue-framework/src/components/GWindow/GScrollWindow';
  import GScrollWindowItem from 'pos-vue-framework/src/components/GWindow/GScrollWindowItem';
  import GItemGroup from 'pos-vue-framework/src/components/GItemGroup/GItemGroup';
  import GItem from 'pos-vue-framework/src/components/GItemGroup/GItem';

  export default {
    name: 'PosOrderScreenScrollWindow',
    components: { GItem, GItemGroup, GScrollWindowItem, GScrollWindow, GBtn },
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    injectService: ['PosStore:activeProductWindow', 'PosStore:listProducts'],
  }
</script>

<style scoped lang="scss">
  .main {
    padding: 6px 6px 0 6px;
    overflow: hidden;

    .g-window {
      width: 100%;

      .g-window__container {
        height: 100%;
      }

      .g-window-item,
      .g-scroll-window-item {
        height: 100%;
        display: grid;
        grid-template-rows: repeat(7, 1fr);
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 6px;
      }
    }

    .g-item-group {
      align-items: center;
      justify-content: center;

      .g-btn {
        width: 8px !important;
        height: 8px !important;
        border-radius: 50%;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 6px;
        box-shadow: none;
        background-color: #E0E0E0 !important;
      }

      .g-item__active .g-btn {
        background-color: #2196F3 !important;
      }
    }
  }
</style>