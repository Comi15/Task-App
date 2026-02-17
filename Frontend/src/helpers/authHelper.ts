import validator from "validator";

export const validate = (pass: string) => {
  if (
    validator.isStrongPassword(pass, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return true;
  } else {
    return false;
  }
};
