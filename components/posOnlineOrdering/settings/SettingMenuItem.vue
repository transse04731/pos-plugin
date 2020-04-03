<template>
  <div>
    <template v-if="mode === 'view'">
      <div style="display: grid; grid-template-columns: 40px 106px 1fr 50px; grid-gap: 15px; height: 160px; background-color: #fff; align-items: center; border-bottom: 1px solid #E0E0E0">
        <div style="text-align: center">{{ index + 1 }}</div>
        <img :src="image" style="width: 106px; height: 106px;"/>
        <div style="height: 106px">
          <div style="display: flex; font-weight: bold; font-size: 15px;" class="mb-3">
            <span>{{name}}</span>
            <g-spacer/>
            <span>{{price | currency}}</span>
          </div>
          <div style="font-size: 14px; font-style: italic; color: #757575; max-width: 400px;">
            {{desc}}
          </div>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: flex-end; height: 106px">
          <div style="background: #616161; border-radius: 2px; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center" class="mb-1" @click="mode = 'edit'">
            <g-icon color="#FFF" small>edit</g-icon>
          </div>
          <div style="background: #616161; border-radius: 2px; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center">
            <g-icon color="#FFF" small>delete</g-icon>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <setting-new-menu-item
          :index="index"
          :image="image"
          :name="name"
          :desc="desc"
          :price="price"
          :tax="tax"
          @cancel="mode = 'view'"
          @save="$emit('save', $event)"/>
    </template>
  </div>
</template>
<script>
  import SettingNewMenuItem from './SettingNewMenuItem';
  
  export default {
    name: 'SettingMenuItem',
    components: { SettingNewMenuItem },
    props: [ 'index', 'image', 'name', 'desc', 'price', 'tax'],
    data: function () {
      return {
        mode: 'view'
      }
    },
    filters: {
      currency(value) {
        return '$' + value
      }
    },
    computed: {},
    methods: {}
  }
</script>
<style scoped>
</style>
