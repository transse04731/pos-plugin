<template>
  <div area="menu">
    <g-btn v-for="(item, i) in menu" :key="i" elevation="0" background-color="#fff" text-color="#1d1d26" height="100%"
           @click.stop="selectMenu(item)" :class="[item === menuSelected ? 'menu__active' : '']">
      {{item.title}}
    </g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenProductCategoryMenu',
    data() {
      return {
        menu: [
          { title: 'Favorite' },
          { title: 'Drink' },
          { title: 'Sport' },
          { title: 'Material' },
          { title: 'Wine' },
          { title: 'Electronic' },
          { title: 'Other 1' },
          { title: 'Other 2' },
        ],
        menuSelected: null,
      }
    },
    methods: {
      selectMenu(item) {
        this.menuSelected = item;
      },
    },
    created() {
      this.menuSelected = this.menu[0];
    }
  }
</script>

<style scoped lang="scss">
  .menu {
    background-color: #90CAF9;
    overflow-x: auto;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-auto-columns: 32%;
    grid-gap: 6px;
    grid-auto-flow: column;
    padding: 6px;

    &::-webkit-scrollbar {
      display: none;
    }

    &__active {
      background-color: #2979FF !important;
      color: white !important;
    }

    &:after {
      content: '';
      width: 1px;
      height: 100%;
    }
  }
</style>