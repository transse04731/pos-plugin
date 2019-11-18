<template>
  <div>
    <v-btn small depressed style="color: #5e5efb"
            @click="select(category)"
            v-for="(category, index) in categories" :key="index">
      {{category.name}}        
    </v-btn>
    <v-divider></v-divider>
  </div>
	
</template>

<script>
  export default {
    name: 'Category',
    data() {
      return {
        categories: [],
        category: null
      }
    },
    mounted() {
      this.categories.push(...cms.getList('Category'));
      this.category = this.categories[0];
    },
    domain: 'Category',
    provide() {
      return {
        category: this.category
      }
    },
    methods: {
      select(category) {
        this.category = category;
      }
    }
  }
</script>

<style scoped>

</style>