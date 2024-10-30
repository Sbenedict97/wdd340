const accountModel = require("../models/account-model")
const messageModel = require("../models/messages-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view 
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account view 
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  let unreadMessages = await messageModel.getUnreadMessageCountByAccountId(res.locals.accountData.account_id)
  res.render("account/acct-manage", {
    title: "Account",
    nav,
    errors: null,
    unreadMessages,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password 
  let hashedPassword
  try {

    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  

  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    // continue to login
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors:null,
    })
  } else {
    req.flash("error", "Sorry, the registration failed.")
    // render registration view
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  // gABE returns row count == 0 || == 1 
  // ? 0 -> return error ? 1 return * accountData
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    // no account data? try again
    return
  }
  try {
    let match = await bcrypt.compare(account_password, accountData.account_password);
    if (match) {
      // delete password from accountData array
  
      delete accountData.account_password

      // use .env secret key to sign
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      throw new Error('Access forbidden')
    }
  } catch (error) {
    // return new Error('Access Forbidden')
    req.flash("notice", "Please check your credentials and try again.")
    res.redirect("/account/login")
    return error
  }
}

/* ****************************************
*  Deliver edit account information 
* *************************************** */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav()
  let account = res.locals.accountData
  const account_id = parseInt(req.params.account_id)
  res.render("account/update", {
    title: "Edit Account Information",
    nav,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account_id,
  })
}

/* ****************************************
*  Process updated account info
* *************************************** */
async function editAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  // pass (fname, lname, email) to model update
  const regResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)
  if (regResult) {
    // message that the update was successful
    res.clearCookie("jwt")
    const accountData = await accountModel.getAccountById(account_id)
    // use .env secret key to sign
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash("success", `Congratulations, ${account_firstname} you\'ve succesfully updated your account info.`)
    res.status(201).render("account/acct-manage", {
      title: "Edit Account Information",
      nav,
      errors:null,
      account_firstname,
      account_lastname,
      account_email,
    })
  } else {
    req.flash("error", "Sorry, the update failed.")
    // render account edit view
    res.status(501).render("account/update", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    })
  }
}

/* ****************************************
*  Process updated password
* *************************************** */
async function editAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  // Hash the password
  let hashedPassword
  try {
    // regular password and cost
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/update", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  // pass (hashpass, account_id) to model update
  const regResult = await accountModel.changeAccountPassword(hashedPassword, account_id)
  // account account = res.locals.accountData
  if (regResult) {
    const account = await accountModel.getAccountById(account_id)
    req.flash("success", `Congratulations, ${account_firstname} you\'ve succesfully updated your account info.`)
    res.status(201).render("account/acct-manage", {
      title: "Edit Account Information",
      nav,
      errors:null,
      account_firstname: account.account_firstname,
    })
  } else {
    // const account = await accountModel.getAccountById(account_id)
    req.flash("error", "Sorry, please try again.")
    res.status(501).render("account/update", {
      title: "Edit Account Information",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Logout user
* *************************************** */
async function logoutAccount(req, res, next) {
  res.clearCookie('jwt')
  res.redirect("/")
  return
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildEditAccount, editAccountInfo, editAccountPassword, logoutAccount }