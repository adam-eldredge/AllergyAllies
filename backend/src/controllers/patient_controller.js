const patient = require('../Models/patient');
// const provider = require('../Models/provider');

// Post method
exports.addPatient = async (req, res) => {
    const data = new patient({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
}

// Get all method
exports.getAllPatients = async (req, res) => {
    try{
        const data = await patient.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

// Delete by ID method
exports.deletePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const patientToDelete = await patient.findById(id);
        if(!patientToDelete) {
            res.status(404).json({ message: "Patient not found"});
        }
        const firstname = patientToDelete.firstname;
        
        await patient.findByIdAndDelete(id);
        res.status(200).json({ message: `Document with ${firstname} has been deleted..`});
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}
