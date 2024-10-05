const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build specific vehicle view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.id; 
    const vehicleData = await invModel.getVehicleById(vehicleId); 

    if (vehicleData) {
      const viewHTML = utilities.buildVehicleView(vehicleData); 
      let nav = await utilities.getNav(); 

      // Detail view
      res.render('inventory/vehicle-detail', {
        title: `${vehicleData.make} ${vehicleData.model}`, 
        nav,
        content: viewHTML, 
      });
    } else {
      res.status(404).render('404', { message: "Vehicle not found." });
    }
  } catch (error) {
    next(error); // 
  }
};

/* ***************************
 *  Intentional error trigger
 * ************************** */
invCont.triggerError = function (req, res, next) {
  const error = new Error('This is an intentional error');
  error.status = 500;
  next(error);
};
module.exports = invCont