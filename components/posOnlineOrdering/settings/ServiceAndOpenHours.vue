<template>
  <div class="service-setting">
    <div class="service-setting__title">Service & Open hours</div>
    <div class="service-setting__content mb-2">
      <div style="display: flex">
        <div class="mb-3 fw-700">Open hours</div>
        <g-spacer/>
        <div class="btn-add" @click="addNewOpenHour()">+ Add new</div>
      </div>
      <div v-for="(openHour, index) in computedOpenHours" :key="index"
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
        <div :class="['open-hour__row--hour', 'left', errors[index] && errors[index].open && 'error']">
          <g-time-picker-input use24Hours :value="openHour.openTime"  @input="updateHours($event, index, true)"/>
        </div>
        <div :class="['open-hour__row--hour', 'right', errors[index] && errors[index].close && 'error']">
          <g-time-picker-input use24Hours :value="openHour.closeTime"  @input="updateHours($event, index, false)"/>
        </div>
        <g-spacer/>
        <div @click="removeOpenHour(openHour)" class="open-hour__row--btn">
          <g-icon size="16">icon-close</g-icon>
        </div>
        <div v-if="errors[index] && errors[index].message" class="error-message">{{errors[index].message}}</div>
      </div>
    </div>
    <div class="service-setting__content w-50">
      <div class="mb-3 fw-700">Service</div>
      <div class="row-flex">
        <div class="col-6">
          <div class="mb-2">Delivery</div>
          <g-radio-group v-model="computedDelivery" row>
            <g-radio small color="#536DFE" label="Yes" value="1" :class="[delivery === '1' && 'selected']"/>
            <g-radio small color="#536DFE" label="No" value="0" :class="[delivery === '0' && 'selected']"/>
          </g-radio-group>
        </div>
        <div class="col-6">
          <div class="mb-2">Allow pick-up</div>
          <g-radio-group v-model="computedPickup" row>
            <g-radio small color="#536DFE" label="Yes" value="1" :class="[pickup === '1' && 'selected']"/>
            <g-radio small color="#536DFE" label="No" value="0" :class="[pickup === '0' && 'selected']"/>
          </g-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const _24HourTimeRegex = /^(?<hours>2[0-3]|[0-1]?[0-9]):(?<minutes>[0-5][0-9])(:(?<seconds>[0-5][0-9]))?$/i

  import _ from 'lodash'
  // TODO: Debounce update openHours open, close time
  export default {
    name: 'ServiceAndOpenHours',
    props: {
      delivery: Boolean,
      pickup: Boolean,
      openHours: Array,
    },
    data: function () {
      return {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        errors: []
      }
    },
    computed: {
      computedDelivery: {
        get() {
          return this.delivery ? "1" : "0"
        },
        set(value) {
          this.$emit('update', { delivery: value === "1" })
        }
      },
      computedPickup: {
        get() {
          return this.pickup ? "1" : "0"
        },
        set(value) {
          this.$emit('update', { pickup: value === "1" })
        }
      },
      computedOpenHours() {
        return this.openHours
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
    created() {
      this.errors = this.openHours.map(() => ({
        open: false,
        close: false,
        message: ''
      }))
    },
    methods: {
      addNewOpenHour() {
        const newOpenHour = {
          dayInWeeks: [false, false, false, false, false, false, false],
          openTime: '06:30',
          closeTime: '23:30'
        }
        const newOpenHours = [...this.openHours, newOpenHour]
        this.$emit('update', { openHours: newOpenHours })
        this.errors.push({
          open: false,
          close: false,
          message: ''
        })
      },
      removeOpenHour(openHour) {
        const openHours = _.cloneDeep(this.openHours)
        const i = _.findIndex(openHours, oh => oh._id === openHour._id)
        openHours.splice(i, 1)
        this.$emit('update', {openHours})
        this.errors.splice(i, 1)
      },
      updateOpenHours() {
        this.$emit('update', { openHours: this.openHours })
      },
      updateHours(time, index, isOpenTime) {
        const openHour = this.openHours[index]
        this.$set(this.errors[index], 'message', '')
        if(!_24HourTimeRegex.exec(time)) {
          this.$set(this.errors[index], `${isOpenTime ? 'open' : 'close'}`, true)
          this.$set(this.errors[index], 'message', `${isOpenTime ? 'Open' : 'Close'} time is invalid!`)
          return
        }
        if(isOpenTime) {
          this.$set(this.errors[index], 'open', false)
          if(time < openHour.closeTime)
            this.$set(openHour, `openTime`, time)
          else {
            this.$set(this.errors[index], 'open', true)
            this.$set(this.errors[index], 'message', 'Open time must be before close time!')
          }
        } else {
          this.$set(this.errors[index], 'close', false)
          if(time > openHour.openTime)
            this.$set(openHour, `closeTime`, time)
          else{
            this.$set(this.errors[index], 'close', true)
            this.$set(this.errors[index], 'message', 'Open time must be before close time!')
          }
        }
        this.$emit('update', {openHours: this.openHours})
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
        margin-top: 8px;
        margin-bottom: 20px;
        position: relative;

        &--hour {
          background: #E0E0E0;
          font-weight: 700;
          font-size: 15px;
          line-height: 1.9;
          border: 2px solid #E0E0E0;

          &.left {
            border-top-left-radius: 37px;
            border-bottom-left-radius: 37px;
            margin-right: 2px;
          }

          &.right {
            border-top-right-radius: 37px;
            border-bottom-right-radius: 37px;
          }

          &.error {
            border-color: #ff4452;

            ::v-deep .g-tf-input {
              color: #ff4452;
            }
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
            text-align: center;
          }
        }

        .error-message {
          color: red;
          font-size: 12px;
          font-style: italic;
          position: absolute;
          bottom: -18px;
          right: 0;
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
