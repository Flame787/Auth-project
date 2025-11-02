import { redirect } from "react-router-dom";

export function action() {
  localStorage.removeItem("token");
  // removing the token when user loggs out and redirecting him to the Home / starting page
  return redirect("/");
}
