<template>
  <div class="main">
    <g-scroll-window area="window" :show-arrows="false" elevation="0" v-model="activeProductWindow">
      <g-scroll-window-item v-for="(window, windowIndex) in productWindows" :key="windowIndex">
        <g-btn v-for="(item, i) in window" :key="i"
               flat
               :background-color="item.layouts[0].color"
               height="100%"
               @click="addProductToOrder(item)"
               :style="{order: getProductGridOrder(item)}"
        >
          {{item.name}}
        </g-btn>
      </g-scroll-window-item>
    </g-scroll-window>
    <g-item-group area="delimiter" :items="productWindows" v-model="activeProductWindow" :return-object="false" mandatory>
      <template v-slot:default="{ toggle, active }">
        <template v-for="(item, index) in productWindows">
          <g-item :is-active="active(item)" :key="index">
            <g-btn @click="toggle(item)" border-radius="50%"></g-btn>
          </g-item>
        </template>
      </template>
    </g-item-group>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'PosOrderScreenScrollWindow',
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    injectService: ['PosStore:(activeCategoryProducts,addProductToOrder,getProductGridOrder)'],
    data() {
      return {
        activeProductWindow: 0,
      }
    },
    computed: {
      productWindows() {
        return _.chunk(this.activeCategoryProducts, 28)
      }
    }
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
        margin-right: 6px;
      }
    }

    .g-item-group {
      align-items: center;
      justify-content: center;

      .g-btn {
        width: 8px !important;
        height: 8px !important;
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