const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf.controller");

// Appelle "generatePDF" quand le FRONT fait un POST sur /api/pdf/generate
router.post("/generate", pdfController.generatePDF);

module.exports = router;

