const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient_controller');

// POST localhost:5000/api/addPatient
router.post('/addPatient', patientController.addPatient);

// GET localhost:5000/api/getAllPatients
router.get('/getAllPatients', patientController.getAllPatients);

// GET localhost:5000/api/getPatient
router.post('/getPatient', patientController.getPatient);

// DELETE localhost:5000/api/addPatient
router.delete('/deletePatient/:id', patientController.deletePatient);

module.exports = router;