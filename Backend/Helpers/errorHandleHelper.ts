export const handleErrors = (err: any): string => {
  if (!err || !err.message) {
    return "Oops something went wrong";
  }
  return err.message;
};
