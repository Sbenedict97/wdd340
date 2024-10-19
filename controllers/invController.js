const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* *******************************************
 * Build inventory for classification view
 * ******************************************* */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: `${className} vehicles`,
        nav,
        grid,
    })
}

/* *******************************************
 * Build vehicle details view
 * ******************************************* */
invCont.buildVehicleDetailsView = async function(req, res, next) {
    const inventoryId = req.params.inventoryId
    const data = await invModel.getInventoryItemByInvId(inventoryId)
    const details = await utilities.buildVehicleDetailsView(data)
    let nav = await utilities.getNav()
    const vehicleYear = data.inv_year
    const vehicleMake = data.inv_make
    const vehicleModel = data.inv_model
    res.render("./inventory/details", {
        title: `${data.inv_year} ${vehicleMake} ${vehicleModel}`,
        nav,
        details
    })
}

/* *******************************************
 * Build add classification view
 * ******************************************* */
invCont.buildManagementView = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: 'Vehicle Management',
        nav,
    })
}

/* *******************************************
 * Build classification view
 * ******************************************* */
invCont.buildAddClassificationView = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: 'Add New Classification',
        nav,
        errors: null,
    })
}

/* *******************************************
 * Build addition inventory view
 * ******************************************* */
invCont.buildAddInventoryView = async function(req, res, next) {
    let nav = await utilities.getNav()
    let classificationDropDown = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: 'Add New Vehicle',
        nav,
        classificationDropDown,
        errors: null,
    })
}

/* *******************************************
 * Proccess add new classification
 * ******************************************* */
invCont.addNewClassification = async function(req, res) {
    const { classification_name }  = req.body

    const result = await invModel.insertClassificationItem(classification_name)

    if (result) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `The ${classification_name} classification was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            "Sorry, adding new classification failed."
        )
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    }
}

/* *******************************************
 * Proccess add new inventory
 * ******************************************* */
invCont.addNewInventory = async function(req, res) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color }  = req.body

    const result = await invModel.insertInventoryItem(
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    )

    if (result) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        req.flash(
            "notice",
            "Sorry, adding new vehicle failed."
        )
        let classificationDropDown = await utilities.buildClassificationList(classification_id)
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            classificationDropDown,
            nav,
            errors: null,
        })
    }
}

module.exports = invCont