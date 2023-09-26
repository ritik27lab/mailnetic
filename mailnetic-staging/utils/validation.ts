export const validateEmail = (value) => {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Return true if the value matches the email pattern, otherwise return false
    return emailPattern.test(value);
  };