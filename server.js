/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const pool = require('./database/');
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const path = require("path");
const app = express();
const utilities = require("./utilities/");
const baseController = require("./controllers/baseController");
const inventoryRoute = require('./routes/inventoryRoute'); 
const accountRoute = require('./routes/accountRoute'); 
const bodyParser = require("body-parser")
const session = require("express-session");
/* ***********************
 * Middleware
 *************************/
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Express Messages Middleware //
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Not at views root

/* ***********************
 * Serve Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Routes
 *************************/
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/routes", inventoryRoute);

// Account routes
app.use("/account", accountRoute); // Added account route

// File Not Found Route
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Local Server Information 
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement 
 *************************/

app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
});

/* ***********************
 * Express Error Handler
 *************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status === 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});
