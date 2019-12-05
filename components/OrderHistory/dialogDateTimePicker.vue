<template>
  <g-dialog v-model="internalValue" width="900px">
    <div class="wrapper">
      <div class="dialog-title">
        <span>Datetime Selection</span>
        <g-icon size="20" svg @click="internalValue = false">icon-close</g-icon>
      </div>
      <g-date-range-picker v-model="selectedDatetime"/>
      <div class="action">
        <g-btn :uppercase="false" text @click="internalValue = false" backgroundColor="#EFEFEF" text-color="#757575" width="120" class="mr-2">
          Cancel
        </g-btn>
        <g-btn :uppercase="false" text @click="submit" backgroundColor="#2979FF" text-color="#FFFFFF" width="120">
          OK
        </g-btn>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: 'dialogDateTimePicker',
    props: {
      value: null
    },
    injectService: [
      'PosStore:orderHistoryFilters',
      'PosStore:getOrderHistory',
    ],
    data: () => ({
      selectedDatetime: []
    }),
    computed: {
      internalValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    },
    methods: {
      async submit() {
        const index = this.orderHistoryFilters.findIndex(f => f.title === 'Datetime');
        const datetimeFilter = {
          title: 'Datetime',
          text: this.selectedDatetime[0] + ' - ' + this.selectedDatetime[1],
          condition: { date: { '$gte': new Date(this.selectedDatetime[0] + ' 00:00:00'), '$lte': new Date(this.selectedDatetime[1] + ' 23:59:59') }}
        };
        if (index > -1) {
          this.orderHistoryFilters.splice(index, 1, datetimeFilter);
        } else {
          this.orderHistoryFilters.unshift(datetimeFilter);
        }
        this.internalValue = false;
        await this.getOrderHistory();
      }
    }
    ,
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    width: 100%;
    background-color: #FFFFFF;

    .dialog-title {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
    }

    .action {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
