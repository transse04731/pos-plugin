<template>
  <g-dialog v-model="internalValue" width="580" eager>
    <div class="dialog">
      <div class="dialog__title">{{edit ? 'Edit' : 'Add New'}} Version</div>
      <div class="dialog__content">
        <div class="row-flex align-items-end">
          <g-text-field-bs readonly :disabled="edit" label="File" large v-model="_name"/>
          <g-btn-bs :disabled="edit" width="120" large background-color="#EFEFEF" border-color="#9E9E9E" text-color="#424242" @click="selectFile">Select file</g-btn-bs>
        </div>
        <div class="row-flex">
          <div class="col-6">
            <g-text-field-bs large label="Version" v-model="_version"/>
          </div>
          <div class="col-6">
            <g-select text-field-component="GTextFieldBs" :items="listType" label="Type" v-model="_type"/>
          </div>
        </div>
        <g-select text-field-component="GTextFieldBs" :items="listStatus" label="Status" v-model="_status"/>
        <div>
          <p>Changelog</p>
          <g-textarea outlined no-resize :rows="3" v-model="_changeLog"/>
        </div>
      </div>
      <div class="dialog__action">
        <g-btn-bs large text-color="#424242" @click="internalValue = false">Cancel</g-btn-bs>
        <g-btn-bs large background-color="indigo accent-2" text-color="white" @click="upload">Upload</g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: "dialogVersionControl",
    props: {
      value: Boolean,
      edit: Boolean,
      name: String,
      version: String,
      type: String,
      status: String,
      changeLog: String,
    },
    data() {
      return {
        listType: [
          {text: 'POS Android', value: 'POS Android'},
          {text: 'POS PC', value: 'POS PC'}
        ],
        listStatus: [
          {text: 'Private', value: 'private'},
          {text: 'Public', value: 'public'}
        ],
        _name: this.name || '',
        _version: this.version || '',
        _type: this.type || 'POS Android',
        _status: this.status || 'public',
        _changeLog: this.changeLog || '',
        file: null
      }
    },
    computed: {
      internalValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      selectFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.addEventListener('change', e => {
          document.body.removeChild(input);
          this._name = e.target.files['0'].name
        });
        document.body.appendChild(input);
        input.style.display = 'none';
        input.click()
      },
      upload() {
        if (this.edit) {
          this.$emit('edit', {
            version: this._version,
            type: this._type,
            status: this._status,
            changeLog: this._changeLog
          })
        } else {
          if (!this.file) {
            alert('No file selected')
            return
          }
          
          this.$emit('add', {
            file: this.file,
            name: this.file.name,
            version: this._version,
            type: this._type,
            status: this._status,
            changeLog: this._changeLog
          })
        }
        this.internalValue = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog {
    width: 100%;
    background-color: #FFFFFF;
    padding: 24px 32px 12px;
    border-radius: 4px;
    font-size: 14px;

    &__title {
      font-size: 24px;
      font-weight: 600;
      color: #212121;
      margin-bottom: 32px;
    }

    &__content {
      .g-textarea {
        margin-right: 4px;
        margin-top: 4px;
        width: calc(100% - 5px);

        ::v-deep fieldset {
          border-width: 1px !important;
          border-color: #ced4da;

          &:focus-within {
            border-color: #80bdff !important;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
            z-index: 2;
          }

          .g-tf-input {
            padding: 12px;
            font-size: 15px;
          }

          .g-tf-append__inner {
            display: none;
          }
        }
      }

      .g-select ::v-deep .bs-tf-label {
        font-size: 15px;
      }

      .bs-tf-wrapper ::v-deep .bs-tf-label {
        margin-bottom: 4px;
      }
    }

    &__action {
      display: flex;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .g-btn-bs {
      white-space: nowrap;
      margin-bottom: 16px;
      padding: 8px 16px;
      font-size: 14px;
    }
  }
</style>
