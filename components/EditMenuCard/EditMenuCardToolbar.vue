<template>
  <g-toolbar height="100%" elevation="0" color="#eee">
    <g-btn-bs icon="icon-back" @click="back">Back</g-btn-bs>
    <g-btn-bs icon="icon-edit-menu-card-switch" @click="switchItem" :disabled="!switchable">Switch</g-btn-bs>
    <g-btn-bs icon="icon-edit-menu-card-copy" @click="copyItem" :disabled="!copyable">Copy</g-btn-bs>
    <g-spacer/>
    <g-btn-bs icon="icon-edit-menu-card-delete" @click="deleteItem" :disabled="!deletable">Delete</g-btn-bs>
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
      selectedProductLayout: null,
      productDblClicked: null,
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
      switchable() {
        switch (this.targetLayout) {
          case 'product':
            return (this.selectedProductLayout && this.selectedProductLayout._id)
          case 'category':
            return (this.selectedCategoryLayout && this.selectedCategoryLayout._id)
        }
      },
      copyable() {
        if (this.targetLayout)
            return (this.selectedProductLayout && this.selectedProductLayout._id)
      },
      deletable() {
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
        this.action && this.doCategoryAction()
      },
      selectedProductLayout() {
        // when the user switch to another category, product will be set to null.
        if (!this.selectedProductLayout)
          return;
        this.action && this.doProductAction()
      },
      productDblClicked() {
        if (this.productDblClicked) {
          this.switchItem()
        }
      }
    },
    methods: {
      back() {
        this.$router.push({ path: '/view/pos-dashboard' })
      },
      storePreviousInfo(){
        if (this.view.name === 'CategoryEditor') {
          this.prevCategoryLayout = this.selectedCategoryLayout
        } else if (this.view.name === 'ProductEditor') {
          this.prevCategoryLayout = this.selectedCategoryLayout
          this.prevProductLayout = this.selectedProductLayout
        }
        this.prevTargetLayout = this.targetLayout
      },
      switchItem() {
        this.storePreviousInfo()
        this.action = 'switch'
      },
      copyItem() {
        this.storePreviousInfo()
        this.action = 'copy'
      },
      async doCategoryAction() {
        if (this.prevCategoryLayout && this.prevTargetLayout === 'category') {
          if (this.action === 'switch')
            await this.switchCategory()
        }
      },
      async doProductAction() {
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
        this.clearCategoryAction()
        this.$emit('update:orderLayout', orderLayout)
      },
      clearCategoryAction() {
        console.log('clear category action')
        this.prevCategoryLayout = null
        this.prevTargetLayout = null
        this.action = null
      },

      async switchProduct() {
        console.log('switchProduct')
        if (this.prevCategoryLayout._id === this.selectedCategoryLayout._id) {
          console.log('switch product in same category')
          let result = await cms.getModel('OrderLayout').findOneAndUpdate(
              { 'categories.products._id': this.prevProductLayout._id },
              {
                $set: {
                  ['categories.$[cate].products.$[product].top']: this.selectedProductLayout.top,
                  ['categories.$[cate].products.$[product].left']: this.selectedProductLayout.left,
                }
              },
              {
                arrayFilters: [{ 'cate._id': this.prevCategoryLayout._id }, { 'product._id': this.prevProductLayout._id }],
                new: true
              });

          // switch dst -> src
          if (this.selectedProductLayout._id) {
            result = await cms.getModel('OrderLayout').findOneAndUpdate(
                { 'categories.products._id': this.selectedProductLayout._id },
                {
                  $set: {
                    [`categories.$[cate].products.$[product].top`]: this.prevProductLayout.top,
                    [`categories.$[cate].products.$[product].left`]: this.prevProductLayout.left,
                  }
                }, {
                  arrayFilters: [{ 'cate._id': this.selectedCategoryLayout._id }, { 'product._id': this.selectedProductLayout._id }],
                  new: true
                });
          }

          this.clearProductAction()
          this.$emit('update:orderLayout', result)
        } else {
          // switch in 2 categories
          console.log('TODO: switching products between category is not implemented')
        }
      },
      async copyProduct() {
        console.log('copyProduct')
        // doesn't allow overwrite existed product
        if (this.selectedProductLayout._id) {
          console.log('Product existed in selected position. Skip copy.')
          return;
        }
        const product = await cms.getModel('Product').create({
          ...this.copyProductInfo(this.prevProductLayout.product)
        });
        const productLayout = {
          product: product._id,
          ..._.pick(this.selectedProductLayout, ['top', 'left']),
          ..._.pick(this.prevProductLayout, ['color', 'type', 'text'])
        }
        const result = await cms.getModel('OrderLayout').findOneAndUpdate(
            { 'categories._id' : this.selectedCategoryLayout._id },
            { $push: { 'categories.$.products' : productLayout } },
            { new: true });
        this.clearProductAction()
        this.$emit('update:orderLayout', result)
      },

      copyProductInfo(product) {
        if (!product) return
        const clone = {
          ...product,
          id: this.createNewProductId(product.id)
        }
        delete clone._id
        return clone
      },

      createNewProductId(id) {
        const idRegex = /^(?<digit>\d+)(?<alpha>\w)?$/g
        const result = idRegex.exec(id)
        if (!result)
          return id
        if (!result.groups.alpha)
          return Number(result.groups.digit) + 1
        return `${result.groups.digit}${String.fromCharCode(result.groups.alpha.charCodeAt(0) + 1) }`
      },

      clearProductAction() {
        console.log('clear product action')
        this.prevCategoryLayout = null
        this.prevProductLayout = null
        this.prevTargetLayout = null
        this.action = null
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
          this.$emit('update:view', { name: "CategoryEditor" })
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
