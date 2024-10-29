const pool = require("../database/")

/* ***************************
*  Retrieve All Messages
* ************************** */
async function getMessagesByAccountId(account_id){
  try {
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = false"
    return await pool.query(sql, [account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Retrieve Archive
* ************************** */
async function getArchivedMessagesByAccountId(account_id){
  try {
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = true"
    return await pool.query(sql, [account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Retrieve unread message quantity
* ************************** */
async function getUnreadMessageCountByAccountId(account_id){
  try {
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = false AND message_read = false"
    const data = await pool.query(sql, [account_id])
    return data.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Retrieve Archived Message
* ************************** */
async function getArchivedMessageCountByAccountId(account_id){
  try {
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = true"
    const data = await pool.query(sql, [account_id])
    return data.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Create/Send New Message
* *************************** */
async function sendNewMessage(message_to, message_from, message_subject, message_body){
  try {
    const sql = "INSERT INTO public.message (message_to, message_from, message_subject, message_body) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [message_to, message_from, message_subject, message_body])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Retrieve Message
* *************************** */
async function getMessageById(message_id){
  try {
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON message.message_from = account.account_id WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Mark message 
* *************************** */
async function readMessage(message_id){
  try {
    const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Archive message
* *************************** */
async function archiveMessage(message_id){
  try {
    const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Delete message
* *************************** */
async function deleteMessage(message_id){
  try {
    const sql = "DELETE FROM public.message WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

module.exports = { getMessagesByAccountId, getArchivedMessagesByAccountId, getUnreadMessageCountByAccountId, getArchivedMessageCountByAccountId, sendNewMessage, getMessageById, readMessage, archiveMessage, deleteMessage }