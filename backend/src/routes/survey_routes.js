const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/survey_controller');

router.post('/addSurvey', surveyController.addSurvey);
router.get('/getAllSurveys', surveyController.getAllSurveys);

module.exports = router;