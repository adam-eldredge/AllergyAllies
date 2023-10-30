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
        data.NPI = 0;
        data.statusTime = new Date();

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

        foundPatient.NPI = foundProvider.NPI;

        const updatedPatient = await foundPatient.save();

        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getAllPatientsHelper = async (NPI) => {
    try {
        const patientsList = await patient.find({NPI: NPI});
        return patientsList;
    } catch (errror) {
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

// Get patient by id
const getPatient = async (req, res) => {
    try {
        const id = req.params.id;
        const foundPatient = await patient.findById(id);
        if (foundPatient) {
            return res.status(200).json(foundPatient);
        } else {
            return res.status(404).json({ message: `Patient not found: ${id}`});
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
        const firstname = patientToDelete.firstname;

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

// required for const functions
module.exports = {
    addPatient,
    addPatientToProvider,
    getAllPatientsHelper,
    getAllPatients,
    getPatient,
    addTokens,
    resetTokens,
    deletePatient,
}
