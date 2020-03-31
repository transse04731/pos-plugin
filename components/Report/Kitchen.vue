<template>
  <div class="kitchen-report-main-container">
    <div class="header">
      <div class="header-table" v-if="table">Table: {{table}}</div>
      <div class="header-time text-end">{{time}}</div>
    </div>
    <div class="divider-dashed"/>
    <div class="kitchen-items">
      <div v-for="item in items">
        <div class="kitchen-item">{{`${item.quantity} x   ${item.id}. ${item.name}`}}</div>
        <div class="kitchen-item-modifiers" v-if="item.modifiers">
          <div v-for="mod in item.modifiers" class="inset">
            <span>* {{mod.name}}</span> <span v-if="mod.price">${{mod.price | convertMoney}}</span>
          </div>
        </div>
        <div v-show="item.separate">************************</div>
      </div>
    </div>
    <div class="divider-dashed"/>
    <div class="footer text-center">{{`${printer} Printer - ${user}`}}</div>
  </div>
</template>

<script>
  export default {
    name: 'Kitchen',
    props: {
      items: Array,
      table: String,
      size: Number,
      printer: String,
      user: String,
      time: String
    },
    filters: {
      convertMoney(value) {
        return !isNaN(value) ? value.toFixed(2) : value
      }
    },
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

    .kitchen-item {
      font-size: 40px;

      &-modifiers {
        font-size: 30px;
      }
    }

    .footer {
      font-size: 30px;
    }
  }
</style>