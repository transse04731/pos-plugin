<template>
  <div class="pa-2" style="padding: 17px 28px 45px 5px; width: 100%; height: 100%">
    <div>
      <p style="font-size: 15px; line-height: 19px">{{productName}}</p>
      <p class="product-info">{{productId}}</p>
    </div>
    <div style="display: block; margin-top: 5px;">
      <p class="sub-title">Unit </p>
      <p class="product-info">{{productUnit}}</p>
    </div>
    <div style="margin-top: 5px;">
      <p class="sub-title">Price </p>
      <p class="product-info">{{productPriceUnit}} {{productPrice}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ArticleProductContentLeft',
    data: () => ({
      productName: 'Product Name 01',
      productId: '#037187408',
      productUnit: 'Box',
      productPrice: '321',
      productPriceUnit: '€',

    })
  }
</script>

<style lang="scss" scoped>
  div p, div span{
    font-family: 'Muli', serif;
    margin-bottom: 0;
  }

  .sub-title {
    font-size: 13px;
    opacity: 0.5;
  }

  .product-info {
    font-size: 14px;
    line-height: 18px;
  }
</style>
