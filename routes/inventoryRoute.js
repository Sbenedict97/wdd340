// Needed Resources
const express = require('express');
const router = new express.Router();
const inventoryController = require('../controllers/invController');

// Route to build inventory classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to specific details
router.get('/vehicle/:id', inventoryController.getVehicleDetail);

// Error trigger
router.get('/trigger-error', inventoryController.triggerError);

module.exports = router;