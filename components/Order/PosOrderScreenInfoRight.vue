<template>
  <div>
    <g-avatar size="36">
      <g-icon svg>icon-avatar</g-icon>
    </g-avatar>
    <div class="pa-1" style="line-height: 16px">
      <p class="ta-right fw-700 fs-small">Admin</p>
      <p class="fs-small-2">16:45 &#8231; May 20, 19</p>
    </div>
  </div>
</template>

<script>
  import GAvatar from 'pos-vue-framework/src/components/GAvatar/GAvatar';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  export default {
    name: 'PosOrderScreenInfoRight',
    components: { GIcon, GAvatar },
    data() {
      return {}
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