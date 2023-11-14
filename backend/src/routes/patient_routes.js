const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient_controller');

// POST localhost:5000/api/addPatient
router.post('/addPatient', patientController.addPatient);

// POST localhost:5000/api/addPatient
router.post('/addPatientToProvider', patientController.addPatientToProvider);

// GET localhost:5000/api/getAllPatients
router.get('/getAllPatients', patientController.getAllPatients);

// Get patients from a practice
router.get('/getPatientsByPractice/:practiceID', patientController.getPatientsByPractice);

// GET localhost:5000/api/getPatient
router.get('/getPatient/:id', patientController.getPatient);

// GET localhost:5000/api/checkEmail
router.post('/checkEmail/', patientController.checkEmail);

// DELETE localhost:5000/api/addPatient
router.delete('/deletePatient/:id', patientController.deletePatient);

// POST localhost:5000/api/id (body: "eventName": "...")
router.post('/addTokens/:id', patientController.addTokens);

// GET localhost:5000/api/resetTokens
router.get('/resetTokens', patientController.resetTokens);

// POST localhost:5000/api/addAllergyMedication
router.post('/addAllergyMedication', patientController.addAllergyMedication);

// PATCH localhost:5000/api/:email/updateMaintenanceBottleNums
router.patch('/:email/updateMaintenanceBottleNums', patientController.updateMaintenanceBottleNums);

module.exports = router;

