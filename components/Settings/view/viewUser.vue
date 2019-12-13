<template>
	<fragment>
		<g-grid-layout :layout="layout" style="height: 100%">
			<div area="list">
				<g-list mandatory :items="items" item-text="name" elevation="0" divider selectable return-object prepend-type="avatar" active-class="item__active" v-model="selectedUser" @click="label = 'Edit User'">
					<template v-slot:append>
						<div></div>
					</template>
				</g-list>
				<div class="row-flex align-items-center pa-2 pl-3" @click="addUser">
					<g-avatar size="40">
						<g-icon svg>icon-add_user</g-icon>
					</g-avatar>
					<p class="ml-3 text-red fs-small">Add User</p>
				</div>
			</div>
			<div area="edit">
				<div area="title" class="row-flex align-items-center pl-4 fw-700">
					{{label}}
				</div>
				<div class="edit__item">
					<pos-text-field label="Name" @click="editUsername" v-model="selectedUser.name">
						<template v-slot:append>
							<g-icon svg>icon-keyboard</g-icon>
						</template>
					</pos-text-field>
				</div>
				<div class="edit__item">
					<p class="mb-2">User Avatar</p>
					<div class="row-flex align-items-center" style="height: 40px">
						<g-avatar size="40" v-if="selectedUser && selectedUser.avatar" class="mr-2">
							<img alt :src="selectedUser.avatar"/>
						</g-avatar>
						<a class="link-change" @click="dialogSelectAvatar = true">Change</a>
					</div>
				</div>
				<div class="edit__item">
					<pos-switch dense label="View Own Report" v-model="selectedUser.viewOwnReport" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="View Others Reports" v-model="selectedUser.viewOtherReport" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Edit Article, Edit Table Layout"  v-model="selectedUser.editArticle" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Access Z-Report" v-model="selectedUser.accessZReport" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Item Cancellation" v-model="selectedUser.itemCancellation" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Allow Table Takeover"  v-model="selectedUser.allowTableTakeover" @change="save"/>
				</div>
				<div class="edit__item">
					<p class="mt-3 ml-1">Employee iButton Key</p>
					<p class="mt-2 ml-1">
						<span class="fs-small text-green-accent-4">Registered!</span>
						<g-icon class="ml-1" size="20" svg>icon-redo</g-icon>
					</p>
				</div>
				<div class="edit__item">
					<pos-switch style="max-width: 200px" dense label="Allow Item Cancellation after reactivate paid Table" v-model="selectedUser.itemCancellationReactivePaidTable" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-text-field label="Postcode" @click="editPasscode" v-model="selectedUser.passcode">
						<template v-slot:append>
							<g-icon svg>icon-keyboard</g-icon>
						</template>
					</pos-text-field>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Allow Move Item" v-model="selectedUser.allowMoveItem" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Reactivate paid Table" v-model="selectedUser.reactivePaidTable" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Allow Table Switch" v-model="selectedUser.allowTableSwitch" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Open Cash Drawer Manually" v-model="selectedUser.openCashdrawerManually" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Discount" v-model="selectedUser.discount" @change="save"/>
				</div>
				<div class="edit__item">
					<pos-switch dense label="Cancel Invoice" v-model="selectedUser.cancelInvoice" @change="save"/>
				</div>
			</div>
		</g-grid-layout>
		<dialog-user-detail v-model="dialogUserDetail" :focusInput.sync="focusInput"/>
		<dialog-select-avatar v-model="dialogSelectAvatar"/>
	</fragment>
</template>

<script>
  import PosSwitch from '../../pos-shared-components/PosSwitch';
  import layout from './layoutUserView';
  import PosTextField from '../../pos-shared-components/POSInput/PosTextField';
  import DialogUserDetail from '../dialog/dialogUserDetail';
	import DialogSelectAvatar from '../dialog/dialogSelectAvatar';

  export default {
    name: 'StaffPermission',
    components: { DialogSelectAvatar, DialogUserDetail, PosTextField, PosSwitch },
		injectService: [
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
				label: 'Edit User',
      }
    },
		computed: {
			items() {
				return this.listUsers.map(u => ({
					...u,
					prepend: u.avatar
				}))
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
				this.selectedUser = {
					name: '',
					passcode: ''
				};
				this.label = 'Add New User';
			},
			async save() {
				await this.updateUser(this.selectedUser._id, this.selectedUser);
			},
		},
		async created() {
    	await this.getListUsers();
    	this.selectedUser = this.items[0];
		}
  }
</script>

<style scoped lang="scss">
	.list {
		overflow-y: auto;
		border-right: 1px solid rgba(0, 0, 0, 0.12);

		.g-list {
			border-bottom: 1px solid rgba(0, 0, 0, 0.12);

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