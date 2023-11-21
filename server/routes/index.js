const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

router.post("/api/requests", requestController.handleRequest);
router.get("/api/history", requestController.getHistory);

module.exports = router;
