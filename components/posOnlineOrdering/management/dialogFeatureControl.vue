<template>
  <g-dialog v-model="value" @input="close">
    <div class="dlg-feature-control">
      <div class="dlg-feature-control__title">Feature control</div>
      <div class="dlg-feature-control__header">
        <span class="dlg-feature-control__header__group">{{group}}</span>
        <span class="dlg-feature-control__header__device-info">{{deviceInfo}}</span>
      </div>
      <div class="dlg-feature-control__body">
        <div class="w-50">
          <g-switch v-model="featureControl.fastCheckout" label="Fast Checkout"/>
        </div>
        <div class="w-50">
          <g-switch v-model="featureControl.manualTable" label="Fast Checkout"/>
        </div>
        <div class="w-50">
          <g-switch v-model="featureControl.delivery" label="Fast Checkout"/>
        </div>
        <div class="w-50">
          <g-switch v-model="featureControl.editMenuCard" label="Fast Checkout"/>
        </div>
        <div class="w-50">
          <g-switch v-model="featureControl.tablePlan" label="Fast Checkout"/>
        </div>
        <div class="w-50">
          <g-switch v-model="featureControl.editTablePlan" label="Fast Checkout"/>
        </div>
        <span class="line"/>
        <div class="w-50">
          <g-switch v-model="featureControl.onlineOrdering" label="Fast Checkout"/>
          <div>Note: Only one device can connect to online ordering at a time.</div>
        </div>
        <span class="line"/>
        <div class="w-50">
          <g-switch v-model="featureControl.staffReport" label="Fast Checkout"/>
        </div>
        <div class="w-50">
          <g-switch v-model="featureControl.eodReport" label="Fast Checkout"/>
        </div>
        <div class="w-50">
          <g-switch v-model="featureControl.monthlyReport" label="Fast Checkout"/>
        </div>
      </div>
      <div class="dlg-feature-control__actions">
        <g-btn-bs @click="close">Cancel</g-btn-bs>
        <g-btn-bs background-color="#536DFE" text-color="#FFF" @click="save">Save</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>
<script>
  export default {
    name: 'dialogFeatureControl',
    props: {
      value: Boolean,
      device: Object
    },
    data: function () {
      return {
        featureControl: {
          fastCheckout: true,
          manualTable: true,
          delivery: true,
          editMenuCard: true,
          tablePlan: true,
          editTablePlan: true,
          staffReport: true,
          eodReport: true,
          monthlyReport: true
        }
      }
    },
    computed: {
      deviceInfo() {
        return `${device.name}, ${device.hardware}, ${device.appName}, ${device.appVersion}, ${device.appRelease}`
      }
    },
    methods: {
      close() {
        this.$emit('input', false)
      },
      save() {
        this.$emit('save', this.featureControl)
      }
    }
  }
</script>
<style scoped lang="scss">
  .dlg-feature-control {
    padding: 40px;
    
    &__title {
      font-weight: 600;
      font-size: 24px;
      color: #212121;
    }
    
    &__header {
      &__group {
        font-weight: bold;
        font-size: 16px;
      }
      
      &__device-info {
        font-size: 14px;
        color: #201F2B;
      }
    }
    
    &__body {
      margin-bottom: 40px;
    }
    
    &__actions {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
