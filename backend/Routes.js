const express = require('express');
const router = express.Router()
module.exports = router;
const patient = require('./Models/patient');
const provider = require('./Models/provider');


//Post Method
router.post('/addPatient', async (req, res) => {
    const data = new patient({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

// //Get all Method
router.get('/getAllPatients', async (req, res) => {
    try{
        const data = await patient.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Delete by ID Method
router.delete('/deletePatient/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await patient.findByIdAndDelete(id)
        res.send(`Document with ${data.username} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})