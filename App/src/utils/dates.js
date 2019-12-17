// Datetime Utilities, unless specified, all functions return a Date
import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";
import isToday from "date-fns/isToday";
import isTomorrow from "date-fns/isTomorrow";
import isYesterday from "date-fns/isYesterday";

import toLower from "lodash/toLower";

const prettyDate = dateObject => {
  if (isTomorrow(dateObject)) {
    return "Tomorrow";
  }
  if (isYesterday(dateObject)) {
    return "Yesterday";
  }
  if (isToday(dateObject)) {
    return "Today";
  }
  const now = new Date();
  if (dateObject < now) {
    return formatDistance(dateObject, new Date()) + ` ago`;
  }
  return format(dateObject, DATE_FORMAT_FRIENDLY);
};

const DATE_FORMAT_FRIENDLY = "MMM D, yyyy";

const TIME_FORMAT_FRIENDLY = "h:mma";
const TIME_FORMAT = "HH:mm";

const getTime = (dateObject, onFriendlyFormat) =>
  format(dateObject, onFriendlyFormat ? TIME_FORMAT_FRIENDLY : TIME_FORMAT);

const formatDatetime = (dateObject, stringFormat, isLowerCase) => {
  if (stringFormat === "pretty") {
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

export { prettyDate, formatDatetime, getTime };
