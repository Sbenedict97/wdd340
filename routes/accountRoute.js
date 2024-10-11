const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index');
const accountController = require('../controllers/accountController');

// Route for the My Account
router.get('/login', accountController.buildLogin);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

// Error handling
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = router;
