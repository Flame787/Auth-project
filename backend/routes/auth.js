// defining Express routes for user authentification

const express = require("express");
const { add, get } = require("../data/user");
const { createJSONToken, isValidPassword } = require("../util/auth");
// createJSONToken - creates JWT (Json Web Token) for user authentification 
// JWT is always created on the backend, with help of the secret KEY from .env - in util/auth.js, and then sent to client/browser
// browser stores the JWT token and attaches it to future outgoing requests, and it should indicate if user is logged in (or not)
// once expired, JWT token cannot be extended, but a new JWT token must be created (usually through refresh token)
// once JWT token expires, client/browser sends refresh token to the server -> server checks refresh token and creates new access token

// isValidPassword - compares plain text-password with hased password in the base / json-file
const { isValidEmail, isValidText } = require("../util/validation");
// validation functions for checking email and password

const router = express.Router(); // enables modular defining of routes, that later get connected into app.js

// SIGN UP route (POST /signup):

router.post("/signup", async (req, res, next) => {
  const data = req.body;   // reading data - expecting email & password
  let errors = {};

  if (!isValidEmail(data.email)) {    
    errors.email = "Invalid email.";      // if email not valid
  } else {
    try {
      const existingUser = await get(data.email);    
      // if already existing email - user already in the base, cannot Sign up with this address again:
      if (existingUser) {
        errors.email = "Email exists already.";
      }
    } catch (error) {}
  }

  if (!isValidText(data.password, 6)) {    // password validation - must have at least 6 signs
    errors.password = "Invalid password. Must be at least 6 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "User signup failed due to validation errors.",
      errors,    // if errors existing, returns '422 Unprocessable Entity' with message and details
    });
  }

  // new user registered, password hashed, JWT token created:
  try {
    const createdUser = await add(data);   // if ok, adds user to json-file, password is hashed in data/user.js
    const authToken = createJSONToken(createdUser.email);   // JWT token is generated
    res
      .status(201)          // returns '201 Created' with message, user and token:
      .json({ message: "User created.", user: createdUser, token: authToken });
  } catch (error) {
    next(error);
  }
});

// LOGIN route (POST /login):

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // reading email & password from req.body

  let user;
  try {
    user = await get(email);    // fetches user by email
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed." });
  }

  const pwIsValid = await isValidPassword(password, user.password);   // compares entered password with hashed password for this user
  if (!pwIsValid) {     // if password not valid:
    return res.status(422).json({
      message: "Invalid credentials.",
      errors: { credentials: "Invalid email or password entered." },
    });
  }

  // if email and password are ok:
  const token = createJSONToken(email);   // generates/creates a JWT token
  res.json({ token });    // returns JSON with the token
});

module.exports = router;    // router can be included in app.js


/* 
How checkAuth middleware would look like on Protected routes:

// util/auth.js

const jwt = require('jsonwebtoken');

const KEY = 'supersecret';    // use .env variable

function createJSONToken(email) {
  return jwt.sign({ email }, KEY, { expiresIn: '1h' });
}

function checkAuth(req, res, next) {                 // checkAuth middleware
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  const token = authHeader.split(' ')[1];    // expects "Bearer <token>"

  try {
    const decoded = jwt.verify(token, KEY);
    req.user = decoded;   // save data from tokena into req for later usage
    next();               // let further to the route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = { createJSONToken, checkAuth };

// Client (React app) save token (e.g. to localStorage) and sends it in every request in the header:

// Authorization: Bearer <token>


// Protected routes (e.g. POST /events, PATCH /events/:id, DELETE /events/:id) go through checkAuth.

// If token not existing or not valid → 401 Unauthorized.

// If token is valid → req.user contains data from the token and route executes normally.

*/