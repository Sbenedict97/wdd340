const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Fetch vehicle by ID
 * ************************** */
async function getVehicleById(vehicleId) {
  try {
    const data = await pool.query('SELECT * FROM inventory WHERE inventory_id = $1', [vehicleId]);
    return data.rows[0];
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    throw new Error('Database query failed');
  }
}

const db = require('../database/index');

exports.addInventory = async (inventoryData) => {
    const { inv_make, inv_model, inv_price, classification_id } = inventoryData;
    const sql = `INSERT INTO inventory (inv_make, inv_model, inv_price, classification_id) VALUES ($1, $2, $3, $4)`;
    await db.query(sql, [inv_make, inv_model, inv_price, classification_id]);
};

exports.getClassifications = async () => {
  const sql = 'SELECT classification_id, classification_name FROM classification ORDER BY classification_name ASC';
  return db.query(sql);
};

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById };
