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

module.exports = router;

// 10/25
// input adverse reaction -> alert
// search bar on main screen for patients
// RSS feed - pollen feed based on location
//      - website link, geolocation
//      - button that alerts doctor they are here
//      - patient is here alert (overrides everything) "Opens up their file?"
//      - open up patient chart -> displays last injection -> suggested current injection
//      - or manually override the current injection
//      - handle inactive patients (in over 3 months, inactive).
//      - all, inactive, maintenance, attrition
// export reports
// what is the point of manually generating reports if automatic
// csv or pdf
// sends externally, option to export it, manually is the main feature
// treatment vials and antigens tested are not related
// several antigens present in treatment vials/shots
// antigens are not 1:1 with vial/bottle types
// if patient missed injection, at risk for attrition (its a yes no)