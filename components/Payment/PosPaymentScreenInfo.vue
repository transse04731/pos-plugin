<template>
  <div>
    <div area="info__left">
      <g-avatar size="36">
        <g-icon svg>icon-customer_ava</g-icon>
      </g-avatar>
      <p class="pa-1 ml-2" style="line-height: 16px">
        Select Customer
      </p>
      <g-icon small>add_circle</g-icon>
    </div>
    <div area="info__right">
      <g-avatar size="36">
        <g-icon svg>icon-avatar</g-icon>
      </g-avatar>
      <div class="pa-1" style="line-height: 16px">
        <p class="ta-right fw-700 fs-small">Admin</p>
        <p class="fs-small-2">16:45 &#8231; May 20, 19</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenInfo',
  }
</script>

<style scoped lang="scss">
  .info__left {
    display: flex;
    padding: 16px 16px 16px 6px;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
  }

  .info__right {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding: 0 6px;
  }
</style>