<template>
  <div>
    <template v-if="mode === 'view'">
      <div class="menu-setting-item">
        <div class="ta-center">{{ index + 1 }}</div>
        <img :src="image" class="menu-setting-item__image" draggable="false"/>
        <div class="menu-setting-item__content px-2">
          <div class="menu-setting-item__name row-flex">
            <span class="col-1">{{id}}.</span>
            <span class="col-7">{{name}}</span>
            <span class="col-6">{{printerStr}}</span>
          </div>
          <div class="menu-setting-item__desc">
            {{desc}}
          </div>
        </div>
        <div class="menu-setting-item__content">
          <div class="menu-setting-item__price">${{price}}</div>
          <div class="menu-setting-item__tax">Tax: {{tax}}%</div>
        </div>
        <div class="menu-setting-item__content" style="justify-self: center">
          <g-tooltip :open-on-hover="true" right speech-bubble color="#000" transition="0.3" remove-content-on-close>
            <template v-slot:activator="{on}">
              <div class="menu-setting-item__btn"
                   @mouseenter="on.mouseenter"
                   @mouseleave="on.mouseleave"
                   @click.stop.prevent="switchToEditMode">
                <g-icon color="#FFF" small>mdi-pencil-outline</g-icon>
              </div>
            </template>
            <span>Edit</span>
          </g-tooltip>
          <g-tooltip :open-on-hover="true" right speech-bubble color="#000" transition="0.3" remove-content-on-close>
            <template v-slot:activator="{on}">
              <div class="menu-setting-item__btn mb-3"
                   @mouseenter="on.mouseenter"
                   @mouseleave="on.mouseleave"
                   @click.stop.prevent="deleteItem">
                <g-icon color="#FFF" small>mdi-trash-can-outline</g-icon>
              </div>
            </template>
            <span>Delete</span>
          </g-tooltip>
        </div>
      </div>
    </template>
    <template v-else>
      <setting-new-menu-item
          :index="index"
          :id="id"
          :image="image"
          :name="name"
          :desc="desc"
          :price="price"
          :printers="printers"
          :tax="tax"
          :available-printers="availablePrinters"
          :use-multiple-printers="useMultiplePrinters"
          @cancel="cancelEdit"
          @save="saveProduct"/>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash'
  import SettingNewMenuItem from './SettingNewMenuItem';
  
  export default {
    name: 'SettingMenuItem',
    components: { SettingNewMenuItem },
    props: [ '_id', 'index', 'id', 'image', 'name', 'desc', 'price', 'printers', 'tax', 'printers', 'availablePrinters', 'useMultiplePrinters'],
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
    computed: {
      printerStr() {
        return _.join(this.printers, ', ')
      }
    },
    methods: {
      deleteItem() {
        this.$emit('delete')
      },
      switchToEditMode() {
        this.mode = 'edit'
        this.emitEditing(true)
      },
      switchToViewMode() {
        this.mode = 'view'
        this.emitEditing(false)
      },
      cancelEdit() {
        this.switchToViewMode()
      },
      saveProduct(change) {
        this.$emit('save', change)
        this.switchToViewMode()
      },
      emitEditing(editing) {
        this.$emit('editing', editing)
      }
    }
  }
</script>

<style scoped lang="scss">
  .menu-setting-item {
    display: grid;
    grid-template-columns: 40px 80px 1fr auto 50px;
    grid-gap: 15px;
    background-color: #fff;
    align-items: center;
    border-bottom: 1px solid #E0E0E0;
    height: 112px;

    &__image {
      width: 80px;
      height: 80px;
      border-radius: 10px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-self: stretch;
      padding: 16px 0;

      ::v-deep .g-tooltip__activator {
        display: inline-flex;
        height: auto;
      }
    }

    &__name,
    &__price {
      font-weight: 700;
      font-size: 15px;
    }

    &__desc {
      word-break: break-word;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 14px;
      font-style: italic;
      color: #757575;
      max-width: 420px;
      margin-bottom: 24px;
    }

    &__tax {
      font-size: 13px;
      font-style: italic;
      margin-bottom: 24px;
    }

    &__btn {
      background: #616161;
      border-radius: 2px;
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background: #536DFE;
      }
    }
  }
</style>
