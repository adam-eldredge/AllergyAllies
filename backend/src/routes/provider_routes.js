const express = require('express');
const router = express.Router();
const providerController = require('../controllers/provider_controller');

// POST localhost:5000/api/addProvider
router.post('/addProvider', providerController.addProvider);

// GET localhost:5000/api/getAllProviders
router.get('/getAllProviders', providerController.getAllProviders);

// GET localhost:5000/api/getProviderEmail
router.post('/getProviderEmail', providerController.getProviderEmail);

// GET localhost:5000/api/getProvider/${id}
router.get('/getProvider/:id', providerController.getProvider);

// DELETE localhost:5000/api/addProvider
router.delete('/deleteProvider/:id', providerController.deleteProvider);

module.exports = router;