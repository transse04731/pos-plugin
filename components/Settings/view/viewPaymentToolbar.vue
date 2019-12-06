<template>
  <g-toolbar absolute bottom color="grey lighten 3">
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-2" @click="back">
      <g-icon class="mr-2" svg>
        icon-back
      </g-icon>
      Back
    </g-btn>
    <g-spacer/>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-2" @click="openDialogNewPayment">
      <g-icon class="mr-2" >
        add_circle
      </g-icon>
      Add
    </g-btn>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" class="mr-2" @click="openDialogEditPayment">
      <g-icon class="mr-2" color="red">
        edit
      </g-icon>
      Edit
    </g-btn>
    <g-btn :uppercase="false" background-color="white" text-color="#1d1d26" @click="openDialogDeletePayment">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
  </g-toolbar>
</template>

<script>
  export default {
    name: 'viewPaymentToolbar',
    injectService:[
      'PosStore:isEditPayment'
    ],
    methods: {
      openDialogNewPayment() {
        this.isEditPayment = false;
        this.$getService('dialogNewPayment:setActive')(true)
      },
      openDialogEditPayment() {
        this.isEditPayment = true;
        this.$getService('dialogNewPayment:setActive')(true)
      },
      openDialogDeletePayment() {
        this.$getService('dialogDeletePayment:setActive')(true)
      },
      back() {
        this.$router.push({ path: '/view/test-pos-dashboard' })
      }
    }
  }
</script>

<style scoped>

</style>