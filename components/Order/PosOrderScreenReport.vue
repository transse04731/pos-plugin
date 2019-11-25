<template>
  <div>
    <div class="report-column">
      <span>Discount (€)</span>
      <span class="number">{{convertMoney(discount)}}</span>
      <span>Tax (€)</span>
      <span class="number">{{convertMoney(tax)}}</span>
    </div>
    <g-divider inset vertical color="#979797"/>
    <div class="report-column">
      <span>Sub Total (€)</span>
      <span class="number">{{convertMoney(subTotal)}}</span>
      <span>Total (€)</span>
      <span class="number__important">{{convertMoney(total)}}</span>
    </div>
  </div>
</template>

<script>
  import GDivider from 'pos-vue-framework/src/components/GLayout/GDivider';

  export default {
    name: 'PosOrderScreenReport',
    components: { GDivider },
    injectService: ['PosStore:convertMoney'],
    data() {
      return {
        discount: -0.50,
        tax: 0.50,
        subTotal: 40.50,
        total: 40.50,
      }
    }
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