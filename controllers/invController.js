// controllers/inventoryController.js

const invModel = require('../models/inventory-model');
const Util = require('../utilities/index');

// 'Add Inventory' form with classification list
exports.addInventoryView = async (req, res) => {
  try {
    const classificationList = await Util.buildClassificationList();
    res.render('inventory/add-inventory', { classificationList });
  } catch (error) {
    console.error('Error loading classification list:', error);
    req.flash('message', 'Error loading classifications.');
    res.redirect('/inv'); // Redirect to inventory page on error
  }
};

// Handle POST to add inventory
exports.addInventory = async (req, res) => {
  const { inv_make, inv_model, inv_price, classification_id } = req.body;

  // Validate form inputs
  if (!inv_make || !inv_model || !inv_price || !classification_id) {
    req.flash('message', 'All fields are required.');
    return res.redirect('/inv/inventory/new'); // Redirect back to form if validation fails
  }

  try {
    // Add the new inventory item
    await invModel.addInventory(req.body);
    req.flash('message', 'Inventory item added successfully!');
    res.redirect('/inv'); // Redirect to inventory management on success
  } catch (error) {
    console.error('Error adding inventory:', error);
    req.flash('message', 'Error adding inventory item.');
    res.redirect('/inv/inventory/new'); // Redirect back to form on error
  }
};

// Render 'Manage Inventory' page
exports.manageInventoryView = async (req, res) => {
  try {
    const inventoryList = await invModel.getInventory();
    const classificationList = await Util.buildClassificationList(); // For filter dropdown
    res.render('inventory/management', { inventoryList, classificationList });
  } catch (error) {
    console.error('Error loading inventory:', error);
    req.flash('message', 'Error loading inventory.');
    res.redirect('/inv'); // Redirect to inventory page on error
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
    console.error('Error filtering inventory:', error);
    req.flash('message', 'Error filtering inventory.');
    res.redirect('/inv'); // Redirect on error
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
    console.error('Error loading inventory item:', error);
    req.flash('message', 'Error loading inventory item.');
    res.redirect('/inv'); // Redirect on error
  }
};

// Handle edit inventory item
exports.editInventory = async (req, res) => {
  const { inv_id } = req.params;
  const { inv_make, inv_model, inv_price, classification_id } = req.body;

  // Validate form inputs
  if (!inv_make || !inv_model || !inv_price || !classification_id) {
    req.flash('message', 'All fields are required.');
    return res.redirect(`/inv/inventory/${inv_id}/edit`); // Redirect back to form if validation fails
  }

  try {
    // Update the inventory item
    await invModel.updateInventory(inv_id, req.body);
    req.flash('message', 'Inventory item updated successfully!');
    res.redirect('/inv'); // Redirect on success
  } catch (error) {
    console.error('Error updating inventory:', error);
    req.flash('message', 'Error updating inventory item.');
    res.redirect(`/inv/inventory/${inv_id}/edit`); // Redirect back to form on error
  }
};

// Handle remove inventory item
exports.deleteInventory = async (req, res) => {
  const { inv_id } = req.params;
  try {
    await invModel.deleteInventory(inv_id);
    req.flash('message', 'Inventory item deleted successfully!');
    res.redirect('/inv'); // Redirect on success
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    req.flash('message', 'Error deleting inventory item.');
    res.redirect('/inv'); // Redirect on error
  }
};
