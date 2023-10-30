const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export_controller');

router.get('/getCSV/:id', exportController.getReportCSV);

router.get('/getPDF/:id', exportController.getReportPDF);

module.exports = router;