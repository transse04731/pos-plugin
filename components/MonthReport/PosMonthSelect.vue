<template>
  <div class="month-select-wrapper">
    <g-icon class="mr-4" @click="previousMonth">
      arrow_back_ios
    </g-icon>
    <span>{{month}}</span>
    <g-icon class="ml-4" @click="nextMonth">
      arrow_forward_ios
    </g-icon>
  </div>
</template>

<script>
  export default {
    name: 'PosMonthSelect',
    injectService: [
      'PosStore:monthReportFrom',
      'PosStore:monthReportTo',
      'PosStore:selectedMonth',
      'PosStore:getMonthReportData',
    ],
    data() {
      return {
      }
    },
    computed: {
      month() {
        if(this.monthReportFrom && this.monthReportTo) {
          const start = dayjs(this.monthReportFrom);
          const end = dayjs(this.monthReportTo);
          if(!start.isSame(end, 'month'))
            return start.format('MMM DD YYYY') + ' - ' + end.format('MMM DD YYYY')
        }
        if (this.selectedMonth) {
          return this.selectedMonth.format('MMMM YYYY')
        }
      },
    },
    methods: {
      async nextMonth() {
        this.selectedMonth = this.selectedMonth.add(1, 'month');
        await this.updateMonth();
      },
      async previousMonth() {
        this.selectedMonth = this.selectedMonth.add(-1, 'month');
        await this.updateMonth();
      },
      async updateMonth() {
        this.monthReportFrom = this.selectedMonth.startOf('month').format('YYYY-MM-DD');
        this.monthReportTo = dayjs().isSame(this.selectedMonth.endOf('month'), 'month')
        && dayjs().isBefore(this.selectedMonth.endOf('month'))
            ? dayjs().format('YYYY-MM-DD')
            : this.selectedMonth.endOf('month').format('YYYY-MM-DD');
        await this.getMonthReportData();
      }
    },
    async created() {
      this.selectedMonth = dayjs();
      await this.updateMonth();
    }
  }
</script>

<style scoped lang="scss">
  .month-select-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 18px;
    color: #212B35;
    background: #F0F0F0;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.14);
  }
</style>