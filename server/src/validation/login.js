import Validator from "validator";
import isEmpty from "is-empty";

export default function validateLoginInput(data) {
  const inputData = data;
  const errors = {};

  inputData.email = !isEmpty(inputData.email) ? inputData.email : "";
  inputData.password = !isEmpty(inputData.password) ? inputData.password : "";

  // Email checks
  if (Validator.isEmpty(inputData.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(inputData.email)) {
    errors.email = "Email is invalid";
  }
  // Password checks
  if (Validator.isEmpty(inputData.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};