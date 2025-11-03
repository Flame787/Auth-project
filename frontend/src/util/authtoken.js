import { redirect } from "react-router-dom";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  if (!storedExpirationDate) {
    return -1; // fallback if nothing is saved
  }
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  // getting current timestamp from the expiration timestamp (if token expired, this will be a negative value - exceeded valid time)

  if (isNaN(duration)) {
    return -1; // fallback it date not correct
  }

  return duration;
}

export function getAuthToken() {
  // fetching the token from local storage:
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return "EXPIRED";
    // special string that can be used in other parts of the application to trigger the Logout
  }

  return token;
}

export function tokenLoader() {
  // return getAuthToken();
  // returns the result of getAuthToken() function
  const token = getAuthToken();
  return token;
}

// Protecting the routes where users shouldn't have access, unless logged in.
// In App.js we can add this loader to all the routes that need protection:
export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth");
  }

  return null;
  // additional error handling, needed for edge cases when a route loader doesn't return a value (token or !token), but returns undefined
}
