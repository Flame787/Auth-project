export function getAuthToken() {
  // fetching the token from local storage:
  const token = localStorage.getItem("token");
  return token;
}

export function tokenLoader() {
  return getAuthToken();
  // returns the result of getAuthToken() function
}
