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
        <img :src="user.avatar"/>
      </g-avatar>
      <div class="pa-1" style="line-height: 16px">
        <p class="ta-right fw-700 fs-small">{{user.name}}</p>
        <p class="fs-small-2">{{formattedDate}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenInfo',
    injectService: [
      'PosStore:user',
    ],
    data() {
      return {
        date: new Date(),
        setDateInterval: null
      }
    },
    computed: {
      formattedDate: {
        get() {
          return dayjs(this.date).format(`HH:mm ‧ MMM DD, YY`)
        },
        set(value) {
          this.date = value
        }
      },
    },
    created() {
      this.setDateInterval = setInterval(() => this.date = new Date(), 60000)
    },
    beforeDestroy() {
      this.setDateInterval && clearInterval(this.setDateInterval)
    }
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