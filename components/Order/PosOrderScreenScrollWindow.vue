<template>
  <div class="main">
    <scroll-window area="window" :show-arrows="false" elevation="0"
                   v-for="(productsList, category) in scrollWindowProducts"
                   style="display: none"
                   :key="`window_${category}`"
                   :ref="`window_${category}`"
                   :value="activeProductWindows[category]"
    >
      <scroll-window-item v-for="(window, windowIndex) in productsList"
                          :key="`${category}_window_item_${windowIndex}`"
                          @input="activeProductWindows[category] = $event"
      >
        <g-btn :uppercase="false" flat
               v-for="(item, i) in window"
               :key="`btn_${i}`"
               :background-color="(item.layouts.length > 0 && item.layouts[0].color)|| '#FFF'"
               :style="[!item.layouts[0] || item.layouts[0].color === 'white' ? {border: '1px solid #979797'}: null]"
               height="100%"
               @click="addProduct(item)"
        >
          {{item.name}}
        </g-btn>
      </scroll-window-item>
    </scroll-window>
    <g-item-group area="delimiter"
                  :return-object="false" mandatory
                  v-for="(productsList, category) in scrollWindowProducts"
                  v-model="activeProductWindows[category]"
                  :key="`group_${category}`"
                  :ref="`group_${category}`"
                  :items="productsList"
                  style="display: none"
    >
      <template #default="{ toggle, active }">
        <g-item v-for="(item, index) in productsList"
                :is-active="active(item)"
                :key="`${category}_item_${index}`"
        >
          <g-btn :uppercase="false" @click="toggle(item)" border-radius="50%"></g-btn>
        </g-item>
      </template>
    </g-item-group>
  </div>
</template>

<script>
  import _ from 'lodash'
  import GScrollWindow from 'pos-vue-framework/src/components/GWindow/GScrollWindow';
  import GScrollWindowItem from 'pos-vue-framework/src/components/GWindow/GScrollWindowItem';

  export default {
    name: 'PosOrderScreenScrollWindow',
    components: {
      scrollWindow: {
        name: 'ScrollWindow',
        mixins: [GScrollWindow],
        mounted() {
          this.$forceUpdate = () => null
        }
      },
      scrollWindowItem: {
        name: 'ScrollWindowItem',
        mixins: [GScrollWindowItem],
        mounted() {
          this.$forceUpdate = () => null
        }
      }
    },
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    injectService: ['PosStore:(addProductToOrder,scrollWindowProducts)'],
    data() {
      return {
        activeProductWindows: {}
      }
    },
    computed: {
      productWindows() {
        return _.chunk(this.listProducts, 28)
      }
    },
    methods: {
      addProduct(item) {
        this.addProductToOrder(item)
      }
    },
    created() {
      const posStore = this.$getService('PosStore');

      posStore.changeProductList = (newValue, oldValue) => {
        if (newValue) {
          const newCategory = newValue.name
          const oldCategory = oldValue && oldValue.name
          if (newCategory && this.$refs[`window_${newCategory}`]) {
            this.$refs[`window_${newCategory}`][0].$el.style.display = 'flex'
            this.$refs[`group_${newCategory}`][0].$el.style.display = 'flex'
          }

          if (oldCategory) {
            if (newCategory === oldCategory) return
            const oldRef = this.$refs[`window_${oldCategory}`];
            if (oldRef && oldRef.length > 0) {
              oldRef[0].$el.style.display = 'none'
              this.$refs[`group_${oldCategory}`][0].$el.style.display = 'none'
            }
          }
        }
      }

      if (this.scrollWindowProducts) {
        this.activeProductWindows = Object.keys(this.scrollWindowProducts).reduce((obj, key) => {
          this.$set(obj, key, 0)
          return obj
        }, {})
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
