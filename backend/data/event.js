// Data access layer for work with 'events.json' as if it was a database.
// *events - data about some local events in community, the app is collecting local events and provides info.

// This file doesn't know about Express routes, it just knows how to write and read data into storage (JSON file) - it uses readData & writeData.

const { v4: generateId } = require("uuid");
// uuid - used for generating unique IDs - with method generateId(), often used when we don't have database, but file-based storage
// require('uuid') return object which contains more methods for generating UUIDs (e.g. v1, v3, v4, v5).
// v4 is function that generates random UUID (version 4).

const { NotFoundError } = require("../util/errors");
const { readData, writeData } = require("./util");

// GET ALL EVENTS:
async function getAll() {
  const storedData = await readData(); // reads data from storage
  if (!storedData.events) {
    // if no stored data, throws error
    throw new NotFoundError("Could not find any events.");
  }
  return storedData.events; // if no error, returns list of collected 'events' (real local events in some city or community)
}

// GET SPECIFIC EVENT:
async function get(id) {
  // finds specific event-info by event-ID (instead events, we could search for articles in a shop, or employees in a company, etc.)
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    // 1st error-handling: if no events found at all, it throws error
    throw new NotFoundError("Could not find any events.");
  }

  const event = storedData.events.find((ev) => ev.id === id); // if there are some events found, then it searches for event with specific ID
  if (!event) {
    throw new NotFoundError("Could not find event for id " + id); // 2nd error-handling: if no events found with this ID, it throws error
  }

  return event; // otherwise, if the specific event is found, it returns this event
}

// ADD NEW EVENT:
async function add(data) {
  const storedData = await readData();     // loads full json-document with all events
  storedData.events.unshift({ ...data, id: generateId() });
  // unshift() - JS-method which adds one or more elements on start of the array, and returns new length of the array
  // inserts new event-object to the array 'events' containing other event-objects, 
  // ...data - copies all forwarded info about new event + generates new ID for it
  await writeData(storedData);
}

// UPDATE EXISTING EVENT:
async function replace(id, data) {
  const storedData = await readData();     // loads full json-document with all events
  if (!storedData.events || storedData.events.length === 0) {
    // 1st error-handling: if no events found at all, it throws error
    throw new NotFoundError("Could not find any events.");
  }
  const index = storedData.events.findIndex((ev) => ev.id === id);
  // looks for event with specific ID
  if (index < 0) {
    throw new NotFoundError("Could not find event for id " + id);
    // 2nd error-handling: if no events found with this ID, it throws error
  }
  storedData.events[index] = { ...data, id };
  // if event with this ID is found, it replaces the whole event with new event-data, but same ID remains 
  await writeData(storedData);   
  // asyncronous (async-await), because writing-function can last a while - make sure updated data is stored, before continuing with other operations
}

// REMOVE AN EVENT:
async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.events.filter((ev) => ev.id !== id);
  // filter-function returns new array with all elements, except specific element (=removed, deleted event - removed by ID)
  await writeData({ ...storedData, events: updatedData });
}

// Exporting all CRUD functions, so that routes (routes/events.js) can use them:
exports.getAll = getAll;    // GET ALL EVENTS
exports.get = get;          // GET SPECIFIC EVENT
exports.add = add;          // ADD NEW EVENT
exports.replace = replace;  // UPDATE EXISTING EVENT
exports.remove = remove;   // REMOVE AN EVENT
