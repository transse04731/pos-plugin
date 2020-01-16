<template>
  <g-dialog v-model="dialogSelectAvatar" overlay-color="#6b6f82" overlay-opacity="0.95" width="90%" eager>
    <div class="dialog-select-avatar">
      <div class="header">
        <span>Select User Avatar</span>
        <g-icon svg size="20" @click="dialogSelectAvatar = false">icon-close</g-icon>
      </div>
      <div class="content">
        <g-item-group :items="listAvatars" v-model="selectedAvatar">
          <template v-slot:item="{item, toggle, active}">
            <g-badge v-model="active" overlay>
              <template v-slot:badge>
                <g-icon style="font-size: 20px; font-weight: bold">done</g-icon>
              </template>
              <g-avatar size="72" :class="['ma-3', active && 'avatar__selected']">
                <img :alt="item.name" :src="item.image" @click="toggle(item)"/>
              </g-avatar>
            </g-badge>
          </template>
        </g-item-group>
      </div>
      <div class="action">
        <g-btn :uppercase="false" outlined class="mr-3" width="120" @click="dialogSelectAvatar = false">Cancel</g-btn>
        <g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" width="120" @click="submit">OK</g-btn>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  export default {
    name: 'dialogSelectAvatar',
    props: {
      value: null,
    },
    data() {
      return {
        listAvatars: [],
        selectedAvatar: null
      }
    },
    injectService: [
        'PosStore:selectedUser',
        'PosStore:updateUser',
        'PosStore:getListAvatar'
    ],
    computed: {
      dialogSelectAvatar: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
    },
    methods: {
      async submit() {
        this.selectedUser.avatar = this.selectedAvatar.image;
        this.selectedUser.prepend = this.selectedAvatar.image;
        this.dialogSelectAvatar = false;
        await this.updateUser(this.selectedUser._id, this.selectedUser);
      }
    },
    async mounted() {
      this.listAvatars = await this.getListAvatar();
    },
    watch: {
      value: function () {
        let checkEqual = false;
        for(const avatar of this.listAvatars) {
          if(avatar.image === this.selectedUser.avatar) {
            this.selectedAvatar = avatar;
            checkEqual = true;
          }
        }
        if(!checkEqual) {
          this.selectedAvatar = null;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .dialog-select-avatar {
    width: 100%;
    background: #fff;
    padding: 16px;
    border-radius: 8px;

    .header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
      color: #1D1D26;
      margin-bottom: 32px;
    }

    .content {

      .g-item-group {
        flex-wrap: wrap !important;
      }

      ::v-deep .g-avatar {
        box-sizing: content-box;
        border: 2px solid transparent;

        &.avatar__selected {
          border: 2px solid #1271ff;
        }
      }

      ::v-deep .g-badge {
        transform: translate(-65%, 65%) !important;
        padding: 0 !important;
      }

    }

    .action {
      margin-top: 32px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
