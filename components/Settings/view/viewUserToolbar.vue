<template>
  <fragment>
    <g-btn :uppercase="false" background-color="white" :disabled="isCurrentUser" text-color="#1d1d26" @click="deleteUser">
      <g-icon class="mr-2" svg>
        icon-trash
      </g-icon>
      Delete
    </g-btn>
  </fragment>
</template>

<script>
  export default {
    name: 'viewUserToolbar',
    injectService: [
      'PosStore:selectedUser',
      'PosStore:updateUser',
      'PosStore:listUsers',
      'PosStore:user',
    ],
    computed: {
      isCurrentUser() {
        return this.user._id === this.selectedUser._id;
      }
    },
    methods: {
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