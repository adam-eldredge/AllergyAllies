const patient = require('../Models/patient');
const provider = require('../Models/provider');
// const provider = require('../Models/provider');

// Needs Testing
const addPatient = async (req, res) => {
    // implement duplicate check
    try {
        const { firstName, lastName, email, phone, password, DoB } = req.body;

        const data = new patient({
            firstName, lastName, email, phone, password, DoB
        });
        data.status = "DEFAULT";
        data.tokens = 0;
        data.providerID = 0;
        data.statusDate = new Date();

        const dataToSave = await data.save();
        return res.status(200).json(dataToSave);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Needs testing
const addPatientToProvider = async (req, res) => {
    try {
        const {patientID, providerCode} = req.body;
        const foundProvider = await provider.findOne({ providerCode: providerCode });
        const foundPatient = await patient.findById(patientID);
        
        if (!foundPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        foundPatient.providerID = foundProvider.providerID;

        const updatedPatient = await foundPatient.save();

        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getAllPatientsHelper = async (providerID) => {
    try {
        const patientsList = await patient.find({providerID: providerID});
        return patientsList;
    } catch (error) {
        console.error('Error retrieving list of patients: ', error);
    }
}

// Get all method
const getAllPatients = async (req, res) => {
    try {
        const patientsList = await getAllPatientsHelper();
        return res.json(patientsList);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Get all patients from a practice
const getPatientsByPractice = async (req, res) => {
    try {
        const pracID = req.params.practiceID;
        const data = await patient.find({practiceID: pracID});
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Get patient by id
const getPatient = async (req, res) => {
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
const checkEmail = async (req, res) => {
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
const deletePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const patientToDelete = await patient.findById(id);
        if (!patientToDelete) {
            return res.status(404).json({ message: `Patient not found: ${id}` });
        }
        const firstname = patientToDelete.firstName;

        await patient.findByIdAndDelete(id);
        return res.status(200).json({ message: `Document with ${firstname} has been deleted..` });
    }
    catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

/* TOKEN SYSTEM STARTS (may move to new set of files) */

// this could be moved to database, although this meets requirements fine
const eventsConfig = [
    { eventName: "SymptomsImproved", tokens: 5},
    { eventName: "AtMaintenance", tokens: 25},
    { eventName: "AdvancedTreatment", tokens: 15},
    { eventName: "Compliance", tokens: 20},
    { eventName: "TimelyRefill", tokens: 5},
]

const addTokens = async (req, res) => {
    try {
        const id = req.params.id;
        const foundPatient = await patient.findById(id);
        if (!foundPatient) {
            return res.status(404).json({ message: `Patient not found ${id}`});
        }

        // Identify which event was received.
        const event = req.body;

        // search through array to determine which tokens to add. 
        const eventDef = eventsConfig.find( (e) => e.name === event.name);

        // add tokens and save in db
        if (eventDef) {
            const tokensToAdd = eventDef.tokens;
            foundPatient.tokens += tokensToAdd;
            await foundPatient.save();
            return res.status(200).json({ message: `Patient now has: ${foundPatient.tokens} tokens`});
        } else {
            return res.status(400).json({ message: `Event not found: ${event.name}`});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const resetTokens = async (req, res) => {
    try {
        // get all patients
        const allPatients = await patient.find();

        // go through each patient and set to zero
        for (const p of allPatients) {
            if (p.tokens) {
                p.tokens = 0;
            }
            // creates a tokens field if patient doesn't already have in DB
            await p.save();
        }

        return res.status(200).json({ message: 'All patient tokens reset to zero.'})
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }
}

/*
    Body of medications sent as json like this:

    [{
        medication: {
            name:
            dose:
            frequency:
        },
        ...
    }]
*/


const addAllergyMedication = async (req, res) => {
    try{
        const { lastName, email, phone, DoB, medications  } = req.body;
        const findPatient = await patient.findOne({lastName: lastName, email: email, phone: phone, DoB: DoB});
        findPatient.allergyMedication = medications;
        await findPatient.save();
    }
    catch(error){
        return res.status(400).json({ message: error.message})
    }
}

// required for const functions
module.exports = {
    addPatient,
    addPatientToProvider,
    getAllPatientsHelper,
    getAllPatients,
    getPatientsByPractice,
    getPatient,
    checkEmail,
    addTokens,
    resetTokens,
    deletePatient,
    addAllergyMedication,
}
