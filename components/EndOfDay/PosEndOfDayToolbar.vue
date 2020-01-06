<template>
  <g-toolbar bottom color="#eee" style="z-index: 2">
    <g-btn :uppercase="false" @click="back">
      <g-icon class="mr-2" svg>icon-back</g-icon>
      Back
    </g-btn>
    <g-spacer/>

    <pos-end-of-day-reprint-z-report>
      <template v-slot:activator="{open, close}">
        <g-btn :uppercase="false" class="mr-2" v-if="showReprint" @click="open">
          <g-icon class="mr-2" svg>icon-print2</g-icon>
          Reprint
        </g-btn>
      </template>
    </pos-end-of-day-reprint-z-report>

    <pos-end-of-day-print-dialog>
      <template v-slot:activator="{open, close}">
        <g-btn :uppercase="false" @click="open(selectedReportDate.date)" class="mr-2" v-if="showRunEndOfDay">
          <g-icon class="mr-2" svg>icon-print2</g-icon>
          X-Report
        </g-btn>
      </template>
    </pos-end-of-day-print-dialog>

    <g-btn :uppercase="false" @click="runEndOfDay" background-color="#E57373" class="mr-2" text-color="#FFFFFF" v-if="showRunEndOfDay">
      <g-icon class="mr-2" svg>icon-print2</g-icon>
      Run End-of-Day
    </g-btn>

    <pos-end-of-day-print-pending-z-report @confirmed="save" v-model="showPendingEndOfDayConfirmDialog"></pos-end-of-day-print-pending-z-report>
    <pos-end-of-day-print-z-report @confirmed="save(selectedReportDate.reports)" v-model="showEndOfDayConfirmDialog"></pos-end-of-day-print-z-report>
  </g-toolbar>
</template>

<script>
  import PosEndOfDayPrintZReport from './PosEndOfDayPrintZReport';
  import PosEndOfDayPrintDialog from './PosEndOfDayPrintDialog';
  import PosEndOfDayPrintPendingZReport from './PosEndOfDayPrintPendingZReport';
  import PosEndOfDayReprintZReport from './PosEndOfDayReprintZReport';

  export default {
    name: 'PosEndOfDayToolbar',
    components: { PosEndOfDayReprintZReport, PosEndOfDayPrintPendingZReport, PosEndOfDayPrintDialog, PosEndOfDayPrintZReport },
    injectService: [
      'PosStore:selectedReportDate',
      'PosStore:listOfDatesWithReports',
    ],
    data() {
      return {
        showEndOfDayConfirmDialog: false,
        showPendingEndOfDayConfirmDialog: false
      }
    },
    computed: {
      hasDateReports() {
        return this.selectedReportDate && this.selectedReportDate.reports && this.selectedReportDate.reports.length > 0
      },
      showRunEndOfDay() {
        return this.hasDateReports && this.selectedReportDate.reports.some(report => report.pending)
      },
      showReprint() {
        return this.hasDateReports && !this.selectedReportDate.reports.some(report => report.pending)
      },
    },
    methods: {
      back() {
        this.$router.push({ path: '/view/pos-dashboard' })
      },
      async runEndOfDay() {
        const oldestPendingReport = await this.$getService('PosStore:getOldestPendingReport')()
        if (oldestPendingReport && oldestPendingReport.date < this.selectedReportDate.date) {
          this.showPendingEndOfDayConfirmDialog = true
          return
        }
        this.showEndOfDayConfirmDialog = true
      },
      async save(reports) {
        await this.$getService('PosStore:finalizeReport')(reports)
        await this.$getService('PosStore:getDatesWithReports')(this.selectedReportDate.date || new Date())
      }
    }
  }
</script>

<style scoped>

</style>
