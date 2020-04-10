<template>
  <div class="delivery-fee">
    <div class="delivery-fee__title">Delivery Fee</div>
    <div class="delivery-fee__content">
      <div class="delivery-fee__content-header">
        <div class="col-9">Zip code includes</div>
        <div class="col-3">Fee (€)</div>
      </div>
      <div class="delivery-fee__content-main">
        <div class="delivery-fee__content-item" v-for="(item, i) in items" :key="i">
          <div class="item-code col-9">
            <input type="text" v-model="item.code"/>
          </div>
          <div class="item-fee col-2">
            <input type="numer" v-model="item.fee" placeholder="€"/>
          </div>
          <div class="item-btn--delete col-1">
            <g-icon size="16" color="#424242">icon-close</g-icon>
          </div>
        </div>
        <div class="item-btn--add">
          <g-icon size="40" color="#2979FF">add</g-icon>
        </div>
      </div>
      <g-switch v-model="acceptOtherZipCode" label="Accept orders with other zip codes"/>
      <div class="row-flex align-items-center">
        <span class="fw-700 mr-2 nowrap">Shipping fee for other zip codes</span>
        <g-text-field-bs class="bs-tf__pos col-2" v-model="otherFee"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DeliveryFee",
    props: {

    },
    data() {
      return {
        items: [
          {code: '12345', fee: 5},
          {code: 'EH12345', fee: 1},
        ],
        acceptOtherZipCode: true,
        otherFee: ''
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  .delivery-fee {
    font-size: 14px;

    &__title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    &__content {
      width: 70%;
      background: white;
      border-radius: 4px;
      padding: 30px;

      &-header {
        display: flex;
        font-weight: 700;
        margin-bottom: 16px;
      }

      &-item {
        border-radius: 4px;
        border: 1px solid #EFEFEF;
        margin-bottom: 8px;
        display: flex;
        background: #EFEFEF;


        .item-code,
        .item-fee {
          padding: 12px 16px;
          font-weight: 700;
          background: #FAFAFA;
          border-right: 1px solid #EFEFEF;
          display: flex;

          input {
            width: 0;
            flex: 1;
            outline: none;
            font-size: 14px;
            background: transparent;
          }
        }

        .item-code {
          border-radius: 4px 0 0 4px;
        }

        .item-fee {
          border-radius: 0 4px 4px 0;
        }

        .item-btn--delete {
          border-radius: 0 4px 4px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }

      .item-btn--add {
        background: #E3F2FD;
        border: 2px dashed #BBDEFB;
        border-radius: 2px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    .g-switch ::v-deep .g-switch-label {
      font-size: 14px;
    }
  }
</style>
