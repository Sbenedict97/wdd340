const express = require("express");
const router = new express.Router();
const messageController = require("../controllers/messageController");
const { handleErrors } = require("../utilities");
const validate = require("../utilities/message-validation");

// Route to build inbox
router.get("/", handleErrors(messageController.buildInbox));

// Route to build inbox/archive
router.get("/archive", handleErrors(messageController.buildArchivedMessages));

// Route to build inbox/send
router.get("/send", handleErrors(messageController.buildSendMessage));

// Route to build inbox/send message
router.post("/send", validate.messageRules(), validate.checkMessageData,
  handleErrors(messageController.sendMessage));

// Route to build inbox/read
router.get("/view/:message_id", handleErrors(messageController.buildViewMessage));

// Route to build account reply message
router.get("/reply/:message_id", handleErrors(messageController.buildReplyMessage));

// Route to build account reply message
router.post("/reply", validate.replyRules(), validate.checkReplyData,
  handleErrors(messageController.replyMessage));

// Route to set message_read = true
router.get("/read/:message_id", handleErrors(messageController.readMessage));

// Route to set message_archived = true
router.get("/archive/:message_id", handleErrors(messageController.archiveMessage));

// Route to delete a message
router.get("/delete/:message_id", handleErrors(messageController.deleteMessage));

module.exports = router