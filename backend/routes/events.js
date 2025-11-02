// defining all Express routes fro working with events (events.json)
// connecting HTTP requests (GET, POST, PATCH, DELETE) with functions from data/event.js which can read and change data in JSON file. 
// => complete CRUD API for events, with validation and authentification check

const express = require('express');

const { getAll, get, add, replace, remove } = require('../data/event');
const { checkAuth } = require('../util/auth');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');    // validation functions

const router = express.Router();    // enables modular defining of routes, that later get connected into app.js

// GET routes (public access):

// return all events:
router.get('/', async (req, res, next) => {
  console.log(req.token);
  try {
    const events = await getAll();
    res.json({ events: events });
  } catch (error) {
    next(error);
  }
});

// return one event, based on ID:
router.get('/:id', async (req, res, next) => {
  try {
    const event = await get(req.params.id);
    res.json({ event: event });
  } catch (error) {
    next(error);
  }
});


 // Authentification middleware:
router.use(checkAuth);  

// All following routes below the 'router.use(checkAuth);' are NOT public anymore, but require authentification (if request incule a valid token):

//POST route - adds new event:

router.post('/', async (req, res, next) => {
  // 3rd argument 'next' in Express handler is used for forwarding control to the next middleware or error handler. 
  // If not added, we couldn't call next(error) in case of an error – this is standard way to inform Express to jump to global error handler.
  console.log(req.token);
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Adding the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: 'Event saved.', event: data });
  } catch (error) {
    next(error);     
    // forwards error to the global Express error handler - central place to catch all errors, which returns e.g. status 500 and error message
  }
});

// PATCH route - updates existing event based on ID:

router.patch('/:id', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Updating the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: 'Event updated.', event: data });
  } catch (error) {
    next(error);
  }
});

// DELETE route - deletes existing event based on ID:

router.delete('/:id', async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: 'Event deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;   // enables that this router, when imported, can be included into app.js
