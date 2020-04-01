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
        <g-checkbox label="Monday" v-model="openHour.dayInWeeks[0]"/>
        <g-checkbox label="Tuesday" v-model="openHour.dayInWeeks[1]"/>
        <g-checkbox label="Wednesday" v-model="openHour.dayInWeeks[2]"/>
        <g-checkbox label="Thursday" v-model="openHour.dayInWeeks[3]"/>
        <g-checkbox label="Friday" v-model="openHour.dayInWeeks[4]"/>
        <g-checkbox label="Saturday" v-model="openHour.dayInWeeks[5]"/>
        <g-checkbox label="Sunday" v-model="openHour.dayInWeeks[6]"/>
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
  export default {
    name: 'ServiceAndOpenHours',
    props: {},
    data: function () {
      return {
        delivery: true,
        pickup: false,
        openHours: []
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
      
      }
    }
  }
</script>
<style scoped>
</style>
