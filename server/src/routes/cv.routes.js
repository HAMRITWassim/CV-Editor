const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cv.controller");

// requête GET sur /api/cv ------> On récupère le CV
router.get("/", cvController.getCV);

// requête POST sur /api/cv/save ------> On sauvegarde le CV
router.post("/save", cvController.saveCV);

module.exports = router;