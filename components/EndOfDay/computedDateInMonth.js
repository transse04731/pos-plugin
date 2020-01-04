import { computedDisplayMonth, computedDisplayYear, isAllowed, isSelected } from 'pos-vue-framework/src/components/GDatePicker/logic/TableUtil';
import dayjs from 'dayjs';
import { computed } from '@vue/composition-api';
import { pad } from 'pos-vue-framework/src/components/GDatePicker/logic/utils';
import {
  _addRangeInformation, _computedDaysBeforeFirstDayOfTheMonth,
  _computedDaysInMonth,
  _computedWeekNumber, _genEvents, cptAdjacentMonth, getDateItemObj,
  getFirstNDaysOfMonth,
  getLastNDaysOfMonth
} from 'pos-vue-framework/src/components/GDatePicker/logic/DateTableUtil';

export const _computedDatesInMonthCustom = (props, state) => {
  const cptMonth = computedDisplayMonth(state)
  const cptYear = computedDisplayYear(state)
  const defaultDayFormatFn = (day => dayjs(day).format('D'))
  const cptDateFormatFunc = computed(() => props.dayFormat || defaultDayFormatFn)
  const cptDaysInMonth = _computedDaysInMonth(cptYear, cptMonth)
  const cptWeekNumber = _computedWeekNumber(props, cptYear, cptMonth)
  const cptDaysBeforeFirstDayOfMonth = _computedDaysBeforeFirstDayOfTheMonth(props, cptYear, cptMonth)

  // each week will be displayed in a row of Date table
  return computed(() => {
    const weeks = []
    let week = []

    // add week number of option showWeek is ON
    let weekNumber = cptWeekNumber.value
    props.showWeek && week.push({ isWeek: true, value: weekNumber++ })

    // add blank day before the first day of the month
    let dayBeforeFirstDayOfMonths = cptDaysBeforeFirstDayOfMonth.value
    const lastMonth = cptAdjacentMonth(state.viewportDate, 'prev');
    let lastNDays = getLastNDaysOfMonth(dayBeforeFirstDayOfMonths, lastMonth.month, lastMonth.year);

    for (let day = 0; day < lastNDays.length; day++) {
      const date = lastNDays[day];
      const dateItem = {
        ...getDateItemObj(props, date),
        formattedValue: cptDateFormatFunc.value(date),
        isSelected: isSelected(props, state, date),
        isCurrent: props.showCurrent && date === currentDate
      };

      week.push(dateItem)
    }

    const currentDate = dayjs().format('DD/MM/YYYY')

    // add days in month
    const daysInMonth = cptDaysInMonth.value
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${cptYear.value}-${pad(cptMonth.value + 1)}-${pad(day)}`
      const dateItem = {
        ...getDateItemObj(props, date),
        formattedValue: cptDateFormatFunc.value(date),
        isAllowed: isAllowed(props, date),
        isSelected: isSelected(props, state, date),
        isCurrent: props.showCurrent && date === currentDate
      };

      if (props.range) {
        _addRangeInformation(dateItem, state, date)
      }

      week.push(dateItem)

      // add week
      if (week.length % (props.showWeek ? 8 : 7) === 0) {
        weeks.push(week)
        week = []
        if (day < daysInMonth && props.showWeek) {
          week.push({ isWeek: true, value: weekNumber++ })
        }
      }
    }
    //Add first N days of next month
    if (week.length) {
      let numberOfDays = 7 - week.length;
      let nextMonth = dayjs(state.viewportDate).add(1, 'month')
      let firstNDays = getFirstNDaysOfMonth(numberOfDays, nextMonth.month() % 12 + 1, nextMonth.year());
      for (let day = 0; day < firstNDays.length; day++) {
        const date = firstNDays[day];
        const dateItem = {
          ...getDateItemObj(props, date),
          formattedValue: cptDateFormatFunc.value(date),
          isSelected: isSelected(props, state, date),
          isCurrent: props.showCurrent && date === currentDate
        };
        week.push(dateItem);
      }
      weeks.push(week)
    }

    return weeks;
  })
};
