// import { useState } from 'react';
import { Form, Link, useSearchParams } from 'react-router-dom';

import classes from './AuthForm.module.css';

function AuthForm() {
  // const [isLogin, setIsLogin] = useState(true);

  // function switchAuthHandler() {
  //   setIsLogin((isCurrentlyLogin) => !isCurrentlyLogin);
  // }

  // React Router hook to access query parameters - alternative to using state, additionally also changes query parameters in original route link:
  // changes route (toggle) with each click on Link-button: http://localhost:3000/auth?mode=signup or http://localhost:3000/auth?mode=login

  // const [searchParams, setsearchParams] = useSearchParams();
   const [searchParams] = useSearchParams();
  // searchParams - object that gives access to currently set query parameters
  // setsearchParams - function not needed here

  // checking if user wants to log in or sign up:
  const isLogin = searchParams.get('mode') === 'login';
  // checking if the value for query parameter 'mode' is 'login', or if not, then we assume it's in 'signup' mode

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          {/* <button onClick={switchAuthHandler} type="button">
            {isLogin ? 'Create new user' : 'Login'}
          </button> */}
          {/* adding a query parameter ?mode to the usual '/' route - now we have Link that allows to switch between 2 modes: */}
          <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
            {isLogin ? 'Create new user' : 'Login'}
          </Link>
          {/* changes route on each click: http://localhost:3000/auth?mode=signup or http://localhost:3000/auth?mode=login */}
          <button>Save</button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
