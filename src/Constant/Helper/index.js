export const hasError = (type, value) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (type == 'email') {
    if (!value) {
      return 'Kindly Enter  Email';
    } else if (re.test(value) == false) {
      return 'Kindly Enter Correct Email';
    }
  }
};
