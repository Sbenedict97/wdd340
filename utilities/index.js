const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ***************************
 *  Build HTML for vehicle detail view
 * ************************** */
function buildVehicleView(vehicle) {
  return `
    <div class="vehicle-detail">
      <h1>${vehicle.make} ${vehicle.model}</h1>
      <img src="${vehicle.image_url}" alt="${vehicle.make} ${vehicle.model} full-size image" class="vehicle-image">
      <div class="vehicle-info">
        <p><strong>Year:</strong> ${vehicle.year}</p>
        <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
        <p><strong>Description:</strong> ${vehicle.description}</p>
      </div>
    </div>
  `;
}

const invModel = require('../models/inventory-model');

exports.buildClassificationList = async (classification_id = null) => {
    const data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
        classificationList += `<option value="${row.classification_id}"${classification_id && row.classification_id == classification_id ? ' selected' : ''}>${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
};

module.exports = { buildVehicleView, Util };