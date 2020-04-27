<template>
  <div class="kitchen-report-main-container">
    <div class="header" :style="wrapperStyle">
      <div v-if="takeout" style="text-align: center; font-size: 40px; margin: 20px 0">TAKE AWAY</div>
      <div class="header-table" v-if="table">Table: {{table}}</div>
      <div class="header-time text-end">{{time}}</div>
    </div>
    <div class="divider-dashed"/>
    <div class="kitchen-items">
      <div v-for="item in items">
        <div class="kitchen-item" :style="{fontSize: computedFontSize}">
          {{`${item.quantity} x ${item.id}. ${item.name}`}}
        </div>
        <div class="kitchen-item-modifiers" v-if="item.modifiers">
          <div v-for="mod in item.modifiers" class="inset">
            <span>* {{mod.name}}</span> <span v-if="mod.price">${{mod.price | convertMoney}}</span>
          </div>
        </div>
        <div v-show="item.separate" style="font-size: 40px;">************************</div>
      </div>
    </div>
    <div class="divider-dashed"/>
    <div class="footer text-center" v-if="course && course > 1">Course {{course}}</div>
    <div class="footer text-center" v-if="isKitchenReceipt">{{`${printer} Printer${user ? ` - ${user}` : ''}`}}</div>
    <div class="footer text-center" v-else>Entire Receipt</div>
  </div>
</template>

<script>
  export default {
    name: 'Kitchen',
    props: {
      items: Array,
      table: String,
      printer: String,
      user: String,
      time: String,
      isKitchenReceipt: Boolean,
      fontSize: Number,
      marginTop: Number,
      course: Number,
      takeout: Boolean
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
    font-family: Verdana;
    font-style: normal;
    box-sizing: border-box;

    p {
      margin: 0;
    }

    .float-right {
      float: right;
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

      &-time {
        font-size: 30px;
      }
    }

    .inset {
      padding-left: 80px;
    }

    .kitchen-items {
      margin-top: 20px;
      margin-bottom: 20px;

      .kitchen-item {
        font-size: 40px;

        &-modifiers {
          font-size: 30px;
        }
      }
    }

    .footer {
      margin-top: 20px;
      font-size: 30px;
    }
  }
</style>
