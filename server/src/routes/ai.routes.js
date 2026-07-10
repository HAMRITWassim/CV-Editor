const express = require ("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

router.post("/reformuler", aiController.textRephrase);

router.post("/traduire", aiController.translateText);

router.post("/orthographe", aiController.checkSpelling);

module.exports = router;