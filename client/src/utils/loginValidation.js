export const validateAuthForm = (formData, isLogin) => {
  const errors = {};
  if (!isLogin) {
    const userName = formData.username.trim();
    if (!userName) {
      errors.userName = "Username cannot be empty or contain only spaces.";
    } else if (userName.startsWith(" ")) {
      errors.userName = "Username cannot start with spaces.";
    }
  }
  const email = formData.email.trim();
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email) {
    errors.email = "Email cannot be empty.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  const password = formData.password.trim();
  if (!password) {
    errors.password = "Password cannot be empty and contain spaces.";
  } else if (password.includes(" ")) {
    errors.password = "Password cannot contain spaces.";
  } else if (password.length <= 4) {
    errors.password = "Password must be greater than 4 characters.";
  }
  return errors;
};
