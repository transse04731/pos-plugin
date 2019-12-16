<template>
  <fragment>
    <g-btn :uppercase="false" background-color="white" :disabled="isCurrentUser" text-color="#1d1d26" @click="openDialogDelete">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
    <dialog-confirm-delete type="user" :label="selectedUser ? selectedUser.name : ''" v-model="dialogConfirmDelete" @submit="deleteUser"/>
  </fragment>
</template>

<script>
  import DialogConfirmDelete from '../dialog/dialogConfirmDelete';
  export default {
    name: 'viewUserToolbar',
    components: { DialogConfirmDelete },
    injectService: [
      'PosStore:selectedUser',
      'PosStore:updateUser',
      'PosStore:listUsers',
      'PosStore:user',
    ],
    data() {
      return {
        dialogConfirmDelete: false
      }
    },
    computed: {
      isCurrentUser() {
        return this.user._id === this.selectedUser._id || !this.selectedUser;
      }
    },
    methods: {
      openDialogDelete() {
        this.dialogConfirmDelete = true;
      },
      async deleteUser() {
        if(this.selectedUser._id) {
          await this.updateUser(this.selectedUser._id)
          this.selectedUser = {
            ... this.listUsers[0],
            prepend: this.listUsers[0].avatar,
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>