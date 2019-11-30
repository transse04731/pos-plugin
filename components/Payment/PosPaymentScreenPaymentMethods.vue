<template>
  <div>
    <g-grid-select item-value="title" :grid="false" :items="paymentMethods" v-model="activePaymentMethod" mandatory>
      <template #default="{toggleSelect, item, index}">
        <g-btn x-large outlined text-color="#1271ff"
               @click.stop="toggleSelect(item)"
               :class="[index > 0 ? 'ml-3' : null]"
        >
          <g-icon svg>{{item.icon}}</g-icon>
          <span class="ml-2 text-black">{{item.title}}</span>
        </g-btn>
      </template>
      <template #selected="{toggleSelect, item, index}">
        <g-btn x-large flat background-color="blue accent 3" text-color="white"
               @click.stop="toggleSelect(item)"
               :class="[index > 0 ? 'ml-3' : null]"
        >
          <g-icon svg>{{item.icon}}</g-icon>
          <span class="ml-2">{{item.title}}</span>
        </g-btn>
      </template>
    </g-grid-select>
  </div>
</template>

<script>
  export default {
    name: 'PosPaymentScreenPaymentMethods',
    injectService: ['PosStore:currentOrder'],
    data() {
      return {
        paymentMethods: [
          { icon: 'icon-cash', title: 'cash' },
          { icon: 'icon-credit_card', title: 'card' }
        ],
        paymentMethod: ''
      }
    },
    mounted() {
      this.activePaymentMethod = 'cash'
    },
    computed: {
      activePaymentMethod: {
        get() {
          return this.paymentMethod
        },
        set(val) {
          this.paymentMethod = val
          this.$set(this.currentOrder, 'payment', this.paymentMethod)
        }
      }
    }
  }
</script>

<style scoped>
  .main {
    flex-grow: 1;
    flex-basis: 0;
    padding: 12px;
    display: flex;
  }
</style>