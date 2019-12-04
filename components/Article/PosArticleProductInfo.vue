<template>
  <div class="article-wrapper" style="height: 226px">
    <p class="category-title" style="">Category</p>
    <p class="category-content" v-if="activeCategory && activeCategory._id">{{ activeCategory._id }}</p>
    <p class="product-title">Product</p>

    <div class="product-content-left" v-if="articleSelectedProductButton">
      <div>
        <p style="font-size: 15px; line-height: 19px">{{ articleSelectedProductButton.name }}</p>
        <p class="product-info">#{{articleSelectedProductButton.id }}</p>
      </div>
      <div style="display: block; margin-top: 5px;">
        <p class="sub-title">Unit </p>
        <p class="product-info" v-if="articleSelectedProductButton && articleSelectedProductButton.unit">{{ articleSelectedProductButton.unit }}</p>
      </div>
      <div style="margin-top: 5px;">
        <p class="sub-title">Price </p>
        <p class="product-info" v-if="articleSelectedProductButton && articleSelectedProductButton.price">€ {{ articleSelectedProductButton.price }}</p>
      </div>
    </div>
    <div class="product-content-right">
      <div>
        <p class="sub-title">Barcode </p>
        <p class="product-info" v-if="articleSelectedProductButton && articleSelectedProductButton.barcode">{{ articleSelectedProductButton.barcode }}</p>
      </div>
      <div style="margin-top: 5px;">
        <span class="sub-title">Attributes</span>
        <div v-if="productAttributes">
          <div class="product-info" v-for="(item, index) in productAttributes">
            <span class="product-info">{{item.key | capitalize}}: </span>
            <span class="product-info">{{item.values}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'PosArticleProductInfo',
    injectService: ['PosStore:(activeCategory, articleSelectedProductButton )'],
    filters: {
      capitalize: function (value) {
        if (!value) {
          return ''
        }
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    methods: {
      mergeAttributes(attributes) {
        return _.map(_.groupBy(attributes, 'key'),
          val => ({
            key: val[0].key, values: _.reduce(val.map(v => v.value), function (concat, val, index) {
              if (index !== 0) {
                return concat + ', ' + val
              } else {
                return val
              }
            }, '')
          })
        )
      }
    },
    computed: {
      productAttributes() {
        if (!this.articleSelectedProductButton || !this.articleSelectedProductButton.attributes) {
          return []
        }

        let attributes = this.articleSelectedProductButton.attributes;
        return this.mergeAttributes(attributes);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .product-info {
    font-size: 14px;
    line-height: 18px;
  }

  .sub-title {
    font-size: 13px;
    opacity: 0.5;
  }

  .article-wrapper {
    display: grid;
    grid-template-rows: 30% 70%;
    grid-template-columns: 16% 1fr 1fr;
    height: 100%
  }

  .product-content-left {
    grid-column: 2 /3;
    grid-row: 2 / 3;
    padding: 12px 28px 45px 5px;
    width: 100%;
    height: 100%
  }

  .product-content-right {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
    padding: 12px 28px 45px 17px;
    width: 100%;
    height: 100%
  }

  .product-title {
    padding: 12px 9px 23px 17px;
    grid-row: 2 / 3;
    grid-column: 1 / 2;
    font-family: 'Muli', serif;
    font-size: 13px;
    font-weight: normal;
    line-height: 16px;
    color: #1D1D26;
  }

  .category-title {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    font-family: 'Muli', serif;
    padding: 23px 9px 23px 17px;
    font-size: 13px;
    font-weight: normal;
    line-height: 16px;
    color: #1D1D26;
  }

  .category-content {
    grid-row: 1 / 2;
    grid-column: 2 / 4;
    font-family: 'Muli', serif;
    font-size: 14px;
    font-weight: bold;
    line-height: 18px;
    padding: 23px 8px 17px 5px;
  }
</style>
