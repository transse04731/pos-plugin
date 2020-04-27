<template>
  <g-btn flat :uppercase="false" height="100%">{{$t('login.version')}}: {{version}}</g-btn>
</template>

<script>
  export default {
    name: 'VersionBtn',
    props: {
      version: String
    }
  }
</script>