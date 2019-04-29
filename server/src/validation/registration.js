import Validator from 'validator';
import isEmpty from 'is-empty';

export default function validateRegisterInput(data) {
  const inputData = data;
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  inputData.name = !isEmpty(inputData.name) ? inputData.name : '';
  inputData.email = !isEmpty(inputData.email) ? inputData.email : '';
  inputData.password = !isEmpty(inputData.password) ? inputData.password : '';
  inputData.password2 = !isEmpty(inputData.password2) ? inputData.password2 : '';

  // Name checks
  if (Validator.isEmpty(inputData.name)) {
    errors.name = 'Name field is required';
  }

  // Email checks
  if (Validator.isEmpty(inputData.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(inputData.email)) {
    errors.email = 'Email is invalid';
  }

  // Password checks
  if (Validator.isEmpty(inputData.password)) {
    errors.password = 'Password field is required';
  }

  if (Validator.isEmpty(inputData.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if (!Validator.isLength(inputData.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!Validator.equals(inputData.password, inputData.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
