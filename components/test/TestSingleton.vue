<template>
	<fragment/>
</template>

<script>
  export default {
    name: 'TestSingleton',
    props: {},
    data: function () {
      return {
        obj: {
          a: 3,
					b: 5
				}
			}
    },
		domain: 'TestSingleton',
    computed: {},
    methods: {},
		mounted() {
		},
		provide() {
      return {
        obj: this.obj
			}
		}
  }
</script>

<style scoped>

</style>
