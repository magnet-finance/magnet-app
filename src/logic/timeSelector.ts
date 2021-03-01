import includes from "lodash/includes";
import map from "lodash/map";
import moment, { Moment } from 'moment';

export const TimeUnits = [
  { label: 'Years', value: 'years' },
  { label: 'Months', value: 'months' },
  { label: 'Weeks', value: 'weeks'},
  { label: 'Days', value: 'days' },
  { label: 'Hours', value: 'hours' },
];

export const isTimeUnit = (timeUnit: any) : timeUnit is string => includes(map(TimeUnits, "value"), timeUnit);

// Takes date from date and time from time and makes one moment with both
export const mergeDateAndTime = (date: Moment, time: Moment) : Moment => {
  const result = moment(date).startOf("day");
  const timeMs = moment(time).diff(moment(time).startOf("day"));
  result.add(timeMs, 'ms');
  return result;
}
