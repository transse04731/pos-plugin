<template>
  <div class="po-menu-item">
    <img draggable="false" :src="img || sampleImg" class="po-menu-item__thumbnail"/>
    <div>
      <div class="po-menu-item__name">{{ name }}</div>
      <div class="po-menu-item__desc">{{ desc || dummyText }}</div>
    </div>
    <g-spacer/>
    <div class="po-menu-item__prices">
      <div :style="priceStyle"> {{ price | currency }}</div>
      <div v-if="price2" :style="price2Style"> {{ price2 | currency }}</div>
    </div>
    <g-btn rounded icon
           max-height="25"
           max-width="25"
           @click="$emit('menu-item-selected', _id)"
           class="po-menu-item__add">
      <g-icon>add</g-icon>
    </g-btn>
  </div>
</template>
<script>
  export default {
    name: 'MenuItem',
    props: {
      _id: String,
      img: String,
      name: String,
      desc: String,
      price: [Number, String],
      price2: [Number, String]
    },
    filters: {
      currency: function(value) {
        return '$' + value
      }
    },
    computed: {
      priceStyle() {
        return this.price2 ? this.originalPriceStyle : this.discountedPriceStyle
      },
      price2Style() {
        if (this.price2) return this.discountedPriceStyle
      }
    },
    data() {
      return {
        sampleImg: '/plugins/pos-plugin/assets/images/product.png',
        dummyText: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been...',
        currencyUnit: '$',
        originalPriceStyle: {
          'font-family': 'Muli',
          'font-style': 'italic',
          'font-weight': 'normal',
          'font-size': '14px',
          'line-height': '18px',
          'text-decoration-line': 'line-through',
          'color': '#757575'
        },
        discountedPriceStyle: {
          'font-family': 'Muli',
          'font-style': 'italic',
          'font-weight': 'bold',
          'font-size': '18px',
          'color': '#2979FF'
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .po-menu-item {
    display: flex;
    align-items: center;
    height: 95px;
    border-bottom: 1px solid #424242;
    
    &__thumbnail {
      border-radius: 15px;
      margin-right: 18px;
      max-width: 66px;
      max-height: 66px;
    }
    
    &__name {
      font-family: Muli;
      color: #000000;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 23px;
    }
    
    &__desc {
      font-family: Muli;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #757575;
      max-width: 350px;
    }
    
    &__prices {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
    
    &__add {
      margin-left: 10px;
      margin-right: 30px;
      box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1398);
    }
  }
</style>
