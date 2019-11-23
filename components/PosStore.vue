<template>
	<fragment/>
</template>

<script>
  export default {
    name: 'PosStore',
    props: {},
    data: function () {
      return {
        loginPassword: ''
			}
    },
		domain: 'PosStore',
    computed: {},
    methods: {},
		mounted() {
		},
		provide() {
      return {
				loginPassword: this.loginPassword
			}
		}
  }
</script>

<style scoped>

</style>
