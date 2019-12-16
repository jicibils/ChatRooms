// Helper utility functions
import owasp from "owasp-password-strength-test";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";
import get from "lodash/get";
import merge from "lodash/merge";
import keys from "lodash/keys";
import memoize from "lodash/memoize";
import startsWith from "lodash/startsWith";
import toNumber from "lodash/toNumber";
import replace from "lodash/replace";
import capitalize from "lodash/capitalize";
import some from "lodash/some";

import size from "lodash/size";
import map from "lodash/map";
import trim from "lodash/trim";
import { isAValidEmailFn } from "validation/rules";
import { differenceInDays } from "utils/dates";

import { CURRENCY, LANGUAGE_REGION, DAILY_FEE } from "utils/config";

function toggleState(component, key, { delayWait = 0 } = {}) {
  // Initially, call toggleState(this, 'nameOfStateKey')
  // and then add it to a handler that will call it with () or (data) and this
  // function will toggle state with a delay of delayWait or 0 ms and
  // return args data so it can be chained or composed

  if (!component || !component.setState || !key) {
    throw new Error(
      "toggleState requires a react component and valid state key in param obj"
    );
  }

  const setState = () => {
    component.setState({ [key]: !component.state[key] });
  };

  return data => {
    setTimeout(setState, delayWait);
    return data;
  };
}

function queueSetState(component, fields, callback) {
  // Usage: queueSetState(this, {myState})
  if (!component || !component.setState) {
    throw new Error("queueSetState requires a react component as first param");
  }

  return component.setState(updateState(fields), callback);
}

function updateState(fields) {
  // Use for a setState function such as this.setState(updateState({myState}));
  return (state, props) => fields;
}

function isInBrowser() {
  return (
    typeof navigator === "object" &&
    navigator &&
    navigator.userAgent &&
    !navigator.userAgent.includes("Node.js") &&
    !navigator.userAgent.includes("jsdom")
  );
}

function isInChrome() {
  // From https://stackoverflow.com/a/49328524
  // Chrome 1 - 71
  return (
    isInBrowser() &&
    !!window.chrome &&
    (!!window.chrome.webstore || !!window.chrome.runtime)
  );
}

function setAutoCompleteAttribute(value) {
  if (value !== "off" || !isInChrome()) return value;
  // Chrome acts differently from other browsers so use 'new-password' to
  // disable the autofill / autocomplete feature
  // See https://stackoverflow.com/a/50348848
  return "new-password";
}

function isInNode() {
  return (
    typeof navigator === "undefined" ||
    (navigator.userAgent || "").includes("Node.js")
  );
}

function isLocalhost() {
  if (typeof window === "undefined" || !window.location) return false;
  return Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );
}

function isBrowserWindowInFocus() {
  return typeof document !== undefined && document.hasFocus();
}

// Returns a color from a string as a parameter.
function stringToColor(str) {
  // From https://stackoverflow.com/a/16348977
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = "#";
  for (var d = 0; d < 3; d++) {
    var value = (hash >> (d * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

// Take a hex string color and return a hex string color representing
// a color more darker or brigther depending on the 'percent' param.
// From https://stackoverflow.com/a/13542669/9301892 (Version 2 Hex).
// Parameters:
//  color: 7 chars length hex string color (like '#88af6c')
//  percent: value between (-1.0, 1.0)
function shadeColor(color, percent) {
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

// Returns base64Image unaltered if image is wider than it is tall, otherwise
// returns rotated image turned clockwise by default unless 2nd param is false
function orientImageToLandscape(
  base64Image,
  turnClockwiseIfNotInLandscape = true
) {
  // Create Image
  const img = new Image();
  img.src = base64Image;

  const imgWidth = img.width;
  const imgHeight = img.height;

  const isSideways = imgHeight > imgWidth;

  if (isSideways) {
    return rotateBase64Image90deg(base64Image, turnClockwiseIfNotInLandscape);
  }

  return base64Image;
}

// Returns rotated base64 image string either 90 deg clockwise|counterclockwise
// Modified from: https://stackoverflow.com/a/41818901/7680642
function rotateBase64Image90deg(base64Image, isClockwise) {
  // Create an off-screen canvas
  const offScreenCanvas = document.createElement("canvas");
  const offScreenCanvasCtx = offScreenCanvas.getContext("2d");

  // Create Image
  const img = new Image();
  img.src = base64Image;

  // Set its dimension to rotated size
  offScreenCanvas.height = img.width;
  offScreenCanvas.width = img.height;

  // Rotate and draw source image into the off-screen canvas:
  if (isClockwise) {
    offScreenCanvasCtx.rotate((90 * Math.PI) / 180);
    offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
  } else {
    offScreenCanvasCtx.rotate((-90 * Math.PI) / 180);
    offScreenCanvasCtx.translate(-offScreenCanvas.height, 0);
  }
  offScreenCanvasCtx.drawImage(img, 0, 0);

  // Encode image to data-uri with base64
  return offScreenCanvas.toDataURL();
}

function browserFileDownload(url) {
  const element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("download", "");
  element.setAttribute("target", "_blank");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const addUrlParam = (history, urlParamKey, urlParamValue) => {
  const addedSuccessfully = true;
  if (!history || !history.location || !history.push) return !addedSuccessfully;
  if (!urlParamKey) return !addedSuccessfully;

  const urlParamStr =
    urlParamValue !== undefined
      ? `${urlParamKey}=${urlParamValue}`
      : `${urlParamKey}`;
  const existingSearchStr = history.location.search;
  const newSearchStr = !!existingSearchStr
    ? `${existingSearchStr}&${urlParamStr}`
    : `?${urlParamStr}`;
  history.push(newSearchStr);

  return addedSuccessfully;
};

const removeUrlParamKey = urlParamKey => {
  const removedSuccessfully = true;
  try {
    const withDelimiters = "?&" + urlParamKey;
    const withSearchDelimiter = "?" + urlParamKey;
    const withJoinDelimiter = "&" + urlParamKey;
    // Remove in case url is 'https://<server-url>/?&urlParamKey'
    let urlWithoutParam = window.location.href.replace(withDelimiters, "");
    // Remove in case url is 'https://<server-url>/?urlParamKey'
    urlWithoutParam = urlWithoutParam.replace(withSearchDelimiter, "");
    // Remove in case url is 'https://<server-url>/?&someOtherKey&urlParamKey'
    urlWithoutParam = urlWithoutParam.replace(withJoinDelimiter, "");
    window.history.replaceState({}, window.location.title, urlWithoutParam);
  } catch (errorReplaceState) {
    // Unable to clear url param; probably environment does not support HTML5
    return !removedSuccessfully;
  }
  return removedSuccessfully;
};

const isUrlParamPresent = (
  urlParamKey,
  { shouldRemoveParamKey = false } = {}
) => {
  let isPresentInUrl = false;
  try {
    // Note: ~(-1) === 0 && ~(2) === -3 and is convenient to use with indexOf()
    isPresentInUrl = ~window.location.search.indexOf(urlParamKey);
    if (!isPresentInUrl) return isPresentInUrl;
    if (shouldRemoveParamKey) removeUrlParamKey(urlParamKey);
  } catch (someError) {
    // Environment probably does not support window and url params
    return null;
  }
  return isPresentInUrl;
};

function isBasicEmail(emailStr = "") {
  //  Note: this is not gauranteed to be a properly formatted email, but it
  // will catch most mistakes
  // Minimum email is u@a.bb
  // Ref: https://www.wired.com/2008/08/four-regular-expressions-to-check-email-addresses/
  // (but needed to fix it by adding \ in front of last . and changing {2,4} to {2,20}
  // to account for new special TLDs that use custom names).
  const hasBasicEmailStructure = new RegExp(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}/gi
  );
  return hasBasicEmailStructure.test(emailStr);
}

function isAPassword(password = "") {
  const owaspPaswordValidation = owasp.test(password);
  return owaspPaswordValidation.errors && owaspPaswordValidation.errors.length
    ? () => owaspPaswordValidation.errors
    : null;
}

function memoizeForSeconds({ resolver, ttl = 60 } = {}) {
  // memoize function to help remember things up to the time to live (ttl).
  // Returns a lodash memoized func that will memoize objects by their key
  // (unless a resolver function is passed in) up to the ttl (defaults to 60s)
  // Example:
  //  const memoizeMyName = memoizeForSeconds();
  //  memoizeMyName({userName: 'Danny'});
  //  memoizeMyName.cache.get('userName'); // Danny
  //  ...60 seconds later
  //  memoizeMyName.cache.get('userName'); // undefined
  //
  // Inspired by: https://github.com/lodash/lodash/issues/265
  const resolverFn = !!resolver
    ? resolver
    : obj => isObject(obj) && keys(obj)[0];
  const memoFn = memoize(funcOnTimer, resolverFn);

  function funcOnTimer(data) {
    const key = resolverFn(data) || data;
    if (ttl > 0) {
      setTimeout(() => {
        memoFn.cache.delete(key);
      }, ttl);
    }
    return data;
  }
  return memoFn;
}

// Returns phoneNumber in E.164 format (e.g. +16505550101)
function getInternationalPhoneNumber(
  phoneNumber,
  { prefixSymbol = "+", countryCode = "1" } = {}
) {
  if (!phoneNumber) return phoneNumber;

  const isPreformatted =
    startsWith(phoneNumber, prefixSymbol) ||
    startsWith(phoneNumber, countryCode);
  const numbersOnlyStr = phoneNumber.replace(/[^0-9]/g, "");
  const internationalPhoneNumber = !isPreformatted
    ? `${prefixSymbol}${countryCode}${numbersOnlyStr}`
    : `${prefixSymbol}${numbersOnlyStr}`;
  return internationalPhoneNumber;
}

// Return phoneNumber in normal format: (123) 456-7890
function getPrettyPhoneNumber(
  phoneNumberString,
  { prefixSymbol = "+", countryCode = "1" } = {}
) {
  // Remove prefix symbol and country code
  let cleaned = phoneNumberString.replace(
    new RegExp(`\\${prefixSymbol}${countryCode}`),
    ""
  );
  // Remove any other non-numeric char
  cleaned = ("" + cleaned).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/) || [];
  if (!!match.length) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

function addToDevTools(namespacePath, object, { addOnlyIfInDev = false } = {}) {
  // Make key available on window.JIC.namespacePath so DevTools in the browser
  // can run commands like: "JIC.some.path.someValueFunction()"
  // JIC is short for Iron Sheepdog and it is recommended for namespacePath
  // to match the module path.

  /* Example:

  // From src/utils/firebase/db/Collections.js
  addToDevTools('utils.firebase.db', {Collections: {...}});

  // Then in the browser devtools console
  > await JIC.utils.firebase.db.Collections.User.GetAll();

  */

  if (addOnlyIfInDev === true && !isInDevelopment()) return;

  if (typeof window === "undefined") {
    return;
  }

  const rootNamespace = "JIC";
  const path =
    isString(namespacePath) && !isEmpty(namespacePath)
      ? [rootNamespace, ...namespacePath.split(".")]
      : [rootNamespace];
  const existingObject = get(window, path) || {};
  const mergedObject = merge(existingObject, object);
  set(window, path, mergedObject);

  // Add lodash if it doesn't already exist
  if (!window._) {
    set(window, "_", require("lodash"));
  }
}

const printScreen = e => {
  window.print();
  e.stopPropagation();
  e.preventDefault();
};

function toCurrency(amount) {
  const formatter = new Intl.NumberFormat(LANGUAGE_REGION, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2
  });

  return formatter.format(amount);
}

// Insert a array item in a position
const insert = (array, index, item) => {
  array.slice(index, 0, item);
};

function removeNonNumericCharsFromString(str) {
  return replace(str, /[^0-9.-]/g, "");
}

function currencyToNumber(amountStr) {
  return toNumber(removeNonNumericCharsFromString(amountStr));
}

function areDecimalEquals(numberA, numberB) {
  return parseFloat(numberA).toFixed(2) === parseFloat(numberB).toFixed(2);
}

const valueExists = value => !isNull(value) && !isUndefined(value);

const delay = timeInMs => new Promise(res => setTimeout(() => res(), timeInMs));

// btoa inspired by Inspired by: https://github.com/davidchambers/Base64.js/blob/master/base64.js
// and cannot use global browser btoa as it errors in react-native
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const _btoa = (input = "") => {
  let str = input;
  let output = "";

  for (
    let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || ((map = "="), i % 1);
    output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
  ) {
    charCode = str.charCodeAt((i += 3 / 4));
    if (charCode > 0xff) {
      throw new Error(
        "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
      );
    }
    block = (block << 8) | charCode;
  }
  return output;
};
// Takes name and returns '__asciiStr__&name' for unsafe, but simple obfuscation
// where & can be useful for removing name from url param
const mungeStr = name => `__${_btoa(name)}__&${name}`;

const toDecimal = number => {
  const decimalPart = number.toString().split(".")[1];
  return !!decimalPart && decimalPart.length > 0
    ? toNumber(number.toFixed(2))
    : number;
};

const FirstElementOfAnObject = obj => obj[Object.keys(obj)[0]];

const getUserLetter = userData => {
  if (!userData) return " - ";
  return (
    capitalize(get(userData, "nickname.0", "")) + get(userData, "nickname.1")
  );
};

const getArrayDate = integerDate =>
  integerDate
    .toString()
    .split("")
    .map(Number);

const getDayFromInteger = integerDate => {
  var arrayDate = getArrayDate(integerDate);
  return `${arrayDate[6]}${arrayDate[7]}`;
};

const getMonthFromInteger = integerDate => {
  var arrayDate = getArrayDate(integerDate);
  return `${arrayDate[4]}${arrayDate[5]}`;
};

const getYearFromInteger = integerDate => {
  var arrayDate = getArrayDate(integerDate);
  return `${arrayDate[0]}${arrayDate[1]}${arrayDate[2]}${arrayDate[3]}`;
};

const getCreatorStr = (userId, room) => {
  const isOwner = getIsOwner(userId, room);
  return `Created by ${isOwner ? "you" : `${room.creator_name}`}`;
};

const getIsOwner = (userId, room) => {
  return +userId === +room.creator_id;
};

const getIsParticipant = (userId, room) => {
  return some(room.participants, participant => participant === userId);
};

const getIsAuthor = (userId, message) => {
  return +userId === +message.sender_id;
};

const getParticipantsStr = room => {
  return `Participants: ${size(room.participants)}`;
};

const Functions = {
  toggleState,
  queueSetState,
  updateState,
  isInBrowser,
  isInChrome,
  setAutoCompleteAttribute,
  isInNode,
  isLocalhost,
  isBrowserWindowInFocus,
  stringToColor,
  shadeColor,
  orientImageToLandscape,
  rotateBase64Image90deg,
  browserFileDownload,
  addUrlParam,
  isUrlParamPresent,
  isBasicEmail,
  isAPassword,
  memoizeForSeconds,
  getInternationalPhoneNumber,
  getPrettyPhoneNumber,
  printScreen,
  removeNonNumericCharsFromString,
  toCurrency,
  insert,
  currencyToNumber,
  areDecimalEquals,
  valueExists,
  delay,
  mungeStr,
  toDecimal,
  FirstElementOfAnObject,
  getUserLetter,
  getDayFromInteger,
  getMonthFromInteger,
  getYearFromInteger,
  getCreatorStr,
  getIsOwner,
  getIsParticipant,
  getIsAuthor,
  getParticipantsStr
};

// Make Functions available at JIC.utils.functions
addToDevTools("utils.functions", Functions);

export {
  toggleState,
  queueSetState,
  updateState,
  isInBrowser,
  isInChrome,
  setAutoCompleteAttribute,
  isInNode,
  isLocalhost,
  isBrowserWindowInFocus,
  stringToColor,
  shadeColor,
  orientImageToLandscape,
  rotateBase64Image90deg,
  browserFileDownload,
  addUrlParam,
  isUrlParamPresent,
  isBasicEmail,
  isAPassword,
  memoizeForSeconds,
  getInternationalPhoneNumber,
  getPrettyPhoneNumber,
  printScreen,
  removeNonNumericCharsFromString,
  toCurrency,
  insert,
  currencyToNumber,
  areDecimalEquals,
  valueExists,
  delay,
  mungeStr,
  toDecimal,
  FirstElementOfAnObject,
  getUserLetter,
  getDayFromInteger,
  getMonthFromInteger,
  getYearFromInteger,
  getCreatorStr,
  getIsOwner,
  getIsParticipant,
  getIsAuthor,
  getParticipantsStr,
  // Keep addToDevTools as the last named export since it will usually also
  // be called at the bottom of files to add objects to dev tools
  addToDevTools
};
