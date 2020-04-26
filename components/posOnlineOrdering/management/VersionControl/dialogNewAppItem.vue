<template>
  <g-dialog v-if="internalValue" v-model="internalValue" width="580" eager>
    <div class="dialog">
      <div class="dialog__title">{{edit ? 'Edit' : 'Add New'}} Version</div>
      <div class="dialog__content">
        <div class="row-flex align-items-end" v-if="!edit">
          <g-text-field-bs readonly label="File" large v-model="internalName"/>
          <g-btn-bs width="120" large background-color="#EFEFEF" border-color="#9E9E9E" text-color="#424242" @click="selectFile">Select file</g-btn-bs>
        </div>
        <div class="row-flex">
          <div class="col-6">
            <g-select :class="[edit && 'disabled']" text-field-component="GTextFieldBs" :items="listGroup" label="Group" v-model="internalGroup"/>
          </div>
          <div class="col-6">
            <g-text-field-bs :disabled="edit" large label="Version" v-model="internalVersion"/>
          </div>
        </div>
        <div class="row-flex">
          <div class="col-6">
            <g-select :class="[edit && 'disabled']" text-field-component="GTextFieldBs" :items="listType" label="Type" v-model="internalType"/>
          </div>
          <div class="col-6">
            <g-select :class="[edit && 'disabled']" text-field-component="GTextFieldBs" :items="listBaseVersion" label="Base Version" v-model="internalBase"/>
          </div>
        </div>
        <g-select text-field-component="GTextFieldBs" :items="listRelease" label="Release" v-model="internalRelease"/>
        <div>
          <p>Note</p>
          <g-textarea outlined no-resize :rows="3" v-model="internalNote"/>
        </div>
      </div>
      <div class="dialog__action">
        <g-btn-bs large text-color="#424242" @click="internalValue = false">Cancel</g-btn-bs>
        <g-btn-bs :disabled="!internalName || !internalGroup || !internalType || !internalVersion || !internalRelease"
                  large background-color="indigo accent-2" text-color="white" @click="upload">
          Upload
        </g-btn-bs>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  import _ from 'lodash'
  
  export default {
    name: "dialogNewAppItem",
    props: {
      value: Boolean,
      edit: Boolean,
      version: String,
      group: String,
      type: String,
      base: String,
      release: String,
      note: String,
      listGroup: Array,
      listBaseVersions: Array,
      listRelease: Array,
      listType: Array
    },
    data() {
      return {
        internalName: '',
        internalGroup: this.group,
        internalVersion: this.version,
        internalType: this.type,
        internalBase: this.base,
        internalRelease: this.release,
        internalNote: this.note,
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
      },
      listBaseVersion() {
        const listBaseVersionModel = _.find(this.listBaseVersions, v => v.group === this.internalGroup)
        if (listBaseVersionModel)
          return listBaseVersionModel.versions
        else
          return []
      }
    },
    watch: {
      value() {
        this.internalName = ''
        this.internalGroup = this.edit ? this.group : ''
        this.internalVersion = this.edit ? this.version : ''
        this.internalType = this.edit ? this.type : ''
        this.internalBase = this.edit ? this.base : ''
        this.internalRelease = this.edit ? this.release : ''
        this.internalNote = this.edit ? this.note : ''
      }
    },
    methods: {
      selectFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.addEventListener('change', e => {
          document.body.removeChild(input);
          this.file = e.target.files[0]
          this.internalName = e.target.files[0].name
        });
        document.body.appendChild(input);
        input.style.display = 'none';
        input.click()
      },
      upload() {
        if (this.edit) {
          this.$emit('edit', {
            group: this.internalGroup,
            version: this.internalVersion,
            type: this.internalType,
            base: this.internalBase,
            release: this.internalRelease,
            note: this.internalNote
          })
        } else {
          if (!this.file) {
            alert('No file selected')
            return
          }
          
          this.$emit('add', {
            file: this.file,
            group: this.internalGroup,
            version: this.internalVersion,
            type: this.internalType,
            base: this.internalBase,
            release: this.internalRelease,
            note: this.internalNote
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
