const express = require('express');
const router = express.Router();
const protocolController = require('../controllers/protocol_controller');

//add protocol
router.post('/addProtocol', protocolController.addProtocol);
//get protocol
router.get('/getProtocol/:NPI', protocolController.getProtocol)
