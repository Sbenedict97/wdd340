const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const { handleErrors } = require("../utilities")
const validate = require("../utilities/message-validation")

// Route to build inbox view
router.get("/inbox", handleErrors(messageController.inboxView));

// Route to build archived view
router.get("/archive", handleErrors(messageController.archivedView));

// Route to build sent view
router.get("/send", handleErrors(messageController.sendView));

// Route to build sent view
router.post("/send", validate.messageRules(), validate.checkMessageData,
  handleErrors(messageController.sendMessage));

// Route to build read message view
router.get("/read/:message_id", handleErrors(messageController.readMessageView));

// Route to build account reply message view
router.get("/reply/:message_id", handleErrors(messageController.replyMessageView));

router.post("/reply", validate.replyRules(), validate.checkReplyData, 
    handleErrors(messageController.replyMessage));

// Route to set message_read
router.get("/read/:message_id", handleErrors(messageController.readMessage));

// ARCHIVE
router.get("/archive/:message_id", handleErrors(messageController.archiveMessage));

// DELETE
router.get("/delete/:message_id", handleErrors(messageController.deleteMessage));

module.exports = router