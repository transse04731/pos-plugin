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
        <g-checkbox color="#536DFE" v-model="openHour.dayInWeeks[0]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[0] && !availableDays[0]" label="Monday"/>
        <g-checkbox color="#536DFE" v-model="openHour.dayInWeeks[1]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[1] && !availableDays[1]" label="Tuesday"/>
        <g-checkbox color="#536DFE" v-model="openHour.dayInWeeks[2]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[2] && !availableDays[2]" label="Wednesday"/>
        <g-checkbox color="#536DFE" v-model="openHour.dayInWeeks[3]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[3] && !availableDays[3]" label="Thursday"/>
        <g-checkbox color="#536DFE" v-model="openHour.dayInWeeks[4]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[4] && !availableDays[4]" label="Friday"/>
        <g-checkbox color="#536DFE" v-model="openHour.dayInWeeks[5]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[5] && !availableDays[5]" label="Saturday"/>
        <g-checkbox color="#536DFE" v-model="openHour.dayInWeeks[6]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[6] && !availableDays[6]" label="Sunday"/>
        <g-spacer/>
        <div class="open-hour__row--hour left">{{openHour.openTime}}</div>
        <div class="open-hour__row--hour right">{{openHour.closeTime}}</div>
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
          <div>Delivery</div>
          <g-radio-group v-model="delivery" row>
            <g-radio color="#536DFE" label="Yes" value="1"/>
            <g-radio color="#536DFE" label="No" value="0"/>
          </g-radio-group>
        </div>
        <div class="col-6">
          <div>Allow pick-up</div>
          <g-radio-group v-model="pickup" row>
            <g-radio color="#536DFE" label="Yes" value="1"/>
            <g-radio color="#536DFE" label="No" value="0"/>
          </g-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  
  export default {
    name: 'ServiceAndOpenHours',
    props: {},
    data: function () {
      return {
        delivery: null,
        pickup: null,
        openHours: [],
        availableDays: [true, true, true, true, true, true, true]
      }
    },
    computed: {},
    methods: {
      addNewOpenHour() {
        this.openHours.push({
          dayInWeeks: [false, false, false, false, false, false, false],
          openTime: '06:30',
          closeTime: '23:30'
        })
      },
      removeOpenHour(openHour) {

      },
      updateAvailableDay() {
        const availableDays = [true, true, true, true, true, true, true]
        _.each(this.openHours, openHour => {
          _.each(openHour.dayInWeeks, (checked, index) => {
            if (checked)
              availableDays[index] = false
          })
        })
        this.availableDays.splice(0, this.availableDays.length, ...availableDays)
      }
    }
  }
</script>

<style scoped lang="scss">
  .service-setting {

    &__title {
      font-weight: 700;
      font-size: 18px;
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
      }
    }
  }
</style>
