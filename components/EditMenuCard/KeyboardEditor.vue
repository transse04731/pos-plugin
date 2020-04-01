<template>
  <div class="keyboard-editor">
    <div class="keyboard-editor__title">Keyboard Top</div>
    <input-number width="148" v-model="top"/>
    <div class="keyboard-editor__title">Keyboard Left</div>
    <input-number width="148" v-model="left"/>
    <div class="keyboard-editor__title">Keyboard Width</div>
    <input-number width="148" v-model="width"/>
    <div class="keyboard-editor__title">Keyboard Height</div>
    <input-number width="148" v-model="height"/>
    <div class="keyboard-editor__title">Expansion Column</div>
    <div class="row-flex">
      <input-number width="148" :value="columns" @input="changeExtraColumns"/>
      <g-btn-bs elevation="2" icon="icon-redo" @click="resetKeyboard">Reset</g-btn-bs>
    </div>
    <g-checkbox v-model="active" label="Active Keyboard"/>
    <g-checkbox v-model="onlyShowInFirstPage" label="Show Keyboard only in first page"/>
    <g-checkbox v-model="x" label="Show 'x' Button"/>
  </div>
</template>

<script>
  export default {
    name: "KeyboardEditor",
    props: {
      keyboardConfig: null,
    },
    injectService: [
      'SettingsStore:(getPosSetting, updateKeyboardConfig)'
    ],
    computed: {
      top: {
        get() {
          if(this.keyboardConfig) {
            return this.keyboardConfig.top
          }
          return 1
        },
        set(val) {
          this._updateKeyboardConfig({top: val})
        }
      },
      left: {
        get() {
          if(this.keyboardConfig) {
            return this.keyboardConfig.left
          }
          return 1
        },
        set(val) {
          this._updateKeyboardConfig({left: val})
        }
      },
      width: {
        get() {
          if(this.keyboardConfig) {
            return this.keyboardConfig.width
          }
          return 1
        },
        set(val) {
          this._updateKeyboardConfig({width: val})
        }
      },
      height: {
        get() {
          if(this.keyboardConfig) {
            return this.keyboardConfig.height
          }
          return 1
        },
        set(val) {
          this._updateKeyboardConfig({height: val})
        }
      },
      active: {
        get() {
          if(this.keyboardConfig) {
            return this.keyboardConfig.active
          }
          return 1
        },
        set(val) {
          this._updateKeyboardConfig({active: val})
        }
      },
      onlyShowInFirstPage: {
        get() {
          if(this.keyboardConfig) {
            return this.keyboardConfig.onlyShowInFirstPage
          }
          return 1
        },
        set(val) {
          this._updateKeyboardConfig({onlyShowInFirstPage: val})
        }
      },
      x: {
        get() {
          if(this.keyboardConfig) {
            return this.keyboardConfig.x
          }
          return 1
        },
        set(val) {
          this._updateKeyboardConfig({x: val})
        }
      },
      columns() {
        if(this.keyboardConfig) {
          return _.max(this.keyboardConfig.layout.map(layout => layout.rows.length)) || 0
        }
        return 0
      }
    },
    methods: {
      async _updateKeyboardConfig(change) {
        const config = Object.assign({}, this.keyboardConfig)
        Object.assign(config, change)
        await this.updateKeyboardConfig(config)
        this.$emit('update:keyboardConfig', config)
      },
      async changeExtraColumns(val) {
        const config = Object.assign({}, this.keyboardConfig)
        const layout = config.layout
        if(val > this.columns) { //add column
          if(layout.length === 0) {
            while(layout.length < 4) {
              layout.push({rows: []})
            }
          }
          for(const l of layout) {
            l.rows.unshift(' ')
          }
        } else {
          for(const l of layout) {
            l.rows.shift()
          }
        }
        await this.updateKeyboardConfig(config)
        this.$emit('update:keyboardConfig', config)
      },
      async resetKeyboard() {
        const config = Object.assign({}, this.keyboardConfig)
        const layout = config.layout
        for(const l of layout) {
          l.rows = _.map(l.rows, key => ' ')
        }
        await this.updateKeyboardConfig(config)
        this.$emit('update:keyboardConfig', config)
      }
    },
  }
</script>

<style scoped lang="scss">
  .keyboard-editor {
    padding-left: 20px;

    &__title {
      margin-top: 16px;
      margin-bottom: 6px;
      font-weight: 700;
    }

    .g-checkbox-wrapper {
      margin-top: 16px;
      margin-left: 0;
    }
  }
</style>
