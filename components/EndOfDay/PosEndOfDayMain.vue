<template>
  <div style="height: 100%; background-color: #EEEEEE;">
    <pos-end-of-day-date-picker :event-dates="listOfDatesWithReports"
                                :first-day-of-week="1"
                                :month-select-disabled="true"
                                :weekday-format="getDay"
                                color="#fff" full-width no-title
                                :value="date"
                                @input="selectDate"
                                @click:prev="getDatesWithReport"
                                @click:next="getDatesWithReport"
    >
    </pos-end-of-day-date-picker>
  </div>
</template>

<script>
  import PosEndOfDayDatePicker from './PosEndOfDayDatePicker';

  export default {
    name: 'PosEndOfDayMain',
    components: { PosEndOfDayDatePicker },
    injectService: [
      'PosStore:selectedReportDate',
      'PosStore:listOfDatesWithReports',
    ],
    data: () => ({
      date: null,
      eventDates: []
    }),
    methods: {
      getDay(date) {
        const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        let i = new Date(date).getDay(date);
        return daysOfWeek[i]
      },
      async selectDate(value) {
        if (!this.selectedReportDate || !value) this.selectedReportDate = {}
        if (this.selectedReportDate && this.selectedReportDate.date === value) return
        this.date = value
        this.$set(this.selectedReportDate, 'date', dayjs(value, 'YYYY-MM-DD').toDate())
        this.$set(this.selectedReportDate, 'reports', await this.$getService('PosStore:getDailyReports')(value))
      },
      async getDatesWithReport(date) {
        this.eventDates = await this.$getService('PosStore:getDatesWithReports')(date)
      }
    },
    async mounted() {
      const currentDate = dayjs().format('YYYY-MM-DD');
      await this.getDatesWithReport(currentDate)
      await this.selectDate(currentDate)
    },
    async activated() {
      const currentDate = dayjs().format('YYYY-MM-DD');
      await this.getDatesWithReport(currentDate)
      await this.selectDate(currentDate)
    }
  }
</script>

<style scoped>
  .g-picker {
    box-shadow: none;
    height: 100%;
  }
</style>
