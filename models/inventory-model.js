const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and by classification_id
 * ************************** */
// 
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1", 
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items and inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i WHERE i.inv_id = $1", 
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getvehiclebyid error " + error)
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name) {
  try {
    // Normalize the classification name to lower case
    const normalizedClassificationName = classification_name.toLowerCase();
    
    // SQL query to check for existing classification (case-insensitive)
    const sql = "SELECT * FROM classification WHERE LOWER(classification_name) = $1";
    const classification = await pool.query(sql, [normalizedClassificationName]);

    // Return true if a duplicate exists, otherwise false
    return classification.rowCount > 0;
  } catch (error) {
    console.error("Error checking classification:", error); // Log the error for debugging
    throw new Error(error.message); // Rethrow the error for further handling
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClass(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  INSERT new vehicle
 * ************************** */
async function addVehicle(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  UPDATE existing vehicle info
 * ************************** */
async function updateVehicle(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id,
  inv_id
  ) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"    
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  DELETE vehicle
 * ************************** */
async function deleteVehicle(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    // delete success ? 1 : 0
    return data
  } catch (error) {
    // return error.message
    new Error("Delete Inventory Error")
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInvId, checkExistingClassification, addClass, addVehicle, updateVehicle, deleteVehicle }