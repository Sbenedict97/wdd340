const express = require("express");
const router = new express.Router();
const messageController = require("../controllers/messageController");
const { handleErrors } = require("../utilities");
const validate = require("../utilities/message-validation");

// Route to build inbox view
router.get("/", handleErrors(messageController.inboxView));

// Route to build archived view
router.get("/archive", handleErrors(messageController.archivedView));

// Route to build sent view
router.get("/send", handleErrors(messageController.sendView));

// Route to post a new message
router.post("/send", validate.messageRules(), validate.checkMessageData, handleErrors(messageController.sendMessage));

// Route to build read message view
router.get("/read/:message_id", handleErrors(messageController.readMessageView));

// Route to build account reply message view
router.get("/reply/:message_id", handleErrors(messageController.replyMessageView));

// Route to submit a reply
router.post("/reply", validate.replyRules(), validate.checkReplyData, handleErrors(messageController.replyMessage));

// Route to mark a message as read
router.get("/mark-read/:message_id", handleErrors(messageController.readMessage));

// ARCHIVE - Route to archive a message
router.get("/archive/:message_id", handleErrors(messageController.archiveMessage));

// DELETE - Route to delete a message
router.get("/delete/:message_id", handleErrors(messageController.deleteMessage));

module.exports = router;
