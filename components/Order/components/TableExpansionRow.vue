<template>
  <fragment>
    <tr v-for="(item, index) in formattedProducts" :key="index"
        class="g-expansion"
        :ref="`row_${index}`"
    >
      <td>
        <div class="g-expansion-header"
             @click="toggle(item)">
          <div class="flex-grow-1 pa-2">
            <p style="font-size: 15px">
              {{item.name}}
            </p>
            <p class="attributes"><span v-if="item.attributes">{{item.attributes}}</span></p>
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

        <div class="g-expansion-content">
          <div class="col-4 row-flex">
            <div class="col-4 row-flex align-items-center justify-center">
              <g-btn :uppercase="false" icon small text-color="#1d1d26" style="margin: 8px 0" @click.stop="onDecreaseQuantityClick(item)">
                <g-icon>remove_circle_outline</g-icon>
              </g-btn>
            </div>
            <div class="col-4 row-flex align-items-center justify-center fs-large">
              <div class="w-80 row-flex align-items-center justify-center b-blue-accent-3 text-blue-accent-1 bg-white ba-thin" style="height: 32px">
                {{item.quantity}}
              </div>
            </div>
            <div class="col-4 row-flex align-items-center justify-center">
              <g-btn :uppercase="false" icon small text-color="#1d1d26" style="margin: 8px 0" @click.stop="onIncreaseQuantityClick(item)">
                <g-icon>add_circle_outline</g-icon>
              </g-btn>
            </div>
          </div>
          <div style="flex-grow: 1"></div>
          <g-btn :uppercase="false" text small text-color="#f44336" style="margin: 8px 0; letter-spacing: 0; font-size: 14px"
                 @click.stop="onDecreaseQuantityClick(item, true)">
            <g-icon small class="mr-2">remove_circle</g-icon>
            Remove item
          </g-btn>
        </div>
      </td>
    </tr>
  </fragment>
</template>

<script>
  import { computed, onMounted, onUpdated } from '@vue/composition-api'
  import _ from 'lodash'

  export default {
    name: 'TableExpansionRow',
    props: {
      items: Array
    },
    setup: function (props, context) {
      let posStore

      const formattedProducts = computed(() => props.items.map(item => ({
        ..._.omit(item, 'attributes'),
        attributes: getAttributes(item),
        originalTotal: (item.quantity * item.originalPrice).toFixed(2),
        total: (item.quantity * item.price).toFixed(2)
      })))

      const getAttributes = item => {
        if (!item.attributes) return
        const attrStringArr = item.attributes.map(attr => `${attr.key}: ${attr.value}`)
        return attrStringArr.join(', ')
      }

      const getItem = item => props.items[formattedProducts.value.indexOf(item)]

      const toggle = item => {
        const index = formattedProducts.value.indexOf(item)
        if (index === posStore.activeTableProduct) {
          posStore.activeTableProduct = undefined
        } else if (!_.isNil(index)) {
          posStore.activeTableProduct = index
        }
      }

      const onDecreaseQuantityClick = (item, remove = false) => context.emit(`click:remove`, getItem(item), remove)
      const onIncreaseQuantityClick = item => context.emit(`click:add`, getItem(item))

      onMounted(function () {
        posStore = this.$getService('PosStore')
        posStore.$watch('activeTableProduct', (newValue, oldValue) => {
          if (!_.isNil(newValue) && newValue > -1 && this.$refs[`row_${newValue}`].length > 0) {
            this.$refs[`row_${newValue}`][0].classList.add('g-expansion__active')
          }
          if (!_.isNil(oldValue) && oldValue > -1 && this.$refs[`row_${oldValue}`].length > 0) {
            this.$refs[`row_${oldValue}`][0].classList.remove('g-expansion__active')
          }
        })
      })

      return {
        toggle,
        formattedProducts,
        onIncreaseQuantityClick,
        onDecreaseQuantityClick
      }
    }
  }
</script>

<style lang="scss" scoped>
  .g-expansion {
    .g-expansion-header {
      display: flex;
      color: #1c1c1c;
      line-height: 1.75;

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
      display: none;
    }
  }

  .g-expansion__active {
    .g-expansion-header {
      background-color: #2979FF;
      color: white
    }

    .g-expansion-content {
      display: flex;
      background-color: #BBDEFB;
      transition-duration: 0.25s;
    }
  }

</style>
