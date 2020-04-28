<template>
  <div class="kitchen-report-main-container">
    <div class="header" :style="wrapperStyle">
      <div style="text-align: center; font-size: 40px; margin: 20px 0">Liefer #{{orderNumber}}</div>
    </div>
    <div class="info">
      <div>{{customerName}}</div>
      <div>{{customerAddress}}</div>
      <div>{{customerZipCode}}</div>
      <div>{{customerPhone}}</div>
      <div>{{note}}</div>
    </div>
    <div class="divider-dashed"/>
    <div class="kitchen-items">
      <div v-for="item in items">
        <div class="kitchen-item" :style="{fontSize: computedFontSize}">
          {{`${item.id} x ${item.quantity}. ${item.name}`}}
        </div>
      </div>
    </div>
    <div class="divider-dashed"/>
    <div class="footer text-center">{{date}}</div>
  </div>
</template>

<script>
  export default {
    name: 'KitchenDelivery',
    props: {
      orderNumber: [String, Number],
      items: Array,
      date: String,
      fontSize: Number,
      marginTop: Number,
      customerName: String,
      customerPhone: String,
      customerAddress: String,
      customerZipCode: String,
      note: String,
      orderSum: Number
    },
    filters: {
      convertMoney(value) {
        return !isNaN(value) ? value.toFixed(2) : value
      }
    },
    computed: {
      wrapperStyle() {
        return { marginTop: `${Math.floor((this.marginTop || 0) * 71)}px` }
      },
      computedFontSize() {
        if (this.fontSize === 1) {
          return `${(this.fontSize - 1) * 5 + 40}px`
        }
        if (this.fontSize === 2) {
          return `${(this.fontSize - 1) * 5 + 50}px`
        }
        if (this.fontSize === 3) {
          return `${(this.fontSize - 1) * 5 + 60}px`;
        }
        return '40px'
      }
    }
  }
</script>

<style lang="scss">
  .kitchen-report-main-container {
    width: 100%;
    padding: 0;
    background-color: #ffffff;
    font-family: Verdana, sans-serif;
    font-style: normal;
    box-sizing: border-box;

    p {
      margin: 0;
    }

    .bold {
      font-weight: bold;
    }

    .text-center {
      text-align: center;
    }

    .text-end {
      text-align: end;
    }

    .divider {
      font-size: 25px;
      border-width: 1px;
      margin: 30px 0;
      align-self: center;
      width: 100%;

      &-dashed {
        border-style: dashed;
      }
    }

    .header {
      margin-bottom: 20px;

      &-table {
        font-size: 35px;
      }
    }

    .info {
      font-size: 25px;
      margin-bottom: 25px;
    }

    .inset {
      padding-left: 80px;
    }

    .kitchen-items {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .footer {
      margin-top: 25px;
      font-size: 25px;
    }
  }
</style>