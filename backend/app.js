// backend entry point, made with Express.js:

const bodyParser = require("body-parser"); // middleware for parsing req.body (e.g. JSON body from frontend request)
const express = require("express");

const path = require('path');    // needed to serve static files (pictures etc.)

// const fs = require('fs');

// separate router moduls:
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");

const app = express(); // creates instance of the Express app

app.use(bodyParser.json()); // Each incoming request with Content-Type: application/json parses authomatically into req.body object.

// CORS - middleware:
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // * = Any frontend domain can send requests - ok in development or for public APIs without authentification, 
  // but in production should be fixed to:  
  // res.setHeader('Access-Control-Allow-Origin', 'https://my-frontend.com');
  // OR if we use several frontend domains, use whitelist logic: 
  // const allowedOrigins = ['https://my-frontend.com', 'https://admin.my-frontend.com'];
  // if (allowedOrigins.includes(req.header('Origin'))) {
  // res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
  // }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE"); // allowed methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization"); // allowed headers
  next();
});

// Serve static files from the folder 'pictures':
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));
// console.log(path.join(__dirname, 'pictures'));
// console.log('pictures path =', path.join(__dirname, 'pictures'));

app.get('/debug-pictures', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, 'pictures');
  try {
    const files = fs.readdirSync(dir);
    res.json({ directory: dir, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(authRoutes);    // mounts directly - routes defined inside will start with: /login, /signup...

app.use("/events", eventRoutes);    // mounts under /events - e.g. if in eventRoutes exists router.get('/'), this becomes /events/

// Global error-handler - if any middleware or route throws error, it ends up here:
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});


// Starting the server:
app.listen(8080);


/*   
How this would look like when using CORS middleware (npm package) - cleaner code for both development and production:

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

const app = express();

// Whitelisted domens:
const allowedOrigins = [
  'http://localhost:3000',        // lokal frontend
  'https://my-frontend.com',      // production
  'https://admin.my-frontend.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // if it doesn't have origin (e.g. Postman), or if it is on whitelist → allow
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

app.use(authRoutes);
app.use('/events', eventRoutes);

// Error handler
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message });
});

app.listen(8080);


*/