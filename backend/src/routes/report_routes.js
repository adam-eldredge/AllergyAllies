const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report_controller');
//const verifyJWT = require('../middleware/verify_JWT');

//router.use(verifyJWT)
router.get('/getAllReportNames', reportController.getAllReportNames);
// :id -> report id
router.get('/getReportData/:id', reportController.getReportData);

router.get('/deleteReport/:id', reportController.deleteReport);

router.get('/approachingMaintenanceReport/:providerID', reportController.generateApproachingMaintenanceReport);

router.get('/attritionReport/:providerID', reportController.generateAttritionReport);

router.get('/generalRefillsReport/:providerID', reportController.generateGeneralRefillsReport);

router.get('/allergyDropsRefillsReport/:providerID', reportController.generateAllergyDropsRefillsReport);

router.get('/allergyShotsRefillsReport/:providerID', reportController.generateAllergyShotsRefillsReport);

router.get('/epipenRefillsReport/:providerID', reportController.generateEpipenRefillsReport);

router.get('/needsRetestReport/:providerID', reportController.generateNeedsRetestReport);

module.exports = router;
