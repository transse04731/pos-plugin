<template>
  <div area="menu">
    <g-btn :uppercase="false" v-for="(item, i) in menu" :key="i" elevation="0" background-color="#fff" text-color="#1d1d26" height="100%"
           @click.native.stop="select(item)" :ref="`button_${item.name}`">
      {{item.name}}
    </g-btn>
  </div>
</template>

<script>
  export default {
    name: 'PosOrderScreenProductCategoryMenu',
    data() {
      return {
        menu: [],
      }
    },
    methods: {
      select(item) {
        const posStore = this.$getService('PosStore')
        posStore.changeCategory(item, posStore.activeCategory)
        posStore.changeProductList(item, posStore.activeCategory)
        posStore.activeCategory = item;
      },
    },
    created() {
      const posStore = this.$getService('PosStore');
      this.menu = posStore.getAllCategories()

      posStore.changeCategory = (newValue, oldValue) => {
        if (newValue) {
          const newCategory = newValue.name
          const oldCategory = oldValue && oldValue.name
          if (newCategory && this.$refs[`button_${newCategory}`]) {
            this.$refs[`button_${newCategory}`][0].$el.classList.add('menu__active')
          }

          if (oldCategory) {
            if (newCategory === oldCategory) return
            const oldRef = this.$refs[`button_${oldCategory}`];
            if (oldRef && oldRef.length > 0) {
              oldRef[0].$el.classList.remove('menu__active')
            }
          }
        }
      }
    },
    mounted() {
      this.select(this.menu[0])
    },
    activated() {
      const posStore = this.$getService('PosStore');
      this.menu = posStore.getAllCategories()
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

<style lang="scss">
  .order {
    .layout__right {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    }
  }
</style>