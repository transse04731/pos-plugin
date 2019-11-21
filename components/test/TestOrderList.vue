<template>
	<div>
    <v-subheader style="display:inline">OrderList</v-subheader>
    <v-btn icon style="color:rgba(0,0,0,0.54)"
           @click="clear()"><v-icon>clear</v-icon>
    </v-btn>
    <br>
		<div v-for="item in items" style="padding: 10px">
			<p>{{item.name}} (€ {{item.price}})</p>
			<v-divider></v-divider>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'OrderList',
		data() {
      return {
        items: []
			}
		},
		methods: {
      pushItem(item) {
        this.items.push(item);
			},
      clear() {
        this.items = [];
      }
		},
    domain: 'OrderList',
		provide() {
      return {
        pushItem: this.pushItem
			}
		}
  }
</script>

<style scoped>

</style>