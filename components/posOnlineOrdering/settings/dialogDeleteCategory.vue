<template>
  <g-dialog v-model="internalValue" width="40%" eager>
    <div class="dialog">
      <div class="dialog-title">Delete category</div>
      <img alt src="/plugins/pos-plugin/assets/trash_bin.svg"/>
      <div class="dialog-message">Are you sure you want to delete this category?</div>
      <div class="dialog-action">
        <g-btn-bs large text-color="#424242" @click="internalValue = false">Cancel</g-btn-bs>
        <g-btn-bs large background-color="#FF5252" text-color="white" @click="confirm">Delete</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: "dialogDeleteCategory",
    props: {
      value: null
    },
    computed: {
      internalValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm')
        this.internalValue = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog {
    width: 100%;
    background-color: #FFFFFF;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;

    &-title {
      font-size: 24px;
      font-weight: 600;
      align-self: flex-start;
      color: #212121;
      margin-bottom: 32px;
    }

    &-message {
      font-size: 15px;
      color: #333333;
    }

    &-action {
      display: flex;
      align-self: flex-end;
      margin-top: 32px;

      .g-btn-bs {
        padding: 8px 24px;
      }
    }
  }
</style>
