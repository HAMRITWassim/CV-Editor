const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cv.controller");

// requête GET sur /api/cv ------> On récupère tous les CVs
router.get("/", cvController.getAllCVs);

// requête POST sur /api/cv ------> On créé un CV
router.post("/", cvController.createCV);

module.exports = router;