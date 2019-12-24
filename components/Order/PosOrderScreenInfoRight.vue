<template>
  <div>
    <g-avatar size="36">
      <img :src="user ? user.avatar : ''"/>
    </g-avatar>
    <div class="pa-1" style="line-height: 16px">
      <p class="ta-right fw-700 fs-small">{{userName}}</p>
      <p class="fs-small-2">{{formattedDate}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenInfoRight',
    injectService: ['PosStore:user'],
    data() {
      return {
        date: new Date(),
        setDateInterval: null
      }
    },
    computed: {
      userName() {
        return this.user ? this.user.name : ''
      },
      formattedDate: {
        get() {
          return dayjs(this.date).format(`HH:mm ‧ MMM DD, YY`)
        },
        set(value) {
          this.date = value
        }
      },
      created() {
        this.setDateInterval = setInterval(() => this.date = new Date(), 60000)
      },
      beforeDestroy() {
        this.setDateInterval && clearInterval(this.setDateInterval)
      }
    }
  }
</script>

<style scoped lang="scss">
  .info__right {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding: 0 6px;
  }
</style>
