const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert_controller');

router.get('/getAlerts/:providerID', alertController.getAlerts);

router.delete('/deleteAlert/:alertID', alertController.deleteAlert);

module.exports = router;