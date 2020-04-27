<template>
  <div class="service-setting">
    <div class="service-setting__title">Service & Open hours</div>
    <div class="service-setting__content mb-2">
      <div style="display: flex">
        <div class="mb-3 fw-700">Open hours</div>
        <g-spacer/>
        <div class="btn-add" @click="addNewOpenHour()">+ Add new</div>
      </div>
      <div v-for="(openHour, index) in openHours" :key="index"
           class="open-hour__row">
        <g-checkbox
            v-for="(day, i) in days"
            :key="`day_${index}_${i}`"
            v-model="openHour.dayInWeeks[i]"
            :disabled="!openHour.dayInWeeks[i] && !availableDays[i]"
            :label="day"
            @change="updateOpenHours"
            color="#536DFE"/>
        <g-spacer/>
        <div class="open-hour__row--hour left">
          <g-time-picker-input v-model="openHour.openTime"  @input="updateOpenHours"/>
        </div>
        <div class="open-hour__row--hour right">
          <g-time-picker-input v-model="openHour.closeTime"  @input="updateOpenHours"/>
        </div>
        <g-spacer/>
        <div @click="removeOpenHour(openHour)" class="open-hour__row--btn">
          <g-icon size="16">icon-close</g-icon>
        </div>
      </div>
    </div>
    <div class="service-setting__content w-50">
      <div class="mb-3 fw-700">Service</div>
      <div class="row-flex">
        <div class="col-6">
          <div class="mb-2">Delivery</div>
          <g-radio-group v-model="delivery" row>
            <g-radio small color="#536DFE" label="Yes" value="1" :class="[delivery === '1' && 'selected']"/>
            <g-radio small color="#536DFE" label="No" value="0" :class="[delivery === '0' && 'selected']"/>
          </g-radio-group>
        </div>
        <div class="col-6">
          <div class="mb-2">Allow pick-up</div>
          <g-radio-group v-model="pickup" row>
            <g-radio small color="#536DFE" label="Yes" value="1" :class="[pickup === '1' && 'selected']"/>
            <g-radio small color="#536DFE" label="No" value="0" :class="[pickup === '0' && 'selected']"/>
          </g-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  // TODO: Debounce update openHours open, close time
  export default {
    name: 'ServiceAndOpenHours',
    props: { store: Object },
    data: function () {
      return {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    },
    computed: {
      delivery: {
        get() {
          return this.store.delivery ? "1" : "0"
        },
        set(value) {
          this.$emit('update', { delivery: value === "1" })
        }
      },
      pickup: {
        get() {
          return this.store.pickup ? "1" : "0"
        },
        set(value) {
          this.$emit('update', { pickup: value === "1" })
        }
      },
      openHours() {
        return this.store.openHours
      },
      availableDays() {
        const availableDays = [true, true, true, true, true, true, true]
        _.each(this.openHours, openHour => {
          _.each(openHour.dayInWeeks, (checked, index) => {
            if (checked)
              availableDays[index] = false
          })
        })
        return availableDays
      }
    },
    methods: {
      addNewOpenHour() {
        const newOpenHour = {
          dayInWeeks: [false, false, false, false, false, false, false],
          openTime: '06:30 AM',
          closeTime: '11:30 PM'
        }
        const newOpenHours = [...this.store.openHours, newOpenHour]
        this.$emit('update', { openHours: newOpenHours })
      },
      removeOpenHour(openHour) {
        const i = _.findIndex(this.store.openHours, oh => oh._id === openHour._id)
        this.store.openHours.splice(i, 1)
        this.$emit('update', { openHours: this.store.openHours })
      },
      updateOpenHours() {
        this.$emit('update', { openHours: this.store.openHours })
      }
    }
  }
</script>

<style scoped lang="scss">
  .service-setting {

    &__title {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 12px;
    }

    &__content {
      background-color: #FFF;
      border-radius: 5px;
      padding: 25px 25px 50px 25px;

      .btn-add {
        color: #536DFE;
        cursor: pointer;
        font-weight: 700;
      }

      .open-hour__row {
        display: flex;
        align-items: center;
        background: #FAFAFA;
        border: 1px solid #EFEFEF;
        border-radius: 6px;
        height: 43px;
        margin-top: 6px;
        margin-bottom: 6px;

        &--hour {
          background: #E0E0E0;
          padding: 0 12px;
          font-weight: 700;
          font-size: 15px;
          line-height: 1.9;

          &.left {
            border-top-left-radius: 37px;
            border-bottom-left-radius: 37px;
            margin-right: 2px;
          }

          &.right {
            border-top-right-radius: 37px;
            border-bottom-right-radius: 37px;
          }
        }

        &--btn {
          background: #EFEFEF;
          width: 43px;
          height: 43px;
          line-height: 43px;
          text-align: center;
          border-top-right-radius: inherit;
          border-bottom-right-radius: inherit;
          cursor: pointer;
        }

        ::v-deep .g-tf-wrapper {
          margin: 0;

          &:before, &:after {
            display: none;
          }

          .g-tf-input {
            width: 80px;
            font-weight: 700;
          }
        }
      }

      .g-radio-wrapper {
        margin-right: 40px;
        margin-left: 0;

        &.selected ::v-deep .g-radio-label {
          font-weight: 600;
        }
      }
    }
  }
</style>
