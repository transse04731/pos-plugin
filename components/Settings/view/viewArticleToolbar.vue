<template>
  <g-toolbar absolute bottom color="grey lighten 3" filled>
    <g-btn background-color="white" text-color="#1d1d26" class="mr-3">
      <g-icon class="mr-2" svg>
        icon-back
      </g-icon>
      Back
    </g-btn>
    <g-btn background-color="white" text-color="#1d1d26" class="mr-3">
      <g-icon class="mr-2" svg>
        icon-menu
      </g-icon>
      More
    </g-btn>
    <g-btn background-color="white" text-color="#1d1d26" class="mr-3">
      <g-icon class="mr-2" svg>
        icon-sort
      </g-icon>
      Sort
    </g-btn>
    <g-btn background-color="white" text-color="#1d1d26">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <g-spacer/>
    <g-btn background-color="green" text-color="white" flat @click="openDialogNewProduct">
      + Create new product
    </g-btn>
  </g-toolbar>
</template>

<script>
  import GToolbar from 'pos-vue-framework/src/components/GToolbar/GToolbar';
  import GBtn from 'pos-vue-framework/src/components/GBtn/GBtn';
  import GIcon from 'pos-vue-framework/src/components/GIcon/GIcon';
  import GSpacer from 'pos-vue-framework/src/components/GLayout/GSpacer';
  export default {
    name: 'viewArticleToolbar',
    components: { GSpacer, GIcon, GBtn, GToolbar },
    methods: {
      openDialogNewProduct(){
        this.$getService('dialogNewProduct:setActive')(true)
      }
    }
  }
</script>

<style scoped>

</style>