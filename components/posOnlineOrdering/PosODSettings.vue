<template>
  <div style="height: 100vh; width: 100vw; display: flex;">
    <!-- sidebar -->
    <div style="width: 300px">
      <g-side-bar-tree-view
          v-model="sidebar"
          :data="sidebarItems"
          @node-selected="onNodeSelected"/>
    </div>
    
    <!-- content -->
    <div style="background-color: #F4F7FB; flex: 1;">
      <div style="width: 80%; margin-left: 10%; margin-top: 55px;">
        <restaurant-information/>
      </div>
    </div>
  </div>
</template>
<script>
  import RestaurantInformation from './settings/RestaurantInformation';
  export default {
    name: 'PosODSettings',
    components: { RestaurantInformation },
    props: {},
    data: function () {
      return {
        sidebarItems: [
          { title: 'Basics', icon: '', onClick: () => {} },
          { title: 'Service & Open hours', icon: '', onClick: () => {} },
          { title: 'Menu', icon: '', onClick: () => {} },
          { title: 'Account', icon: '', onClick: () => {} },
        ],
        sidebar: '',
        selectedNode: null,
      }
    },
    computed: {},
    methods: {
      onNodeSelected(node) {
        this.selectedNode = node;
        node.onClick && node.onClick.bind(this)();
      }
    }
  }
</script>
<style scoped>
</style>
