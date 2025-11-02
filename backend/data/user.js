// data/user.js) implements basic operations for handling users of the app

const { hash } = require("bcryptjs");
// bcryptjs.hash - used for safe hashing of passwords (hashing - one way, not possible to get password from the hash)
const { v4: generateId } = require("uuid");
// generates unique ID for each user

const { NotFoundError } = require("../util/errors");
// error if user not existing
const { readData, writeData } = require("./util");
// importing helper-functions for reading and writing into JSON file, which is used instead of a database

// Adds new user to JSON file:
async function add(data) {
  const storedData = await readData(); // loads existing data (all users) from JSON file
  const userId = generateId(); // generate unique ID
  const hashedPw = await hash(data.password, 12);
  // hash password with 12 salt rounds (passwords are never stored as clear password, but in hash)
  if (!storedData.users) {
    storedData.users = []; // if no users yet, initialize the field
  }
  storedData.users.push({ ...data, password: hashedPw, id: userId }); // replace plain-text password with hash
  await writeData(storedData); // write updated data into JSON file
  return { id: userId, email: data.email }; // return only safe data, without password
}

// Fetching users by their email address:
async function get(email) {
  const storedData = await readData(); // loads existing data  (all users) from JSON file
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError("Could not find any users.");         // if user not found
  }

  const user = storedData.users.find((ev) => ev.email === email);   // if user is found - error
  if (!user) {
    throw new NotFoundError("Could not find user for email " + email);
  }

  return user;                // returns full user, including hashed password
}

// function exports:
exports.add = add;
exports.get = get;
