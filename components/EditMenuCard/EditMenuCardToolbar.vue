<template>
  <g-toolbar height="100%" elevation="0" color="#eee">
    <g-btn-bs icon="icon-back" @click="back">Back</g-btn-bs>
    <g-btn-bs icon="icon-edit-menu-card-switch" @click="switchItem" :disabled="!doAble">Switch</g-btn-bs>
    <g-btn-bs icon="icon-edit-menu-card-copy" @click="copyItem" :disabled="!doAble">Copy</g-btn-bs>
    <g-spacer/>
    <g-btn-bs icon="icon-edit-menu-card-delete" @click="deleteItem" :disabled="!doAble">Delete</g-btn-bs>
  </g-toolbar>
</template>
<script>
  import _ from 'lodash'

  export default {
    name: 'EditMenuCardToolbar',
    props: {
      view: null,
      orderLayout: null,
      selectedCategoryLayout: null,
      selectedProductLayout: null
    },
    data: function () {
      return {
        targetLayout: null, // category or product
        prevCategoryLayout: null,
        prevProductLayout: null,
        prevTargetLayout: null,
        action: null
      }
    },
    computed: {
      doAble() {
        switch (this.targetLayout) {
          case 'product':
            return (this.selectedProductLayout && this.selectedProductLayout._id)
          case 'category':
            return (this.selectedCategoryLayout && this.selectedCategoryLayout._id)
        }
      }
    },
    watch: {
      view(value) {
        if (value) {
          if (value.name === 'CategoryEditor') {
            this.targetLayout = 'category'
          } else if (value.name === 'ProductEditor') {
            this.targetLayout = 'product'
          }
        }
      },
      selectedCategoryLayout() {
        console.log('selectedCategoryLayout changed')
        this.doAction()
      },
      selectedProductLayout() {
        console.log('selectedProductLayout changed')
        this.doAction()
      }
    },
    methods: {
      back() {
        this.$router.push({ path: '/view/pos-dashboard' })
      },
      switchItem() {
        // store to prev
        if (this.view.name === 'CategoryEditor') {
          this.prevCategoryLayout = this.selectedCategoryLayout
        } else if (this.view.name === 'ProductEditor') {
          this.prevCategoryLayout = this.selectedCategoryLayout
          this.prevProductLayout = this.selectedProductLayout
        }
        this.prevTargetLayout = this.targetLayout
        this.action = 'switch'
      },
      copyItem() {
        // if id is number -> increase: 11 -> 12
        // if id is number but end id text -> keep number, increase text: 11a -> 11b
      },
      async doAction() {
        console.log('doAction')
        if (this.prevCategoryLayout && this.prevTargetLayout === 'category') {
          switch (this.action) {
            case 'switch':
              await this.switchCategory()
              break;
          }
        }

        if (this.selectedCategoryLayout._id && this.prevProductLayout && this.prevTargetLayout === 'product') {
          switch (this.action) {
            case 'switch':
              await this.switchProduct()
              break;
            case 'copy':
              await this.copyProduct()
              break;
          }
        }
      },

      async switchCategory() {
        console.log('switch category')
        let qry = { 'categories._id': this.prevCategoryLayout._id }
        let set = { $set: { 'categories.$.top': this.selectedCategoryLayout.top, 'categories.$.left': this.selectedCategoryLayout.left } }
        console.log('qry', qry, 'set', set)
        let orderLayout = await cms.getModel('OrderLayout').findOneAndUpdate(qry, set, { new: true })

        //
        if (this.selectedCategoryLayout._id) {
          qry = { 'categories._id': this.selectedCategoryLayout._id }
          set = { $set: { 'categories.$.top': this.prevCategoryLayout.top, 'categories.$.left': this.prevCategoryLayout.left } }
          console.log('qry', qry, 'set', set)
          orderLayout = await cms.getModel('OrderLayout').findOneAndUpdate(qry, set, { new: true })
        }

        // clear previous action
        this.prevCategoryLayout = null
        this.prevTargetLayout = null
        this.action = null

        this.$emit('update:orderLayout', orderLayout)
      },

      async switchProduct() {
        console.log('this.selectedProductLayout', this.selectedProductLayout)
        console.log('switchProduct')
        if (this.prevCategoryLayout._id === this.selectedCategoryLayout._id) {
          console.log('switch product in same category')
          // switch src -> dst
          let qry = { 'categories.products._id': this.prevProductLayout._id }
          let set = {
            ['categories.$[cate].products.$[product].top']: this.selectedProductLayout.top,
            ['categories.$[cate].products.$[product].left']: this.selectedProductLayout.left,
          }
          let filter = [{ 'cate._id': this.prevCategoryLayout._id }, { 'product._id': this.prevProductLayout._id }]
          let result = await cms.getModel('OrderLayout').findOneAndUpdate(
              qry,
              { $set : set },
              { arrayFilters: filter, new: true });

          // switch dst -> src
          if (this.selectedProductLayout._id) {
            qry = { 'categories.products._id': this.selectedProductLayout._id }
            set = {
              [`categories.$[cate].products.$[product].top`]: this.prevProductLayout.top,
              [`categories.$[cate].products.$[product].left`]: this.prevProductLayout.left,
            };
            filter = [{ 'cate._id': this.selectedCategoryLayout._id }, { 'product._id': this.selectedProductLayout._id }]
            result = await cms.getModel('OrderLayout').findOneAndUpdate(qry, { $set : set }, { arrayFilters: filter, new: true });
          }

          this.prevCategoryLayout = null
          this.prevProductLayout = null
          this.prevTargetLayout = null
          this.action = null
          this.$emit('update:orderLayout', result)
        } else {
          // switch in 2 categories
        }
      },
      async copyProduct() {
        // doesn't allow overwrite existed product
        if (this.selectedProductLayout._id) {
          return;
        }

        const productLayout = {
          ...this.prevProductLayout.product,
          product: this.copyProductInfo(this.prevProductLayout.product),
          ..._.pick(this.selectedProductLayout, ['top', 'left', 'color', 'type', 'text'])
        }
        const productLayoutInfo = { ...this.prevProductLayout, }
      },

      async copyProductInfo(product) {
        if (!product) return
        return {
          ...product,
          _id: null,
          id: this.createNewProductId(product.id)
        }
      },

      async createNewProductId(id) {

      },

      async deleteItem() {
        if (!this.view) return
        if (this.view.name === 'CategoryEditor') {
          const orderLayout = await cms.getModel('OrderLayout').findOneAndUpdate(
              { _id: this.orderLayout._id },
              { $pull: { categories: { _id: this.selectedCategoryLayout._id } } },
              { new: true }
          )
          this.$emit('update:orderLayout', orderLayout)
          this.$emit('update:selectedCategoryLayout', null)
          // delete category layout
          // update category
        } else if (this.view.name === 'ProductEditor') {
          const orderLayput = await cms.getModel('OrderLayout').findOneAndUpdate(
              { 'categories._id': this.selectedCategoryLayout._id },
              { $pull: { 'categories.$.products': { _id: this.selectedProductLayout._id } } },
              { new: true }
          )
          this.$emit('update:orderLayout', orderLayput)
          this.$emit('update:selectedProductLayout', null)
        }
      },

    }
  }
</script>
<style scoped lang="scss">
  .g-btn-bs {
    background-color: white;
    font-size: 14px;
  }
</style>
