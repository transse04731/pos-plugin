<template>
  <div class="pos-order">
    <!-- -->
    <template  v-if="store">
      <div class="pos-order__left">
        <div class="pos-order__left__header">
          <img :src="store.logoImageSrc"/>
          <div class="pos-order__left__header--info">
            <div>
              <span class="phone-image">
                <img alt src="/plugins/pos-plugin/assets/phone.svg"/>
              </span>
              <span class="sub-title">{{store.phone}}</span>
            </div>
        
            <div style="display: flex; align-items: center; font-weight: 300">
              <span :style="storeOpenStatusStyle">{{ storeOpenStatus }}</span>
              <span style="margin-right: 3px;">|</span>
              <g-icon size="16">access_time</g-icon>
              <span style="color: #424242; margin-left: 3px">{{ storeWorkingTime }}</span>
            </div>
          </div>
        </div>
        <div class="title">What you like?</div>
        <div class="pos-order__tab">
          <div class="pos-order__tab--icon">
            <img src="/plugins/pos-plugin/assets/fork.svg"/>
          </div>
          <span v-for="(category, index) in categoriesViewModel"
                :key="index"
                @click="selectedCategoryId = category._id"
                :style="getCategoryStyle(category)">
            {{ category.name }}
          </span>
        </div>
        <div class="pos-order__tab--content">
          <div class="sub-title">{{ selectedCategory && selectedCategory.name }}</div>
          <div class="pos-order__tab--content-main">
            <div v-for="(item, index) in categoryItems" :key="index">
              <menu-item
                  v-bind="item"
                  :currency-unit="store.currency"
                  :quantity="getQuantityInOrder(item)"
                  @menu-item-selected="addItemToOrder(item)"
                  @increase="addItemToOrder(item)"
                  @decrease="removeItemFromOrder(item)"/>
            </div>
          </div>
        </div>
        <div class="pos-order__info" v-if="orderItems.length > 0">
          <g-badge :value="true" color="#4CAF50" overlay>
            <template v-slot:badge>
              {{orderItems.length}}
            </template>
            <div style="width: 40px; height: 40px; background-color: #ff5252; border-radius: 8px; display: flex; align-items: center; justify-content: center">
              <g-icon>icon-menu2</g-icon>
            </div>
          </g-badge>
          <div class="pos-order__info--total">${{totalPrice + shippingFee}}</div>
          <g-spacer/>
          <g-btn-bs background-color="#2979FF" rounded style="padding: 8px 16px" @click="showOrder = true">CHECK OUT</g-btn-bs>
        </div>
        <order-table v-if="showOrder" @back="showOrder = false" :store="store"/>
      </div>
  
      <!-- -->
      <div class="pos-order__right">
        <order-table :store="store"/>
      </div>
    </template>
  </div>
</template>
<script>
  import _ from 'lodash';
  import OrderTable from './OrderTable';
  import MenuItem from './MenuItem';

  export default {
    name: 'OrderView',
    injectService: ['PosOnlineOrderStore:(orderItems, increaseOrAddNewItems, decreaseOrRemoveItems, shippingFee)'],
    components: {MenuItem, OrderTable},
    data: function () {
      return {
        selectedCategoryId: null,
        selectedMenuItemId: null,
        showOrder: false,
        store: null,
        categories: null,
        products: null,
      }
    },
    async created() {
      const storeIdOrAlias = this.$route.params.storeIdOrAlias
      if (storeIdOrAlias) {
        // try to find by id
        const store = await cms.getModel('Store').findOne({alias: storeIdOrAlias})
        const storeGroups = _.map(store.groups, g => g._id)
        const userStoreGroups = _.map(this.$getService('PosStore').user.storeGroups, g => g._id)
        const theUserManageThisStore = _.uniq(storeGroups, userStoreGroups).length > 0
        if (theUserManageThisStore) {
          this.$set(this, 'store', store)
          await this.loadCategories()
          await this.loadProducts()
        } else {
          prompt('Permission denied!')
        }
      }
      await this.loadCategories()
    },
    computed: {
      selectedCategory() {
        return _.find(this.categoriesViewModel, c => c._id === this.selectedCategoryId)
      },
      selectedMenuItem() {
        return _.find(this.selectedCategory.items, item => item._id === this.selectedMenuItem)
      },
      categoryItems() {
        if (this.selectedCategory) {
          return this.selectedCategory.items
        }
      },
      totalPrice() {
        return _.sumBy(this.orderItems, item => item.price * item.quantity)
      },
      categoriesViewModel() {
        const categories = _.cloneDeep(this.categories)
        const products = _.cloneDeep(this.products)
        _.each(categories, cate => {
          cate.items = _.filter(products, p => p.category._id === cate._id)
        })
        return categories
      },
      todayOpenHour() {
        const dayInWeekIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayjs().format("dddd"))
        for (let openHour of this.store.openHours) {
          if (openHour.dayInWeeks[dayInWeekIndex])
            return _.pick(openHour, 'openTime', 'closeTime')
        }
      },
      storeOpenState() {
        const now = dayjs().format('HH:mm')
        return this.todayOpenHour.openTime <= now && now <= this.todayOpenHour.closeTime
      },
      storeOpenStatus() {
        if (this.storeOpenState)
          return '• Open door'
        return '• Close door'
      },
      storeOpenStatusStyle() {
        return {
          color: this.storeOpenState ? '#4CAF50' : "#424242",
          'margin-right': '5px'
        }
      },
      storeWorkingTime() {
        if (this.todayOpenHour)
          return `${this.todayOpenHour.openTime} - ${this.todayOpenHour.closeTime}`
        return `00:00 - 00:00`
      }
    },
    methods: {
      async loadStore() {
        this.$set(this, 'store', await cms.getModel('Store').findOne({_id: this.store._id}))
      },
      async loadCategories() {
        this.$set(this, 'categories', await cms.getModel('Category').find({ store: this.store._id }, { store: 0 }))
      },
      async loadProducts() {
        this.$set(this, 'products', await cms.getModel('Product').find({ store: this.store._id }, { store: 0 }))
      },
      getCategoryStyle(cate) {
        const common = {cursor: 'pointer', padding: '20px'};
        return cate._id === this.selectedCategoryId ? {
          fontWeight: 'bold',
          borderBottom: '2px solid #000',
          color: '#000000', ...common
        } : {borderBottom: '2px solid transparent', color: '#424242', ...common}
      },
      addItemToOrder(item) {
        this.increaseOrAddNewItems(item)
      },
      removeItemFromOrder(item) {
        this.decreaseOrRemoveItems(item)
      },
      getQuantityInOrder(item) {
        const indexOfItem = _.findIndex(this.orderItems, i => i._id === item._id)
        if (indexOfItem > -1)
          return this.orderItems[indexOfItem].quantity
        return 0
      }
    }
  }
</script>
<style scoped lang="scss">
  .pos-order {
    box-sizing: border-box;
    display: flex;
    width: 100vw;
    height: 100vh;

    &__left {
      flex: 1;
      padding: 24px 60px 0;
      overflow: hidden;

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &--info {
          text-align: right;

          .phone-image {
            width: 35px;
            height: 35px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #000;
            border-radius: 100%;
            margin-right: 10px
          }
        }
      }

      .title {
        font-size: 30px;
        font-weight: 700;
        margin-bottom: 24px;
      }

      .sub-title {
        font-size: 24px;
        font-weight: 700;
      }

      .pos-order__info {
        display: none;
      }

      .po-order-table {
        display: none;
      }
    }

    &__tab {
      display: flex;
      background-color: #F8F8F8;
      height: 64px;
      align-items: center;
      border-top-right-radius: 24px;
      border-bottom-right-radius: 24px;

      &--icon {
        padding: 24px;
        display: flex;
        align-items: center;
        height: calc(100% - 16px);
        border-right: 1px solid #000;
        margin: 8px 16px 8px 0;
      }

      &--content {
        padding-top: 30px;

        &-main {
          max-height: 575px;
          overflow: hidden scroll;
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    .pos-order__left {
      padding: 0;

      .pos-order__left__header {
        img {
          width: 40%;
        }

        &--info {
          font-size: 14px;
          margin-right: 15px;

          .phone-image {
            width: 24px;
            height: 24px;
          }

          .sub-title {
            font-size: 15px;
          }
        }
      }

      .title {
        font-size: 20px;
        margin-left: 16px;
      }

      .pos-order__tab {
        border-radius: 0;
        overflow: auto;
        position: relative;

        &::-webkit-scrollbar {
          display: none;
        }

        &--icon {
          position: sticky;
          top: 0;
          left: 0;
          padding: 0 16px;
          background: #F8F8F8;

          img {
            width: 24px;
            height: 24px;
            max-width: 24px;
          }
        }

        &--content {
          padding-left: 16px;
          padding-right: 16px;

          .sub-title {
            font-size: 18px;
          }

          &-main {
            max-height: 550px;

            &::-webkit-scrollbar {
              display: none;
            }
          }
        }
      }

      .pos-order__info {
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        border-top-right-radius: 32px;
        background-color: white;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
        padding: 16px 24px;

        &--total {
          font-size: 18px;
          font-weight: 700;
          align-self: center;
          margin-left: 16px;
        }
      }

      .po-order-table {
        display: block;
        width: 100%;
        z-index: 10;
        position: fixed;
        top: 0;
        left: 0;
        height: calc(100% - 72px);
      }
    }

    .pos-order__right {
      .po-order-table {
        display: none
      }
    }
  }
</style>
