const patient = require('../Models/patient');
// const provider = require('../Models/provider');

// Post method
exports.addPatient = async (req, res) => {
    // implement duplicate check
    // add password encryption
    try {
        const { firstName, lastName, email, password } = req.body;
        const data = new patient({
            firstName, lastName, email, password
        });

        const dataToSave = await data.save();
        return res.status(200).json(dataToSave);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Get all method
exports.getAllPatients = async (req, res) => {
    try {
        const data = await patient.find();
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Get patient by id
exports.getPatient = async (req, res) => {
    try {
        const id = req.params.id;
        const foundPatient = await patient.findById(id);
        if (foundPatient) {
            return res.status(200).json(foundPatient);
        } else {
            return res.status(404).json({ message: `Patient not found: ${id}` });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Get patient by email
exports.checkEmail = async (req, res) => {
    try {
        const email = req.body.email.toString();
        const data = await patient.findOne({ email: email })
        if (data === null) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(201);
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Delete by ID method
exports.deletePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const patientToDelete = await patient.findById(id);
        if (!patientToDelete) {
            return res.status(404).json({ message: `Patient not found: ${id}` });
        }
        const firstname = patientToDelete.firstname;

        await patient.findByIdAndDelete(id);
        return res.status(200).json({ message: `Document with ${firstname} has been deleted..` });
    }
    catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

