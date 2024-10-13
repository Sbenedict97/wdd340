// controllers/inventoryController.js

const invModel = require('../models/inventory-model');
const Util = require('../utilities/index'); // 

// 'Add Inventory' form with classification list
exports.addInventoryView = async (req, res) => {
    try {
        const classificationList = await Util.buildClassificationList();
        res.render('inventory/add-inventory', { classificationList });
    } catch (error) {
        req.flash('message', 'Error loading classifications.');
        res.redirect('/inv');
    }
};

// Handle POST to add inventory
exports.addInventory = async (req, res) => {
    const { inv_make, inv_model, inv_price, classification_id } = req.body;

    // Validate form inputs
    if (!inv_make || !inv_model || !inv_price || !classification_id) {
        req.flash('message', 'All fields are required.');
        return res.redirect('/inv/inventory/new'); // Redirect 
    }

    try {
        // Add the new inventory
        await invModel.addInventory(req.body); // 
        req.flash('message', 'Inventory item added successfully!');
        res.redirect('/inv'); // Redirect 
    } catch (error) {
        console.error('Error adding inventory:', error);
        req.flash('message', 'Error adding inventory item.');
        res.redirect('/inv/inventory/new'); // Redirect
    }
};

// Render 'Manage Inventory' page
exports.manageInventoryView = async (req, res) => {
    try {
        const inventoryList = await invModel.getInventory();
        const classificationList = await Util.buildClassificationList(); // For filter dropdown
        res.render('inventory/management', { inventoryList, classificationList });
    } catch (error) {
        req.flash('message', 'Error loading inventory.');
        res.redirect('/inv');
    }
};

// Filtering inventory by classification
exports.filterInventory = async (req, res) => {
    const { classification_id } = req.body;
    try {
        const inventoryList = await invModel.getInventoryByClassification(classification_id);
        const classificationList = await Util.buildClassificationList(classification_id);
        res.render('inventory/management', { inventoryList, classificationList });
    } catch (error) {
        req.flash('message', 'Error filtering inventory.');
        res.redirect('/inv');
    }
};

// 'Edit Inventory' form for a specific item
exports.editInventoryView = async (req, res) => {
    const { inv_id } = req.params;
    try {
        const inventoryItem = await invModel.getInventoryById(inv_id);
        const classificationList = await Util.buildClassificationList(inventoryItem.classification_id);
        res.render('inventory/edit-inventory', { inventoryItem, classificationList });
    } catch (error) {
        req.flash('message', 'Error loading inventory item.');
        res.redirect('/inv');
    }
};

// Handle edit inventory item
exports.editInventory = async (req, res) => {
    const { inv_id } = req.params;
    const { inv_make, inv_model, inv_price, classification_id } = req.body;

    // Validate form inputs
    if (!inv_make || !inv_model || !inv_price || !classification_id) {
        req.flash('message', 'All fields are required.');
        return res.redirect(`/inv/inventory/${inv_id}/edit`);
    }

    try {
        // Update the inventory item
        await invModel.updateInventory(inv_id, req.body);
        req.flash('message', 'Inventory item updated successfully!');
        res.redirect('/inv');
    } catch (error) {
        console.error('Error updating inventory:', error);
        req.flash('message', 'Error updating inventory item.');
        res.redirect(`/inv/inventory/${inv_id}/edit`);
    }
};

// Handle remove inventory item
exports.deleteInventory = async (req, res) => {
    const { inv_id } = req.params;
    try {
        await invModel.deleteInventory(inv_id);
        req.flash('message', 'Inventory item deleted successfully!');
        res.redirect('/inv');
    } catch (error) {
        req.flash('message', 'Error deleting inventory item.');
        res.redirect('/inv');
    }
};
