// Form Validation Rules
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
// import isDate from 'date-fns/is_valid';

import { isAPassword as isAPasswordFn } from 'utils/functions';
import * as ErrorMessages from './errorMessages.js';

export const required = text => {
  if (text) {
    return null;
  } else {
    return ErrorMessages.isRequired;
  }
};

export const mustMatch = (field, fieldName) => {
  return (text, state) => {
    return state[field] === text ? null : ErrorMessages.mustMatch(fieldName);
  };
};

export const minLength = length => {
  return text => {
    return text.length >= length ? null : ErrorMessages.minLength(length);
  };
};

export const maxLength = length => {
  return text => {
    return text.length <= length ? null : ErrorMessages.maxLength(length);
  };
};

export const isNotAnEmptyArray = validate => array => {
  return isArray(array) && !isEmpty(array)
    ? null
    : ErrorMessages.isNotAnEmptyArray;
};

export const isAValidEmailFn = text => {
  const re = new RegExp(
    // From http://emailregex.com/ that "works 99.99% of the time"
    /*eslint no-useless-escape: "off"*/
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return re.test(text);
};

export const isAnEmail = text => {
  const re = new RegExp(
    // From http://emailregex.com/ that "works 99.99% of the time"
    /*eslint no-useless-escape: "off"*/
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return re.test(text) ? null : ErrorMessages.isAnEmail(text);
};

export const isPhoneNumber = text => {
  /**
   * Regular expresion that match with an empty string
   * or a string with phone number format, examples:
   * https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
   * @type {RegExp}
   */
  const re = new RegExp(
    /^$|^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
  );
  return re.test(text) ? null : ErrorMessages.isPhoneNumber(text);
};

export const isADate = date => {
  // isDate(new Date(date)) ? null : ErrorMessages.isDate(date);
  return true;
};

export const isAPassword = isAPasswordFn;
