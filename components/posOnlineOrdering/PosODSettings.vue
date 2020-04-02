<template>
  <div style="height: 100vh; width: 100vw; display: flex;">
    <!-- sidebar -->
    <pos-dashboard-sidebar default-path="items.0" :items="sidebarItems" @node-selected="onNodeSelected"/>
    
    <!-- content -->
    <div style="background-color: #F4F7FB; flex: 1;">
      <div style="width: 80%; margin-left: 10%; margin-top: 55px;">
        <restaurant-information v-if="view === 'restaurant-info'"/>
        <service-and-open-hours v-if="view === 'service-and-open-hours'"/>
        <setting-menu v-if="view === 'settings-menu'"/>
        <setting-tax v-if="view === 'settings-tax'"/>
      </div>
    </div>
  </div>
</template>
<script>
  import RestaurantInformation from './settings/RestaurantInformation';
  import ServiceAndOpenHours from './settings/ServiceAndOpenHours';
  import SettingMenu from './settings/SettingMenu';
  export default {
    name: 'PosODSettings',
    components: { SettingMenu, ServiceAndOpenHours, RestaurantInformation },
    props: {},
    data: function () {
      return {
        sidebarItems: [
          { title: 'Basics', icon: '', onClick: () => this.view = 'restaurant-info' },
          { title: 'Service & Open hours', icon: '', onClick: () => this.view = 'service-and-open-hours' },
          { title: 'Menu', icon: '', onClick: () => this.view = 'settings-menu' },
        ],
        view: 'restaurant-info',
        sidebar: '',
      }
    },
    computed: {},
    methods: {
      onNodeSelected(node) {
        node.onClick && node.onClick.bind(this)();
      }
    }
  }
</script>
<style scoped>
</style>
