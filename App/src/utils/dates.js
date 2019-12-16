// Datetime Utilities, unless specified, all functions return a Date
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import endOfToday from 'date-fns/endOfToday';
import endOfTomorrow from 'date-fns/endOfTomorrow';
import startOfYesterday from 'date-fns/startOfYesterday';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMilliseconds from 'date-fns/addMilliseconds';
import _addMinutes from 'date-fns/addMinutes';
import subMinutes from 'date-fns/subMinutes';
import _subHours from 'date-fns/subHours';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import _addHours from 'date-fns/addHours';
import isSameDay from 'date-fns/isSameDay';
import formatDistance from 'date-fns/formatDistance';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import _differenceInSeconds from 'date-fns/differenceInSeconds';
import _differenceInHours from 'date-fns/differenceInHours';
import _differenceInMinutes from 'date-fns/differenceInMinutes';
import _differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import _differenceInDays from 'date-fns/differenceInDays';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';
import isSunday from 'date-fns/isSunday';
import isMonday from 'date-fns/isMonday';
import isTuesday from 'date-fns/isTuesday';

import isDate from 'lodash/isDate';
import toLower from 'lodash/toLower';
import isFunction from 'lodash/isFunction';
import reduce from 'lodash/reduce';

import { addToDevTools } from 'utils/functions';

import { LANGUAGE_REGION } from 'utils/config';

const prettyDate = dateObject => {
  if (isTomorrow(dateObject)) {
    return 'Tomorrow';
  }
  if (isYesterday(dateObject)) {
    return 'Yesterday';
  }
  if (isToday(dateObject)) {
    return 'Today';
  }
  const now = new Date();
  if (dateObject < now) {
    return formatDistance(dateObject, new Date()) + ` ago`;
  }
  return format(dateObject, DATE_FORMAT_FRIENDLY);
};

const prettyDateInDays = dateObject => {
  const diffInDays = differenceInDays(new Date(), dateObject);
  if (diffInDays > 1) return diffInDays + ' days ago';
  return prettyDate(dateObject);
};

const formatDate = dateObject => format(dateObject, DATE_FORMAT_FRIENDLY);

const DATE_FORMAT_FRIENDLY = 'MMM D, yyyy';
const DATE_FORMAT = 'dd-MM-yyyy';
const MONTH_DAY_FORMAT = 'MM/dd';

const TIME_FORMAT_FRIENDLY = 'h:mma';
const TIME_FORMAT = 'HH:mm';

// Milliseconds in 1 hour
const ONE_HOUR_MS = 1000 * 3600;

const HALF_HOUR_MS = ONE_HOUR_MS / 2;

// Milliseconds in 24 hours
const ONE_DAY_MS = ONE_HOUR_MS * 24;

const DATE_LOCALE = LANGUAGE_REGION;
// FIXME: Get timezone / offset from user. Hardcoding timezone offset is bad
// practice as it is hard to account for daylight savings time. Using it here
// for now in order for functions to send emails with date times in EDT
// Watch https://github.com/date-fns/date-fns/pull/707
const TIMEZONE_OFFSET_IN_MINS = 240;

const parseFromString = dateString => {
  return hasAmPm(dateString)
    ? parseFromStringWithAmPm(dateString)
    : parse(dateString);
};

const parseFromStringWithAmPm = dateString => {
  const hasPm = ~dateString.toLowerCase().indexOf('pm');
  const dateStringWithoutAmPm = dateString.replace(/am|pm/i, '');
  let dateWithoutAmPm = parse(dateStringWithoutAmPm);
  if (hasPm) {
    dateWithoutAmPm = addHours(dateWithoutAmPm, 12);
  }
  return dateWithoutAmPm;
};

const hasAmPm = dateString => dateString.match(/am|pm/i);

const getTime = (dateObject, onFriendlyFormat) =>
  format(dateObject, onFriendlyFormat ? TIME_FORMAT_FRIENDLY : TIME_FORMAT);

const getTimeOnFriendlyFormat = dateObject => getTime(dateObject, true);

// Potential stringFormat consts for formatDatetime that are exported
const DATETIME_FORMAT_SHORT = 'MM/dd hh:mma';

const formatDatetime = (dateObject, stringFormat, isLowerCase) => {
  if (stringFormat === 'pretty') {
    const prefix = isLowerCase
      ? `${toLower(prettyDate(dateObject))} at `
      : `${prettyDate(dateObject)} at `;
    return `${prefix}${getTime(dateObject, true)}`;
  }
  return format(
    dateObject,
    stringFormat || `${DATE_FORMAT_FRIENDLY} ${TIME_FORMAT_FRIENDLY}`
  );
};

const getDate = (dateObject, onFriendlyFormat) =>
  format(dateObject, onFriendlyFormat ? DATE_FORMAT_FRIENDLY : DATE_FORMAT);

const getMinutes = date => date.getMinutes();

const getHours = date => date.getHours();

const formatMinutes = date => getMinutes(date) + 'm';

const formatHours = date => getHours(date) + 'h ' + getMinutes(date) + 'm';

const getTomorrow = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  return currentDate;
};

const getTomorrowStr = () => getDate(getTomorrow());

const getStartOfToday = () => startOfToday();

const getEndOfToday = () => endOfToday();

const getEndOfTomorrow = endOfTomorrow;

const getStartOfYesterday = startOfYesterday;

const getNearestWeekStr = (
  dateObject,
  { shouldSetEndDateToSame = false } = {}
) => {
  // Return mm/dd-mm/dd string representing a week (or current partial week)
  // and returns last week if date is Sunday or Monday or Tuesday,
  // else returns the current partial week up to today
  // If shouldSetEndDateToSame is true, then end date is same as dateObject
  // (which is useful for showing reports up to the current day)
  const endDateForNearestWeek = getEndDateForNearestWeek(dateObject);
  const startDate = startOfWeek(endDateForNearestWeek);
  const endDate = shouldSetEndDateToSame ? dateObject : endDateForNearestWeek;
  const formatShortMonth = date => format(date, MONTH_DAY_FORMAT);

  return `${formatShortMonth(startDate)}-${formatShortMonth(endDate)}`;
};

const getEndDateForNearestWeek = dateObject => {
  // Returns dateObject if dateObject is not early in the week (Sun/Mon/Tue) or
  // is in the future,
  // else returns previous Saturday before dateObjects.
  // Example usage: Helpful for automatic determining end date for Invoices or
  // old Reports.
  const isDateInFuture = dateObject >= getTomorrow();
  if (isDateInFuture) return dateObject;

  const isStartOfWeekFns = [isSunday, isMonday, isTuesday];
  const isStartOfWeek = reduce(
    isStartOfWeekFns,
    (isStart, fn) => (isStart = isStart || fn(dateObject)),
    false
  );
  if (!isStartOfWeek) return dateObject;

  // Subtract days to put date into last week
  const anchorDate = subDays(dateObject, isStartOfWeekFns.length);
  const endOfWeek = getEndOfWeek(anchorDate);
  return endOfWeek;
};

const getStartOfWeek = dateObject => startOfWeek(dateObject);

// endOfWeek ends on Sat. night so by default, add a day so end of week ranges 1-8 or from tomorrow til end of [next] week rather than ever ending today
const getEndOfWeek = dateObject => endOfWeek(dateObject || getTomorrow());

const getStartOfMonth = dateObject => startOfMonth(dateObject || new Date());

const getEndOfMonth = dateObject => endOfMonth(dateObject || new Date());

const subHours = _subHours;

const addHours = _addHours;

const addMinutes = _addMinutes;

const daysAgo = numOfDays => addDays(new Date(), -numOfDays);

const isSameDayDate = (dateOne, dateTwo) => isSameDay(dateOne, dateTwo);

const isAlmostSameDate = (dateOne, dateTwo, toleranceSeconds = 55) =>
  Math.abs(differenceInSeconds(dateOne, dateTwo)) <= toleranceSeconds;

const differenceInSeconds = (dateOne, dateTwo) =>
  _differenceInSeconds(dateOne, dateTwo);

const differenceInHours = (dateOne, dateTwo) =>
  _differenceInHours(dateOne, dateTwo);

const differenceInMinutes = (dateOne, dateTwo) =>
  _differenceInMinutes(dateOne, dateTwo);

const differenceInMilliseconds = _differenceInMilliseconds;

const differenceInDays = (dateOne, dateTwo) =>
  _differenceInDays(dateOne, dateTwo);

// Convert milliseconds to digital clock format
// example: (7732421) =>
//  {hours: "02", minutes: "08", seconds: "52", clock: "02:08:52", clockNoSeconds: "02:08"}
const convertMillisecondsToDigitalClock = ms => {
  let hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
  let minutes = Math.floor((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
  let seconds = Math.floor(((ms % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
  hours = ('0' + hours).slice(-2);
  minutes = ('0' + minutes).slice(-2);
  seconds = ('0' + seconds).slice(-2);
  return {
    hours,
    minutes,
    seconds,
    clock: hours + ':' + minutes + ':' + seconds, // hh:mm:ss
    clockNoSeconds: hours + ':' + minutes // hh:mm
  };
};

// Takes an string with a digital clock format and returns the milliseconds equivalent value
// example: ("02:08:52") => 7732000
const convertDigitalClockToMilliseconds = digitalClock => {
  const values = (digitalClock || '').split(':').map(str => parseInt(str, 10));
  return (
    values.length >= 2 &&
    values[0] * 60 * 60 * 1000 + // Hours to milliseconds
    values[1] * 60 * 1000 + // Minutes to milliseconds
      (values[2] || 0) * 1000 // Seconds to milliseconds
  );
};

const convertDigitalClockToTodayMilliseconds = digitalClock => {
  const values = (digitalClock || '').split(':').map(str => parseInt(str, 10));
  const dateObject = new Date();
  if (values.length >= 2) {
    dateObject.setHours(values[0]);
    dateObject.setMinutes(values[1]);
  }
  return dateObject;
};

const createDateWithDateObjAndTimeObj = (date, timeObject) => {
  const dateResult = new Date(date);
  if (!isDate(date) || !isDate(timeObject)) return timeObject;
  dateResult.setHours(timeObject.getHours());
  dateResult.setMinutes(timeObject.getMinutes());
  dateResult.setSeconds(0);
  return dateResult;
};

// Converts 93 mins (9300ms) to 1.5 hrs.
// roundToPartialHour = 4 is default for a quarter hour
const convertMillisecondsToHours = (timeInMs, roundToPartialHour = 4) => {
  if (!timeInMs) return 0;
  const msInHour = 60 * 60 * 1000;
  const roundToInMs = msInHour / roundToPartialHour;
  if (roundToPartialHour < 0) {
    throw new Error(
      `convertMillisecondsToHours called with invalid value ` +
        `for roundToPartialHour (${roundToPartialHour}). It should be ` +
        `0 <= roundedToInMins and represents a fraction of an hour.`
    );
  }
  if (!roundToPartialHour) {
    // If not rounding, just return the fractional hour(s)
    return timeInMs / msInHour;
  }

  const baseHour = Math.floor(timeInMs / msInHour);
  const remainder = timeInMs % msInHour;
  const partialHr =
    (Math.round(remainder / roundToInMs) * roundToInMs) / msInHour;
  const roundedHours = baseHour + partialHr;

  return roundedHours;
};

const convertMinsToHours = (timeInMins, roundToPartialHour = 4) => {
  return convertMillisecondsToHours(timeInMins * 60 * 1000, roundToPartialHour);
};

// Convert a date object to a fixed 5 chars string holding the hours and minutes of the date
// Useful to use in a <input type="time" /> element
// example: (new Date(1521033277798)) => "10:14"
const dateToClockTime = dateObject =>
  !!dateObject
    ? `${('0' + dateObject.getHours()).slice(-2)}:${(
        '0' + dateObject.getMinutes()
      ).slice(-2)}`
    : null;

const getRecentAsDaysOfWeek = (
  recentDateOrStr,
  recentWordsStr = '',
  recentWindow = 7
) => {
  // Accepts string like '3 days' or '13 days'
  // And will returns 'Mon' or '13 days' since 3 is less than 7
  const [quantity, unit] = recentWordsStr.split(' ');
  if (unit !== 'days' && unit !== 'day') return recentWordsStr;
  if (quantity > recentWindow) return recentWordsStr;

  const dayOfWeek = format(recentDateOrStr, 'dddd');

  return dayOfWeek;
};

const getRecentWords = (dateOrStr, { strict, appendStr, unit } = {}) => {
  const now = new Date();
  let value = '';
  if (strict) {
    value = formatDistanceStrict(dateOrStr, now, { unit });
  } else {
    value = formatDistanceToNow(dateOrStr, { unit });
  }
  value += !appendStr ? '' : ' ' + appendStr;
  value = getRecentAsDaysOfWeek(dateOrStr, value);
  return value;
};

const formatTimezone = (date, timezoneOffsetInMins, localeStr) => {
  const offset = timezoneOffsetInMins || date.getTimezoneOffset();
  const dateWithTimezoneOffset =
    Math.sign(offset) !== -1
      ? subMinutes(date, Math.abs(offset))
      : _addMinutes(date, offset);
  const formattedStr = !localeStr
    ? dateWithTimezoneOffset
    : dateWithTimezoneOffset.toLocaleString(localeStr);
  return formattedStr;
};

const formatTimezoneDefault = date =>
  formatTimezone(date, TIMEZONE_OFFSET_IN_MINS, DATE_LOCALE);

const getSafeDatetime = datetimeOrServerTimestamp => {
  return isDate(datetimeOrServerTimestamp)
    ? datetimeOrServerTimestamp
    : !!datetimeOrServerTimestamp &&
      isFunction(datetimeOrServerTimestamp.toDate)
    ? datetimeOrServerTimestamp.toDate()
    : datetimeOrServerTimestamp;
};

const datesUtils = {
  DATETIME_FORMAT_SHORT,
  prettyDate,
  prettyDateInDays,
  ONE_HOUR_MS,
  HALF_HOUR_MS,
  ONE_DAY_MS,
  DATE_LOCALE,
  isSameDayDate,
  isAlmostSameDate,
  differenceInSeconds,
  differenceInHours,
  differenceInMinutes,
  differenceInMilliseconds,
  differenceInDays,
  convertMillisecondsToDigitalClock,
  convertDigitalClockToMilliseconds,
  convertDigitalClockToTodayMilliseconds,
  createDateWithDateObjAndTimeObj,
  convertMillisecondsToHours,
  convertMinsToHours,
  dateToClockTime,
  parseFromString,
  parseFromStringWithAmPm,
  formatDatetime,
  formatDate,
  getDate,
  getTime,
  getTimeOnFriendlyFormat,
  getMinutes,
  getHours,
  getTomorrow,
  getTomorrowStr,
  getStartOfToday,
  getEndOfToday,
  getEndOfTomorrow,
  getStartOfYesterday,
  getStartOfWeek,
  getEndOfWeek,
  getNearestWeekStr,
  getEndDateForNearestWeek,
  getStartOfMonth,
  getEndOfMonth,
  subHours,
  daysAgo,
  getRecentWords,
  formatTimezone,
  formatTimezoneDefault,
  formatMinutes,
  formatHours,
  getSafeDatetime,
  addMilliseconds,
  addMinutes,
  addDays,
  subDays,
  addHours
};

// Make functions available at window.ISD.utils.dates
addToDevTools('utils.dates', datesUtils);

// Make date-fns available at window.ISD.utils.dateFns
addToDevTools('utils.dateFns', require('date-fns'), { addOnlyIfInDev: false });

export {
  DATETIME_FORMAT_SHORT,
  prettyDate,
  prettyDateInDays,
  ONE_HOUR_MS,
  HALF_HOUR_MS,
  ONE_DAY_MS,
  DATE_LOCALE,
  isSameDayDate,
  isAlmostSameDate,
  differenceInSeconds,
  differenceInHours,
  differenceInMinutes,
  differenceInMilliseconds,
  differenceInDays,
  convertMillisecondsToDigitalClock,
  convertDigitalClockToMilliseconds,
  convertDigitalClockToTodayMilliseconds,
  createDateWithDateObjAndTimeObj,
  convertMillisecondsToHours,
  convertMinsToHours,
  dateToClockTime,
  parseFromString,
  parseFromStringWithAmPm,
  formatDatetime,
  formatDate,
  getDate,
  getTime,
  getTimeOnFriendlyFormat,
  getMinutes,
  getHours,
  getTomorrow,
  getTomorrowStr,
  getStartOfToday,
  getEndOfToday,
  getEndOfTomorrow,
  getStartOfYesterday,
  getStartOfWeek,
  getEndOfWeek,
  getNearestWeekStr,
  getEndDateForNearestWeek,
  getStartOfMonth,
  getEndOfMonth,
  subHours,
  daysAgo,
  getRecentWords,
  formatTimezone,
  formatTimezoneDefault,
  formatMinutes,
  formatHours,
  getSafeDatetime,
  addMilliseconds,
  addMinutes,
  addDays,
  subDays,
  addHours
};
