<template>
  <div>
    <!-- Product info -->
    <div style="display: grid;
                grid-template-columns: 40px 106px 1fr;
                grid-gap: 15px;
                height: 160px;
                background-color: #fff;
                align-items: center;
                border-bottom: 1px solid #E0E0E0">
      <div style="text-align: center">{{ index + 1 }}</div>
      <div style="width: 106px; height: 106px; border-radius: 5px; border: 1px dashed #F00" @click="uploadImage">
        <img v-if="internalImage" :src="internalImage" style="opacity: 0.8; width: 100%; height: 100%"/>
      </div>
      <div style="height: 106px;
                display: grid;
                grid-template-columns: 1fr 200px;
                grid-template-rows: 40% 60%;
                grid-gap: 5px">
        <g-text-field-bs v-model="internalName" placeholder="Name *" style="grid-area: 1/1/2/2"/>
        <g-text-field-bs v-model="internalPrice" placeholder="Price *" style="grid-area: 1/2/2/3;"/>
        <g-text-field-bs dense v-model="internalDesc" placeholder="Description" style="grid-area: 2/1/3/2" row="2"/>
        <div style="grid-area: 2/2/3/3">
          <div>Tax:</div>
          <div>
            <g-grid-select mandatory v-model="internalTax" :items="taxes" itemCols="auto">
              <template #default="{ toggleSelect, item, index }">
                <div @click="e => {toggleSelect(item); internalTax = item;}">
                  {{item.text}}
                </div>
              </template>
              <template #selected="{ toggleSelect, item, index }">
                <div @click="e => {toggleSelect(item); internalTax = item;}">
                  {{item.text}}
                </div>
              </template>
            </g-grid-select>
          </div>
        </div>
      </div>
    </div>
    <!-- Action button -->
    <div style="display: flex; justify-content: flex-end">
      <g-btn @click="$emit('cancel')">Cancel</g-btn>
      <g-btn @click="saveMenuItem">Save</g-btn>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'NewMenuItem',
    props: {
      index: Number,
      name: String,
      desc: String,
      price: [String, Number],
      tax: Number,
      image: String
    },
    data: function () {
      return {
        internalName: this.name,
        internalDesc: this.desc,
        internalPrice: this.price,
        internalTax: this.tax,
        internalImage: this.image,
        // TODO: Link database
        taxes: [{ text: '19%', value: 19 }, { text: '7%', value: 7 }]
      }
    },
    methods: {
      uploadImage() {
        // TODO: File-upload function
      },
      saveMenuItem() {
        this.$emit('save', {
          image: this.internalImage,
          name: this.internalName,
          desc: this.internalDesc,
          price: this.internalPrice,
          tax: this.internalTax,
        })
      }
    }
  }
</script>
<style scoped lang="scss">
</style>
