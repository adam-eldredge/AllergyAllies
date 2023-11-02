const express = require('express');
const router = express.Router();
const alertController = require('../Models/alert_controller');

router.get('/getAlerts', alertController.getAlerts);

router.delete('/deleteAlert', alertController.deleteAlert);
