require("dotenv").config();

const { sign, verify } = require("jsonwebtoken");
// jsonwebtoken - npm dependency, 3rd party package for creating a token; we use it's functions: sign() & verify()
const { compare } = require("bcryptjs");
// npm dependency
const { NotAuthError } = require("./errors");

// const KEY = 'supersecret';
// secret key for signing JWT (JSON Web Token), needed to create a JWT - should be in .env (and not hardcoded)
const KEY = process.env.JWT_SECRET;

function createJSONToken(email) {
  // generates JWT token with payload ( {email} )
  return sign({ email }, KEY, { expiresIn: "1h" });
  // token expires in 1 hour
  // sign() function is integrated in jsonwebtoken - npm package (dependency)
}
// client gets token after signup or login, and sends it into Authorisation header

function validateJSONToken(token) {
  // checks if token has expired - if ok, returns decoded payload (e.g. { email: "...", iat: ..., exp: ... } )
  return verify(token, KEY);
  // if not valid anymore, throws error
  // verify() function is integrated in jsonwebtoken - npm package (dependency)
}

function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword);
  // compares plain-text password that user has entered with hased password saved in json-file
  // bcrypt.compare returns true or false
}

function checkAuthMiddleware(req, res, next) {
  // OPTIONS check: allows CORS preflight requests to pass without check:
  if (req.method === "OPTIONS") {
    return next();
  }

  console.log("Auth header:", req.get("Authorization"));
  
  // checking header - expects Authorization: Bearer <token>:
  // if header missing or has wrong format - error
  if (!req.headers.authorization) {
    console.log("NOT AUTH. AUTH HEADER MISSING.");
    // this error happens e.g. if trying to add new event before user has been authenticated
    return next(new NotAuthError("Not authenticated."));
  }

  const authFragments = req.headers.authorization.split(" ");
  // if client (browser) sends e.g. Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
  // .split(" ") splits string 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6' based on empty space between 2 words
  // creates an array: ["Bearer", "eyJhbGciOi..."]

  if (authFragments.length !== 2) {
    // checks if the arrays has exactly 2 elements (after splitting)
    // if not, then array has wrong format or is missing Bearer -> throws error
    console.log("NOT AUTH. AUTH HEADER INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }
  const authToken = authFragments[1];
  // takes 2nd element of the array (2nd element has id [1]) - which is actual JWT token (and Bearer-word is not needed for further checks)
  try {
    const validatedToken = validateJSONToken(authToken); // validates JWT token
    // if token is ok - it gets saved into decoded payload in req.token:
    req.token = validatedToken;
  } catch (error) {
    // if validation falls -> NotAuthError
    console.log("NOT AUTH. TOKEN INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }
  // if validation passes ok -> next() forwards the request further to the route
  next();
}

// exports - to enable using of these functions in other modules (routes/auth.js, routes/events.js):
exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
