<template>
  <g-dialog v-model="dialogUserDetail" overlay-color="#6b6f82" overlay-opacity="0.95" width="90%" lazy>
    <div class="dialog-user w-100">
      <div class="form">
        <div class="input">
          <pos-text-field ref="username" @click="check = 'username'" large label="User Name" v-model="name"/>
          <pos-text-field ref="passcode" @click="check = 'passcode'" large label="Passcode" v-model="passcode"/>
        </div>
        <div class="action">
          <g-btn :uppercase="false" outlined class="mr-2" width="120" @click="dialogUserDetail = false">Cancel</g-btn>
          <g-btn :uppercase="false" flat background-color="blue accent 3" text-color="white" width="120" @click="submit">OK</g-btn>
        </div>
      </div>
      <div class="bg-grey-lighten-1 pa-2">
        <pos-keyboard-full v-model="keyboard"/>
      </div>
    </div>
  </g-dialog>
</template>

<script>
  import PosTextField from '../../pos-shared-components/POSInput/PosTextField';
  import PosKeyboardFull from '../../pos-shared-components/PosKeyboardFull';

  export default {
    name: 'dialogUserDetail',
    components: { PosKeyboardFull, PosTextField },
    props: {
      value: null,
			focusInput: String,
    },
		data(){
    	return {
    	  name: '',
        passcode: ''
			}
		},
		injectService: [
			'PosStore:selectedUser',
			'PosStore:updateUser',
			'PosStore:listUsers',
		],
    computed: {
      dialogUserDetail: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      check: {
        get() {
          return this.focusInput;
        },
        set(val) {
          this.$emit('update:focusInput', val);
        }
      },
			keyboard: {
      	get() {
      		if(this.check === 'username')
      			return this.name;
      		else if(this.check === 'passcode')
      			return this.passcode;
				},
				set(val) {
					if(this.check === 'username')
						return this.name = val;
					else if(this.check === 'passcode')
						return this.passcode = val;
				}
			}
    },
		methods: {
			async submit() {
			  this.selectedUser.name = this.name;
			  this.selectedUser.passcode = this.passcode;
			  await this.updateUser(this.selectedUser._id, this.selectedUser);
				this.dialogUserDetail = false;
			}
		},
		watch: {
      value: function(val) {
        setTimeout(() => {
          const textfield = this.$refs[this.focusInput];
          if (textfield) textfield.$refs.input.focus();
        }, 200);
        this.name = val ? this.selectedUser.name : '';
        this.passcode = val ? this.selectedUser.passcode : '';
      }
		}
  }
</script>

<style scoped lang="scss">
  .dialog-user {
    background-color: white;

    .form {
      padding: 16px;

      .input {
        display: flex;
      }

      .action {
        display: flex;
        justify-content: flex-end;
        padding-top: 24px;
      }
    }
  }
</style>