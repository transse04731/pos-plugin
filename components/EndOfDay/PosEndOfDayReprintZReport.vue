<template>
  <div>
    <slot :close="close" :open="open" name="activator"></slot>
    <g-dialog eager overlay-color="#6B6F82" overlay-opacity="0.95" v-model="dialog" width="45%">
      <div class="print-confirm-dialog">
        <p class="head-title">{{$t('reprintZReport')}}</p>
        <div class="printed-list">
          <div :key="index" class="report-item" style="display: flex" v-for="(item, index) in reports">
            <p>{{item.begin}} - {{item.end}} : Z-Number {{item.z}}</p>
            <g-btn :uppercase="false" background-color="#2979FF" flat style="margin-left: auto" text-color="#fff" height="40px"
                   @click.stop="print(item.z)"
            >
              <g-icon class="mr-2" svg>
                icon-print2
              </g-icon>
              {{$t('ui.print')}}
            </g-btn>
          </div>
        </div>
      </div>
    </g-dialog>
  </div>
</template>

<script>
  import { getInternalValue } from 'pos-vue-framework';
  import dayjs from 'dayjs'

  export default {
    name: 'PosEndOfDayReprintZReport',
    injectService: ['PosStore:selectedReportDate'],
    props: {
      value: null
    },
    data: () => ({
      reports: []
    }),
    methods: {
      open() {
        this.dialog = true;
      },
      close(confirmed = false) {
        this.dialog = false
        if (confirmed) {
          this.$emit('confirmed')
        }
      },
      async print(z) {
        await this.$getService('PosStore:printZReport')(z)
      }
    },
    setup() {
      const dialog = getInternalValue(...arguments);
      return { dialog };
    },
    watch: {
      dialog(newVal) {
        if (newVal) {
          this.reports = this.selectedReportDate.reports.map((value, index) => {
            return {
              begin: dayjs(value.begin).format('HH:mm'),
              end: dayjs(value.end).format('HH:mm'),
              z: value.z,
              sum: value.sum,
              pending: value.pending
            }
          }) || []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .print-confirm-dialog {
    padding: 25px 70px 30px 70px;
    width: 100%;
    text-align: center;
    background-color: #fff;
    font-size: 14px;
    line-height: 18px;
    height: 300px;
  }

  .head-title {
    font-size: 20px;
    line-height: 25px;
    font-weight: bold;
  }

  .printed-list {
    margin-top: 30px;
    overflow-y: auto;
    height: calc(100% - 50px);
  }

  .report-item {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }
</style>
