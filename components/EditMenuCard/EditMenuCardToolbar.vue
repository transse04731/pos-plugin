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
        switch(this.targetLayout) {
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
        this.$router.push({path: '/view/pos-dashboard'})
      },
      switchItem() {
        // store to prev
        if (this.view.name === 'CategoryEditor') {
          this.prevCategoryLayout = this.selectedCategoryLayout
        } else if (this.view.name === 'ProductEditor') {
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
            case 'copy':
              await this.copyCategory()
              break;
          }
        }

        if (this.prevProductLayout && this.prevTargetLayout === 'product') {
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
        // TODO: Fix bug
        // TODO: Bulk update
        let qry = { 'categories._id': this.prevCategoryLayout._id }
        let set = { $set: { 'categories.$.top' : this.selectedCategoryLayout.top, 'categories.$.left': this.selectedCategoryLayout.left } }
        let orderLayout = await cms.getModel('OrderLayput').findOneAndUpdate(qry, set, { new: true })

        if (this.selectedCategoryLayout._id) {
          orderLayout = await cms.getModel('OrderLayput').findOneAndUpdate(
              { 'categories._id': this.selectedCategoryLayout._id },
              { $set: { 'categories.$.top' : this.prevCategoryLayout.top, 'categories.$.left': this.prevCategoryLayout.left } },
              { new: true })
        }
        // clear previous
        this.prevCategoryLayout = null
        this.prevTargetLayout = null
        this.action = null
        this.$emit('update:orderLayout', orderLayout)
      },
      async copyCategory() {

      },

      async switchProduct() {

      },
      async copyProduct() {

      },

      async deleteItem() {
        if (!this.view) return
        if (this.view.name === 'CategoryEditor') {
          const orderLayout = await cms.getModel('OrderLayout').findOneAndUpdate(
              { _id: this.orderLayout._id },
              { $pull: { categories: { _id: this.selectedCategoryLayout._id} } },
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
