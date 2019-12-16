// Form validation Errors Messages
export const isRequired = fieldName => `${fieldName} is required`;

export const mustMatch = otherFieldName => {
  return fieldName => `${fieldName} must be equal with ${otherFieldName}`;
};

export const minLength = length => {
  return fieldName => `${fieldName} should have at least ${length} characters`;
};

export const maxLength = length => {
  return fieldName => `${fieldName} must have ${length} characters as maximum`;
};

export const isAnEmail = fieldName => {
  return fieldName => `${fieldName} is not a valid email`;
};

export const isPhoneNumber = fieldValue => {
  return fieldName => `${fieldValue} is not a phone number valid`;
};

export const isNotAnEmptyArray = fieldName =>
  `${fieldName} is empty or is not valid`;

export const isDate = fieldName => {
  return fieldName => `${fieldName} is not a valid date`;
};
