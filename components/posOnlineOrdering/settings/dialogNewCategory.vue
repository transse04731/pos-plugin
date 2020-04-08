<template>
  <g-dialog v-model="internalValue" width="40%" eager>
    <div class="dialog">
      <div class="dialog-title">Add New Category</div>
      <g-text-field-bs large label="Category Name:" v-model="category"/>
      <div class="dialog-buttons">
        <g-btn-bs width="100" large text-color="#424242" @click="internalValue = false">Cancel</g-btn-bs>
        <g-btn-bs width="100" large text-color="white" background-color="indigo-accent-2" :disabled="invalid"
                  @click="submit">OK
        </g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: "dialogNewCategory",
    props: {
      value: null,
    },
    data() {
      return {
        category: ''
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set(val) {
          this.category = ''
          this.$emit('input', val)
        }
      },
      invalid() {
        return false
      }
    },
    methods: {
      submit() {
        this.$emit('submit', this.category)
        this.internalValue = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog {
    background: white;
    border-radius: 4px;
    width: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;

    &-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 28px;
    }

    &-buttons {
      display: flex;
      align-self: flex-end;
      margin-top: 24px;
      margin-right: -8px;
    }
  }
</style>
