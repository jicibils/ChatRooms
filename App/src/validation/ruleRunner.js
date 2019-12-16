// Form validation rules runner
import keys from 'lodash/keys';
import isEmpty from 'lodash/isEmpty';

import {
  required,
  minLength,
  maxLength,
  isAnEmail,
  isAPassword,
  isNotAnEmptyArray,
  isPhoneNumber,
  isADate
} from './rules';

export const ruleRunner = (field, name, ...validations) => {
  return (state = {}) => {
    for (let validate of validations) {
      const errorMessageFunc = validate(state[field], state);
      if (errorMessageFunc) {
        return { [field]: errorMessageFunc(name) };
      }
    }
    return null;
  };
};

export const run = (state, runners = {}) => {
  const results = keys(runners).reduce((memo, field) => {
    return Object.assign(memo, runners[field](state));
  }, {});
  return isEmpty(results) ? null : results;
};

// fieldSpec is object of objects:
// Example:
//  const fieldSpec = {
//    dateOfBirth: { name: 'Date of Birth', validations: [required] },
//    ... };
// Returns object of rule functions created by ruleRunner
export const createRules = fieldSpec =>
  keys(fieldSpec).reduce((acc, field) => {
    const ruleRunnerFn = ruleRunner(
      field,
      fieldSpec[field].name,
      ...createValidationFunctions(fieldSpec[field].validations)
    );
    acc[field] = ruleRunnerFn;
    return acc;
  }, {});

const createValidationFunctions = validations => {
  let validationFunctions = [];

  keys(validations).map(name => {
    let fn;
    const val = validations[name];
    const noop = () => {};

    switch (name) {
      case 'required':
        fn = val !== false ? required : noop;
        break;
      case 'minLength':
        fn = minLength(val);
        break;
      case 'maxLength':
        fn = maxLength(val);
        break;
      case 'isAnEmail':
        fn = val !== false ? isAnEmail : noop;
        break;
      case 'isAPassword':
        fn = val !== false ? isAPassword : noop;
        break;
      case 'isNotAnEmptyArray':
        fn = val !== false ? isNotAnEmptyArray(val) : noop;
        break;
      case 'isADate':
        fn = val !== false ? isADate : noop;
        break;
      case 'isPhoneNumber':
        fn = val !== false ? isPhoneNumber : noop;
        break;
      default:
    }
    validationFunctions.push(fn);
    return validationFunctions;
  });

  return validationFunctions;
};
