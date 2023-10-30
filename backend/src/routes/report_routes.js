const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report_controller');
//const verifyJWT = require('../middleware/verify_JWT');

//router.use(verifyJWT)
router.get('/getAllReportNames', reportController.getAllReportNames);
// :id -> report id
router.get('/getReportData/:id', reportController.getReportData);

router.get('/approachingMaintenanceReport/:NPI', reportController.generateApproachingMaintenanceReport);

router.get('/attritionReport/:NPI', reportController.generateAttritionReport);

router.get('/generalRefillsReport/:NPI', reportController.generateGeneralRefillsReport);

router.get('/allergyDropsRefillsReport/:NPI', reportController.generateAllergyDropsRefillsReport);

router.get('/allergyShotsRefillsReport/:NPI', reportController.generateAllergyShotsRefillsReport);

router.get('/epipenRefillsReport/:NPI', reportController.generateEpipenRefillsReport);

router.get('/needsRetestReport/:NPI', reportController.generateNeedsRetestReport);

module.exports = router;
