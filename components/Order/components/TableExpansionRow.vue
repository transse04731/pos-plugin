<template>
  <fragment>
    <tr v-for="item in formattedProducts"
        :class="{'g-expansion': true, 'g-expansion__active': isActive(item)}">
      <td>
        <div :class="{'g-expansion-header': true, 'g-expansion-header__active': isActive(item)}"
             @click="toggle(item)">
          <div class="flex-grow-1 pa-2">
            <p style="font-size: 15px">
              {{item.name}}
            </p>
            <p class="attributes"><span v-if="item.attributes">{{getAttributes(item)}}</span></p>
          </div>
          <span class="w-10 pa-2 ta-center">{{item.unit}}</span>
          <span class="w-10 pa-2 ta-right">{{item.quantity}}</span>
          <div :class="{'w-12 pa-2 ta-right': true, ...item['price'] !== item['originalPrice'] && {'text__editted': true}}">
            <p>{{item.price}}</p>
            <p class="promotion-price" v-if="item.discount > 0">{{item.originalPrice}}</p>
          </div>
          <div :class="{'w-12 pa-2 ta-right': true,
          ...item.price !== item.originalPrice && {'text-light-green': true}}">
            <p class="fw-700">{{item.total}}</p>
            <p class="promotion-price" v-if="item.discount > 0">{{item.originalTotal}}</p>
          </div>
        </div>

        <g-expand-transition>
          <div :class="{'g-expansion-content': true, 'g-expansion-content__active': isActive(item)}" v-show="isActive(item)">
            <div class="col-4 row-flex">
              <div class="col-4 row-flex align-items-center justify-center">
                <g-btn icon small text-color="#1d1d26" style="margin: 8px 0" @click.stop="onDecreaseQuantityClick(item)">
                  <g-icon>remove_circle_outline</g-icon>
                </g-btn>
              </div>
              <div class="col-4 row-flex align-items-center justify-center fs-large">
                <div class="w-80 row-flex align-items-center justify-center b-blue-accent-3 text-blue-accent-1 bg-white ba-thin" style="height: 32px">
                  {{item.quantity}}
                </div>
              </div>
              <div class="col-4 row-flex align-items-center justify-center">
                <g-btn icon small text-color="#1d1d26" style="margin: 8px 0" @click.stop="onIncreaseQuantityClick(item)">
                  <g-icon>add_circle_outline</g-icon>
                </g-btn>
              </div>
            </div>
            <div style="flex-grow: 1"></div>
            <g-btn text small text-color="#f44336" style="margin: 8px 0; letter-spacing: 0; font-size: 14px"
                   @click.stop="onDecreaseQuantityClick(item, true)">
              <g-icon small class="mr-2">remove_circle</g-icon>
              Remove item
            </g-btn>
          </div>
        </g-expand-transition>
      </td>
    </tr>
  </fragment>
</template>

<script>
  import { getExpansionModel } from 'pos-vue-framework/src/components/GExpansion/GExpansionFactory';
  import { computed } from '@vue/composition-api'

  export default {
    name: 'TableExpansionRow',
    props: {
      items: Array,
      mandatory: Boolean,
      multiple: Boolean,
      value: null,

      itemHeader: {
        default: 'header',
        type: [String, Function]
      },
      itemContent: {
        default: 'content',
        type: [String, Function]
      }
    },
    setup(props, context) {
      const { toggleItem, isActiveItem } = getExpansionModel(props, context)

      const formattedProducts = computed(() => props.items.map(item => ({
        ...item,
        originalTotal: (item.quantity * item.originalPrice).toFixed(2),
        total: (item.quantity * item.price).toFixed(2)
      })))

      const getAttributes = item => {
        let attrStringArr
        if (item.attributes) attrStringArr = item.attributes.map(attr => `${attr.key}: ${attr.value}`)
        if (attrStringArr) return attrStringArr.join(', ')
      }
      const getItem = item => props.items[formattedProducts.value.indexOf(item)]
      const isActive = item => isActiveItem(getItem(item))
      const toggle = item => toggleItem(getItem(item))

      const onDecreaseQuantityClick = (item, remove = false) => context.emit(`click:remove`, getItem(item), remove)
      const onIncreaseQuantityClick = item => context.emit(`click:add`, getItem(item))

      return {
        getItem,
        isActive,
        toggle,
        formattedProducts,
        getAttributes,
        onIncreaseQuantityClick,
        onDecreaseQuantityClick
      }
    }
  }
</script>

<style lang="scss" scoped>
  .g-expansion-group {
    display: table-row-group;
  }

  .g-expansion-header {
    display: flex;
    color: #1c1c1c;
    line-height: 1.75;

    &__active {
      background-color: #2979FF;
      color: white
    }

    .attributes {
      color: #979797;
      text-transform: capitalize;
    }

    .promotion {
      color: #979797;
      margin-left: 8px;
      line-height: 1;

      &-price {
        color: #979797;
        text-decoration: line-through;
        margin-top: 4px;
        line-height: 1;
      }
    }
  }

  .g-expansion-content {
    display: flex;
    background-color: #BBDEFB;
    transition-duration: 0.25s;
  }
</style>
