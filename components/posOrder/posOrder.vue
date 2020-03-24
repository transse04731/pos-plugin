<template>
  <div class="order-detail">
    <div class="order-detail__header">
      <g-avatar size="36">
        <img src="../../assets/customer_ava.svg">
      </g-avatar>
      <span class="order-detail__header-username">{{username}}</span>
      <span class="order-detail__header-title">Table</span>
      <span class="order-detail__header-value">{{table}}</span>
      <span class="order-detail__header-title">Total</span>
      <span class="order-detail__header-value text-red">€{{total}}</span>
    </div>
    <div class="order-detail__content">
      <div v-for="(item, i) in items" :key="i" class="item">
        <div class="item-detail">
          <div>
            <p class="item-detail__name">{{item.id}}. {{item.name}}</p>
            <p>
              <span :class="['item-detail__price', item.newPrice && 'item-detail__discount']">€{{item.price}}</span>
              <span class="item-detail__price--new" v-if="item.newPrice">€ {{item.newPrice}}</span>
              <span :class="['item-detail__option', item.option === 'Take away' ? 'text-green-accent-3' : 'text-red-accent-2']">{{item.option}}</span>
            </p>
          </div>
          <div class="item-action">
            <g-icon @click.stop="removeItem(item)">remove_circle_outline</g-icon>
            <span>{{item.quantity}}</span>
            <g-icon @click.stop="addItem(item)">add_circle_outline</g-icon>
          </div>
        </div>
        <div v-if="item.attachments">
          <g-chip label small text-color="#616161" v-for="attachment in item.attachments">{{attachment.title}} | €{{attachment.value}}</g-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "posOrder",
    props: {
      total: Number,
      items: Array,
    },
    data() {
      return {
        username: 'Admin',
        table: 50,
      }
    },
    methods: {
      addItem(item) {
        this.$emit('addItemQuantity', item)
      },
      removeItem(item) {
        this.$emit('removeItemQuantity', item)
      }
    }
  }
</script>

<style scoped lang="scss">
  .order-detail {
    padding: 0 8px;
    background: white;
    color: #1d1d26;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);

    &__header {
      display: flex;
      align-items: center;
      padding: 8px 0;

      &-username {
        font-weight: 700;
        font-size: 13px;
        margin-left: 8px;
        flex-grow: 1;
      }

      &-title {
        opacity: 0.5;
        margin-left: 16px;
        font-size: 11px;
        font-weight: 600;
      }

      &-value {
        font-size: 18px;
        font-weight: 600;
        margin-left: 4px;
      }
    }

    &__content {
      border-radius: 8px;
      border: 1px solid #e8e8e8;

      .item {
        padding: 8px;

        &:nth-child(even) {
          background-color: #f8f8f8;
        }

        &-detail {
          display: flex;
          justify-content: space-between;

          &__name {
            font-weight: 700;
            font-size: 14px;
          }

          &__price {
            font-size: 12px;
            color: #616161;
            margin-right: 4px;

            &--new {
              font-size: 14px;
              color: #ff5252;
              margin-right: 4px;
            }
          }

          &__discount {
            text-decoration: line-through;
          }

          &__option {
            font-size: 12px;
            font-style: italic;
            font-weight: 700;
          }
        }

        &-action {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-basis: 25%;

          .g-icon {
            cursor: pointer;
            color: #1d1d26;
          }
        }
      }
    }
  }
</style>
