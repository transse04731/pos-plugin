<template>
  <g-sidebar>
    <template v-slot:header="">
      <div class="row-flex align-items-center py-2 px-3">
        <g-avatar size="40">
          <img alt src="https://loremflickr.com/320/240"/>
        </g-avatar>
        <p class="username">Admin</p>
        <p class="time">{{time}}</p>
      </div>
    </template>
    <div class="sidebar-content-wrapper">
      <div class="sidebar-content">
        <div :class="['sidebar-row', item.displayChild && 'sidebar-row--open']" v-for="(item, i) in sidebar" :key="i">
          <div :class="['sidebar-row__content', isSelectedItem(item) && 'sidebar-row--selected', item.displayChild && 'sidebar-row--open']"
               @click="selectMenu(item)">
            <g-icon size="20" class="sidebar-row__icon">{{item.icon}}</g-icon>
            <p class="sidebar-row__title">{{ item.title }}</p>
            <g-icon v-if="item.items" :class="['sidebar-row__arrow', item.displayChild && 'sidebar-row__arrow--open']">expand_less</g-icon>
          </div>
          <div v-show="item.items && item.displayChild" class="sidebar-row__children">
            <div :class="['sidebar-row__children--content', isSelectedItem(child) && 'sidebar-row--selected', child.type && child.type === 'add' && 'sidebar-row__children--add']"
                 v-for="(child, i) in item.items" :key="i" @click.stop="selectMenu(child)">
              <g-icon v-if="child.icon" class="sidebar-row__icon sidebar-row__icon--small">{{child.icon}}</g-icon>
              <p class="sidebar-row__title">{{ child.title }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar-footer">
        <g-btn-bs elevation="2" icon="icon-back" background-color="white" style="display: block" @click="back">Back</g-btn-bs>
      </div>
    </div>
  </g-sidebar>
</template>

<script>
  export default {
    name: "PosPrinterSettingSidebar",
    props: {

    },
    injectService: ['PosStore:(systemDate, timeFormat)'],
    data() {
      return {
        sidebar: [
          {
            title: 'Receipt Category', icon: 'icon-restaurant', displayChild: true,
            items: [
              {title: 'Drink', icon: 'radio_button_unchecked', slot: 'printer'},
              {title: 'Food', icon: 'radio_button_unchecked', slot: 'printer'},
              {title: '+ Add Category', type: 'add'}
            ]
          },
          {
            title: 'Invoice, Report', icon: 'icon-invoice_report', displayChild: true,
            items: [
              {title: 'POS', icon: 'radio_button_unchecked', slot: 'printer'},
              {title: 'Table', icon: 'radio_button_unchecked', slot: 'printer'},
            ]
          },
          {
            title: 'Entire Receipt', icon: 'icon-receipt', slot: 'receipt'
          },
          {
            title: 'General Setting', icon: 'icon-general_setting', slot: 'general'
          },
        ],
        selectedMenu: null
      }
    },
    computed: {
      time() {
        return dayjs(this.systemDate).format(this.timeFormat)
      }
    },
    methods: {
      isSelectedItem(item) {
        return item === this.selectedMenu;
      },
      selectMenu(menu) {
        if (menu.items) {
          menu.displayChild = !menu.displayChild;
        } else {
          this.selectedMenu = menu;
          this.$emit('itemselected', menu)
        }
      },
      back() {
        this.$router.push({path: '/view/pos-dashboard'});
      }
    }
  }
</script>

<style scoped lang="scss">
  .g-sidebar-wrapper {
    -webkit-tap-highlight-color: transparent;

    ::v-deep .g-sidebar-header {
      .username {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        margin-left: 12px;
      }

      .time {
        font-weight: 600;
      }
    }

    ::v-deep .g-sidebar {
      position: relative;
    }

    .sidebar-content-wrapper {
      flex: 1;
      overflow: hidden;

      .sidebar-content {
        margin-top: 8px;
        height: calc(100% - 64px);
        overflow: auto;

        .sidebar-row {
          color: #424242;
          cursor: pointer;

          &__content {
            display: flex;
            align-items: center;
          }

          &__icon {
            margin: 16px;
          }

          &__title {
            word-break: break-all;
            -webkit-line-clamp: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 14px;
            font-weight: 700;
            flex: 1;
          }

          &__arrow {
            transition: transform 0.3s;

            &--open {
              transform: rotate(180deg);
            }
          }

          &__children {
            &--content {
              display: flex;
              align-items: center;

              .g-icon.sidebar-row__icon--small {
                font-size: 12px !important;
              }

              .sidebar-row__title {
                font-weight: 600;
              }
            }

            &--add {
              padding: 16px;

              .sidebar-row__title {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #E3F2FD;
                border: 1px dashed #2196F3;
                border-radius: 4px;
                font-size: 14px;
                color: #2979FF;
                padding: 8px 0;
              }

              &.sidebar-row--selected {
                background: transparent !important;
                box-shadow: none;
              }
            }
          }

          &--selected {
            background: linear-gradient(9.91deg, #3949AB 0%, #4FC3F7 100%) !important;
            box-shadow: 0 4px 13px rgba(94, 129, 244, 0.75);
            border-radius: 0 4px 4px 0;
            color: white;
            margin-right: 8px;
          }

          &--open {
            background-color: #f7f7f7;

            &.sidebar-row__content {
              background-color: #ededed;
            }
          }

          &__arrow {
            margin-left: auto;
            margin-right: 13px;

            &--collapse {
              transition: transform 0.3s;
            }

            &--expand {
              transform: rotate(-180deg);
            }
          }
        }
      }

      .sidebar-footer {
        z-index: 202;
        background: white;
        color: #1d1d26;
        padding: 12px;
      }
    }

  }
</style>
