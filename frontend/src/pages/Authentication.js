import { json, redirect } from "react-router-dom";

import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

// new action, it will be triggered whenever the <AuthForm /> is submitted (because it's on the same route as <AuthForm />):
export async function action({ request }) {
  // using the built-in (in browser) URL constructor to check if we're in login or signup mode:
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";
  // use 'login' if 'mode' is not visible or missing

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode." }, { status: 422 });
    // or alternatively, just set the mode to signup, if it's unknown value (if user messes with the link manually)
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  // const response = await fetch('http://localhost:8080/' + mode, {...}
  const response = await fetch("/api/" + mode, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not authenticate user" }, { status: 500 });
  }

  // manage the token

  const resData = await response.json();
  console.log("Login response:", resData);
  const token = resData.token;

  // saving the token in localStorage - we give it a key 'token' and store the real token there:
  localStorage.setItem("token", token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1); // creates a date that is 1h in the future
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/"); // once logged in, user is redirected to the Home page
}
