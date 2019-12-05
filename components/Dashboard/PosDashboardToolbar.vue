<template>
  <g-toolbar gradient="#3949AB,#4FC3F7" elevation="0">
    <slot></slot>
    <g-spacer/>
    <div class="time">
      <p>{{time}}</p>
      <p>{{date}}</p>
    </div>
  </g-toolbar>
</template>

<script>
  export default {
    name: 'PosDashboardToolbar',
    data() {
      return {
        time: null,
        date: null,
      }
    },
    methods: {
      updateTime() {
        this.time = dayjs(new Date()).format('hh:mm A');
        this.date = dayjs(new Date()).format('DD/MM/YYYY');
      }
    },
    created() {
      this.updateTime();
      setInterval(() => this.updateTime(), 60*1000);
    }
  }
</script>

<style scoped>
  .time {
    color: white;
    font-size: 13px;
    line-height: 16px;
    text-align: right
  }
</style>