<template>
  <div class="pos-management-group">
    <div class="pos-management-group__header" @click="toggleContent">
      <g-icon size="20" v-if="showContent">expand_less</g-icon>
      <g-icon size="20" v-else>expand_more</g-icon>
      <div class="pos-management-group__header-name">{{name}}</div>
    </div>
    <template v-if="showContent">
      <div class="pos-management-group__content">
        <div v-for="(store, i) in stores" :class="getStoreRowClass(i)" @click="toggleStoreSetting(store)">
          <div class="pos-management-group__content-info">
            <div></div>
            <div>{{store.id}}</div>
            <div>{{store.name}}</div>
            <div>
              <div>{{store.address}}</div>
            </div>
            <div>
                <span :class="getStatusClass(store.status)">{{store.status}}</span>
            </div>
            <div>{{store.webshop && 'Yes'}}</div>
            <div>
              <g-tooltip :open-on-hover="true" bottom speech-bubble color="#000" transition="0.3" remove-content-on-close>
                <template v-slot:activator="{on}">
                  <div class="pos-management-group__content-btn ml-2"
                       @mouseenter="on.mouseenter"
                       @mouseleave="on.mouseleave"
                       @click.stop.prevent="deleteStore(store)">
                    <g-icon color="#FFF" small>mdi-trash-can-outline</g-icon>
                  </div>
                </template>
                <span>Delete</span>
              </g-tooltip>
            </div>
          </div>
          <div v-if="showStoreSetting[store._id]" class="pos-management-group__content-action">
            <g-btn-bs small text-color="grey-darken-1">Webshop Config</g-btn-bs>
            <g-btn-bs small text-color="grey-darken-1">Remote Control</g-btn-bs>
            <g-btn-bs small text-color="grey-darken-1" @click="$emit('view:settings')">Settings</g-btn-bs>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: "PosManagementGroup",
    props: {
      name: String,
      stores: Array,
    },
    data() {
      return {
        showContent: false,
        showStoreSetting: {}
      }
    },
    methods: {
      toggleContent() {
        this.showContent = !this.showContent
      },
      toggleStoreSetting(store) {
        if (!_.has(this.showStoreSetting, store._id)) {
          this.$set(this.showStoreSetting, store._id, true)
        } else {
          this.showStoreSetting[store._id] = !this.showStoreSetting[store._id]
        }
      },
      getStoreRowClass(index) {
        if(index % 2 === 0)
          return 'pos-management-group__content--even'
        return 'pos-management-group__content--odd'
      },
      getStatusClass(status) {
        if(status === 'online')
          return 'pos-management-group__status--online'
        if(status === 'offline')
          return 'pos-management-group__status--offline'
        return ''
      },
      deleteStore(store) {
        this.$emit('delete', store)
      }
    }
  }
</script>

<style scoped lang="scss">
  .pos-management-group {
    width: 100%;

    &__header {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid #EFEFEF;

      .g-icon {
        margin: 16px;
        box-shadow: 0.5px 0px 2px rgba(0, 0, 0, 0.1398);
      }
    }

    &__content {
      &--even {
        background: #FFFFFF;
      }

      &--odd {
        background: #FAFAFC;
      }

      &-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #201F28;

        & > div {
          display: flex;
          padding: 10px 0;
        }

        div:nth-child(1),
        div:nth-child(2) {
          flex: 0 0 4.1667%
        }

        div:nth-child(3) {
          flex: 0 0 25%;
        }

        div:nth-child(4) {
          flex: 0 0 33.3333%;
          padding-right: 8px;
          min-width: 0;

          & > div {
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        div:nth-child(5) {
          flex: 0 0 16.6667%;
          justify-content: center;
        }

        div:nth-child(6),
        div:nth-child(7) {
          flex: 0 0 8.3333%;
          justify-content: center;
        }
      }

      &-btn {
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

      &-action {
        display: flex;
        align-items: center;
        margin-left: 8.3333%;
        padding-top: 8px;
        padding-bottom: 24px;

        .g-btn-bs {
          margin: 0 2px;
          box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.41);

          &:hover {
            background: #EFEFEF;
            border: 1px solid #536DFE;
            box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.41);
            border-radius: 2px;
          }
        }
      }
    }

    &__status {
      &--online {
        background: #DFF2DF;
        color: #4CAF50;
        border-radius: 16px;
        line-height: 2;
        padding: 0 8px;
        text-transform: capitalize;
      }

      &--offline {
        background: #FFF3E0;
        color: #FF9800;
        border-radius: 16px;
        line-height: 2;
        padding: 0 8px;
        text-transform: capitalize;
      }
    }
  }
</style>
