// Functions for validation of user entries (when creating new event):

// checks if text is entered (title of the event):
function isValidText(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

// checks date:
// *user can enter only one date, not range of dates (20.10.2025-30.12.2025 would not be correct - demands different validation)
function isValidDate(value) {
  if (!value) return false;
  const date = new Date(value);
  // return value && date !== "Invalid Date";
  return !isNaN(date.getTime());
}

// checks if added image is valid:
// function isValidImageUrl(value) {
//   if (!value) return false;
//   // console.log("Image value received:", value, typeof value);
//   // return value && value.startsWith("http");
//   return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(value);
//   // return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
//   // return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(value);
// }

// minimal check for valid email address:
function isValidEmail(value) {
  return value && value.includes("@");
}

exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
// exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;
