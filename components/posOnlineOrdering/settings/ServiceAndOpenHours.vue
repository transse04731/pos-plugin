<template>
  <div>
    <div style="font-style: normal; font-weight: bold; font-size: 18px;" class="mb-2">Service & Open hours</div>
    <div style="background-color: #FFF; border-radius: 5px; padding: 25px 25px 50px 25px;" class="mb-2">
      <div style="display: flex">
        <div style="font-style: normal; font-weight: bold; font-size: 15px;" class="mb-3">Open hours</div>
        <g-spacer/>
        <div @click="addNewOpenHour()">+ Add new</div>
      </div>
      <div v-for="(openHour, index) in openHours" :key="index"
           style="display: flex; align-items: center; background: #FAFAFA; border: 1px solid #EFEFEF; box-sizing: border-box; border-radius: 4px; height: 43px; margin-top: 6px; margin-bottom: 6px;">
        <g-checkbox v-model="openHour.dayInWeeks[0]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[0] && !availableDays[0]" label="Monday"/>
        <g-checkbox v-model="openHour.dayInWeeks[1]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[1] && !availableDays[1]" label="Tuesday"/>
        <g-checkbox v-model="openHour.dayInWeeks[2]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[2] && !availableDays[2]" label="Wednesday"/>
        <g-checkbox v-model="openHour.dayInWeeks[3]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[3] && !availableDays[3]" label="Thursday"/>
        <g-checkbox v-model="openHour.dayInWeeks[4]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[4] && !availableDays[4]" label="Friday"/>
        <g-checkbox v-model="openHour.dayInWeeks[5]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[5] && !availableDays[5]" label="Saturday"/>
        <g-checkbox v-model="openHour.dayInWeeks[6]" @change="updateAvailableDay" :disabled="!openHour.dayInWeeks[6] && !availableDays[6]" label="Sunday"/>
        <g-spacer/>
        <div style="background: #E0E0E0; border-radius: 37px 0 0 37px; padding: 0 10px; margin-right: 1px">{{openHour.openTime}}</div>
        <div style="background: #E0E0E0; border-radius: 0 37px 37px 0; padding: 0 10px">{{openHour.closeTime}}</div>
        <g-spacer/>
        <div @click="removeOpenHour(openHour)" style="background: #EFEFEF; width: 43px; height: 43px; line-height: 43px; text-align: center">X</div>
      </div>
    </div>
    <div style="background-color: #FFF; border-radius: 5px; padding: 25px 25px 50px 25px;">
      <div style="font-style: normal; font-weight: bold; font-size: 15px;" class="mb-3">Service</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr;">
        <div>
          <div>Delivery</div>
          <g-radio-group v-model="delivery" row>
            <g-radio label="Yes" :value="true"/>
            <g-radio label="No" :value="false"/>
          </g-radio-group>
        </div>
        <div>
          <div>Allow pick-up</div>
          <g-radio-group v-model="pickup" row>
            <g-radio label="Yes" :value="true"/>
            <g-radio label="No" :value="false"/>
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
        delivery: true,
        pickup: false,
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
<style scoped>
</style>
