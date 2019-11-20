<template>
	<v-layout row wrap>
		<v-flex xs6>
			<slot>
				<cms-add/>
			</slot>
		</v-flex>
		<v-flex xs6>
			<slot name="right">
				<cms-add name="right"/>
			</slot>
		</v-flex>
	</v-layout>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        text: 'test'
      }
    },
    mounted() {
      console.log(this.obj);
    },
    //inject: ['testSingletonObj'],
    injectService: ['TestSingleton:obj'],
  }
</script>

<style scoped>

</style>
