<template>
  <fragment>
    <g-grid-layout :layout="layout" style="height: 100%">
      <div area="list">
        <g-list :items="listOfUsers" @click="label = 'Edit User'" active-class="item__active" divider elevation="0" item-text="name" mandatory prepend-type="avatar" return-object selectable v-model="selectedUser">
          <template v-slot:append>
            <div></div>
          </template>
        </g-list>
        <div @click="addUser" class="row-flex align-items-center pa-2 pl-3">
          <g-avatar size="40">
            <g-icon svg>icon-add_user</g-icon>
          </g-avatar>
          <p class="ml-3 text-red fs-small">Add User</p>
        </div>
      </div>
      <div area="edit">
        <div area="title" class="row-flex align-items-center pl-4 fw-700">
          Edit User
        </div>
        <div class="edit__item">
          <pos-text-field @click="editUsername" label="Name" v-model="selectedUser.name">
            <template v-slot:append>
              <g-icon svg>icon-keyboard</g-icon>
            </template>
          </pos-text-field>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <p class="mb-2">User Avatar</p>
          <div class="row-flex align-items-center" style="height: 40px">
            <g-avatar class="mr-2" size="40" v-if="selectedUser && selectedUser.avatar">
              <img :src="selectedUser.avatar" alt/>
            </g-avatar>
            <a @click="dialogSelectAvatar = true" class="link-change">Change</a>
          </div>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="View Own Report" v-model="selectedUser.viewOwnReport"/>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="View Others Reports" v-model="selectedUser.viewOtherReport"/>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="Edit Article Layout" v-model="selectedUser.editArticle"/>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="Access Z-Report" v-model="selectedUser.accessZReport"/>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="Item Cancellation" v-model="selectedUser.itemCancellation"/>
        </div>
<!--        <div class="edit__item" v-if="!isAdmin">-->
<!--          <pos-switch @change="save" dense label="Allow Table Takeover" v-model="selectedUser.allowTableTakeover"/>-->
<!--        </div>-->
        <div class="edit__item" v-if="!isAdmin">
          <p class="mt-3 ml-1">Employee iButton Key</p>
          <p class="mt-2 ml-1">
            <span class="fs-small text-green-accent-4">Registered!</span>
            <g-icon class="ml-1" size="20" svg>icon-redo</g-icon>
          </p>
        </div>
<!--        <div class="edit__item" v-if="!isAdmin">-->
<!--          <pos-switch @change="save" dense label="Allow Item Cancellation after reactivate paid Table" style="max-width: 200px" v-model="selectedUser.itemCancellationReactivePaidTable"/>-->
<!--        </div>-->
        <div class="edit__item">
          <pos-text-field @click="editPasscode" label="Passcode" v-model="selectedUser.passcode">
            <template v-slot:append>
              <g-icon svg>icon-keyboard</g-icon>
            </template>
          </pos-text-field>
        </div>
<!--        <div class="edit__item" v-if="!isAdmin">-->
<!--          <pos-switch @change="save" dense label="Allow Move Item" v-model="selectedUser.allowMoveItem"/>-->
<!--        </div>-->
<!--        <div class="edit__item" v-if="!isAdmin">-->
<!--          <pos-switch @change="save" dense label="Reactivate paid Table" v-model="selectedUser.reactivePaidTable"/>-->
<!--        </div>-->
<!--        <div class="edit__item" v-if="!isAdmin">-->
<!--          <pos-switch @change="save" dense label="Allow Table Switch" v-model="selectedUser.allowTableSwitch"/>-->
<!--        </div>-->
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="Open Cash Drawer Manually" v-model="selectedUser.openCashdrawerManually"/>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="Discount" v-model="selectedUser.discount"/>
        </div>
        <div class="edit__item" v-if="!isAdmin">
          <pos-switch @change="save" dense label="Cancel Invoice" v-model="selectedUser.cancelInvoice"/>
        </div>
      </div>
    </g-grid-layout>
    <dialog-user-detail :focusInput.sync="focusInput" v-model="dialogUserDetail"/>
    <dialog-select-avatar v-model="dialogSelectAvatar"/>
    <dialog-new-user v-model="dialogNewUser"/>
  </fragment>
</template>

<script>
  import layout from './layoutUserView';
  export default {
    name: 'StaffPermission',
    injectService: [
      'PosStore:user',
      'PosStore:selectedUser',
      'PosStore:listUsers',
      'PosStore:getListUsers',
      'PosStore:updateUser',
    ],
    data() {
      return {
        layout: layout,
				dialogUserDetail: false,
				focusInput: null,
				dialogSelectAvatar: false,
				dialogNewUser: false
      }
    },
    computed: {
      isAdmin() {
        if (!this.user) {
          return false;
        }
        return this.selectedUser.role === 'admin'
      },
      listOfUsers() {
        if (!this.user) {
          return [];
        }
        let list
        if (this.user.role !== 'admin') {
          list = _.map(_.filter(this.listUsers, (user) => user.role !== 'admin'), (u) => ({
            ...u,
            prepend: u.avatar
          }))
        } else {
          list = this.listUsers.map(u => ({
            ...u,
            prepend: u.avatar
          }));
        }
        return list
      },
    },
    watch: {
      user() {
        this.selectedUser = this.listOfUsers[0]
      }
    },
    methods: {
      editUsername() {
        this.focusInput = 'username';
        this.dialogUserDetail = true;
      },
      editPasscode() {
        this.focusInput = 'passcode';
        this.dialogUserDetail = true;
      },
      addUser() {
        this.dialogNewUser = true;
      },
      async save() {
        await this.updateUser(this.selectedUser._id, this.selectedUser);
      },
    },
    async created() {
      await this.getListUsers();
      this.selectedUser = this.listOfUsers[0]
    },
    activated() {
      this.selectedUser = this.listOfUsers[0]
    }
  }
</script>

<style lang="scss" scoped>
	.list {
		overflow-y: auto;
		border-right: 1px solid rgba(0, 0, 0, 0.12);

		.g-list {
			border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      padding: 0;

			::v-deep .g-list-item-text {
				font-size: 13px;
				line-height: 16px;
				color: #4D4D4E;
			}

			::v-deep .g-image-content {
				background-size: contain !important;
			}

			::v-deep .g-list-item__active:hover {
				background: rgba(242, 242, 242, 0.5);
			}

			::v-deep .item__active {
				border-right: 5px solid #1271ff;
				background: rgba(242, 242, 242, 0.5);
				transition: none;

				&::before {
					background: rgba(242, 242, 242, 0.5);
				}

				.g-list-item-text {
					color: #1271ff;
				}
			}
		}
	}

	.edit__item {
		padding: 0 16px;
		font-size: 13px;
		line-height: 16px;

		&:nth-child(even) {
			border-right: 1px solid rgba(0, 0, 0, 0.12);
		}

		.link-change {
			font-weight: 700;
			font-size: 14px;
			line-height: 18px;
			color: #1471FF;
			cursor: pointer;
		}
	}

</style>
