<template>
  <div style="padding: 17px 28px 45px 17px; width: 100%; height: 100%">
    <div>
      <p class="sub-title">Barcode: </p>
      <p class="product-info">{{productBarcode}}</p>
    </div>
    <div style="margin-top: 5px;">
      <span class="sub-title">Attribute:</span>
      <div class="product-info" :key="index" v-for="(attribute, index) in productAttributes">
        <span class="product-info">{{attribute.attribute}}: </span>
        <span class="product-info">{{attribute.attributeDetail}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ArticleProductContentRight',
    data: () => ({
      productBarcode: '89748173401744339',
      productAttributes: [
        { attribute: 'Color', attributeDetail: 'Black, White' },
        { attribute: 'Age', attributeDetail: '1-2yers, 0-6mths' }
      ],
    })
  }
</script>

<style scoped>
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
