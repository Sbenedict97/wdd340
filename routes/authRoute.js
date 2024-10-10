const express = require('express');
const router = express.Router();

// Handle Registration
router.post('/register', (req, res) => {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    res.send('Registration successful!');
});

// Handle Login
router.post('/login', (req, res) => {
    const { account_email, account_password } = req.body;

    res.send('Login successful!');
});

module.exports = router;