<template>
  <div>
    <div class="report-column">
      <span>{{$t('common.discount')}} ({{$t('common.currency')}})</span>
      <span class="number">{{paymentDiscount | formatNumber}}</span>
      <span>{{$t('common.tax')}} ({{$t('common.currency')}})</span>
      <span class="number">{{paymentTax | formatNumber}}</span>
    </div>
    <g-divider inset vertical color="#979797"/>
    <div class="report-column">
      <span>{{$t('common.subtotal')}} ({{$t('common.currency')}})</span>
      <span class="number">{{paymentSubTotal | formatNumber}}</span>
      <span>{{$t('common.total')}} ({{$t('common.currency')}})</span>
      <span class="number__important">{{paymentTotal | formatNumber}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenReport',
    filters: {
      formatNumber: (val) => {
        if (val && typeof (val) === 'number') {
          return val.toFixed(2)
        }
        return 0
      },
    },
    injectService: [
      'PosStore:paymentDiscount',
      'PosStore:paymentTax',
      'PosStore:paymentSubTotal',
      'PosStore:paymentTotal',
    ]
  }
</script>

<style scoped lang="scss">
  .report {
    display: flex;

    &-column {
      flex: 1 1 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 1fr;
      grid-gap: 6px;
      padding: 8px 16px;

      .number {
        text-align: right;

        &__important {
          text-align: right;
          font-size: 20px;
          font-weight: 700;
          color: #1271ff;
        }
      }
    }
  }

</style>
