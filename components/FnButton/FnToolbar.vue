<template>
  <g-toolbar>
    <g-btn background-color="white" class="mr-2">
      <router-link to="/order">
        <g-icon class="mr-2" svg>icon-back</g-icon>
        <span style="color: rgba(0, 0, 0, 0.87)">Back</span>
      </router-link>
    </g-btn>

    <g-btn background-color="white" class="mr-2">
      <router-link to="/order">
        <g-icon class="mr-2" svg>icon-folder</g-icon>
        <span style="color: rgba(0, 0, 0, 0.87)">Merge/Split</span>
      </router-link>
    </g-btn>
  </g-toolbar>
</template>

<script>
  export default {
    name: 'FnToolbar',
  }
</script>

<style scoped>

</style>
