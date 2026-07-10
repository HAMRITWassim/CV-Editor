const express = require ("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

router.post("/reformuler", aiController.textRephrase);

router.post("/traduire", aiController.translateText);

module.exports = router;