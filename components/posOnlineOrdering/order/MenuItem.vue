<template>
  <div class="po-menu-item">
    <img v-if="image" alt draggable="false" :src="image" class="po-menu-item__thumbnail"/>
    <img v-else alt draggable="false" src="/plugins/pos-plugin/assets/empty_dish.svg" class="po-menu-item__thumbnail"/>
    <div class="po-menu-item__content">
      <div class="po-menu-item__name">{{ name }}</div>
      <div class="po-menu-item__desc">{{ desc }}</div>
      <div class="po-menu-item__prices--under">
        <div :class="price2 && 'po-menu-item__prices--discount'"> {{ price | currency }}</div>
        <div v-if="price2"> {{ price2 | currency }}</div>
      </div>
    </div>
    <g-spacer/>
    <div class="po-menu-item__prices">
      <div :class="price2 && 'po-menu-item__prices--discount'"> {{ price | currency }}</div>
      <div v-if="price2">{{ price2 | currency }}</div>
    </div>
    <g-icon @click="addToOrder" v-if="isOpening"
            size="28" color="#424242"
           class="po-menu-item__add">
      add_circle
    </g-icon>
    <div class="po-menu-item__action" v-if="isOpening">
      <g-icon @click="addToOrder" v-if="quantity === 0"
              size="28" color="#424242">
        add_circle
      </g-icon>
      <template v-else>
        <g-icon @click.stop="decreaseQuantity" color="#424242" size="28">remove_circle_outline</g-icon>
        <span style="margin-left: 4px; margin-right: 4px">{{quantity}}</span>
        <g-icon @click.stop="increaseQuantity" color="#424242" size="28">add_circle</g-icon>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MenuItem',
    props: {
      _id: String,
      image: String,
      name: String,
      desc: String,
      price: [Number, String],
      price2: [Number, String],
      quantity: Number,
      currencyUnit: String,
      isOpening: Boolean,
    },
    filters: {
      currency(val) {
        return $t('common.currency') + val.toFixed(2)
      }
    },
    methods: {
      addToOrder() {
        this.$emit('menu-item-selected', this._id)
      },
      decreaseQuantity() {
        this.$emit('decrease', this._id)
      },
      increaseQuantity() {
        this.$emit('increase', this._id)
      }
    }
  }
</script>
<style scoped lang="scss">
  .po-menu-item {
    display: flex;
    align-items: flex-start;
    padding-top: 8px;
    height: 80px;
    
    &__thumbnail {
      border-radius: 15px;
      margin-right: 18px;
      width: 60px;
      height: 60px;
    }
    
    &__name {
      font-weight: bold;
      font-size: 15px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 350px;
    }

    &__content {
      margin-right: 16px;
    }
    
    &__desc {
      font-size: 13px;
      color: #757575;
      max-width: 350px;
      word-break: break-word;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    &__prices {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      font-size: 18px;
      color: #2979ff;
      font-weight: 700;

      &--discount {
        font-size: 14px;
        font-weight: 400;
        color: #757575;
        text-decoration: line-through;
      }

      &--under {
        display: none;
        font-size: 14px;
        color: #2979ff;
        font-weight: 700;
        margin-top: 4px;
      }
    }
    
    &__add {
      margin-left: 10px;
      margin-right: 30px;
    }

    &__action {
      display: none;
    }

    .g-icon {
      -webkit-tap-highlight-color: transparent;
    }
  }

  @media screen and (max-width: 1040px) {
    .po-menu-item {
      &__content {
        line-height: 1.2;
      }

      &__name {
        font-size: 14px;
      }

      &__desc {
        font-size: 13px;
      }

      &__prices {
        display: none;

        &--under {
          display: flex;
        }
      }

      &__add {
        display: none;
      }

      &__action {
        flex: 0 0 85px;
        display: flex;
        align-self: flex-end;
        margin-bottom: 8px;
        justify-content: flex-end;

        & > span {
          min-width: 20px;
          text-align: center;
          line-height: 28px;
        }
      }
    }
  }
</style>
