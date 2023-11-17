const patient = require('../Models/patient');
const protocols = require('../Models/protocols');
const provider = require('../Models/provider');
const treatment = require('../Models/treatment');

// Needs Testing
const addPatient = async (req, res) => {
    // implement duplicate check
    try {
        const { firstName, lastName, email, phone, password, DoB, height, weight } = req.body;

        const data = new patient({
            firstName, lastName, email, phone, password, DoB, height, weight
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

// Get patient by id
const findPatient = async (req, res) => {
    try {
        const email = req.params.email;
        const foundPatient = await patient.findOne({email: email});
        if (foundPatient) {
            return res.status(200).json(foundPatient);
        } else {
            return res.status(404).json({ message: `Patient not found: ${email}` });
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


//This has to be called AFTER nextTreatment has been called ONCE
/*
    This method returns an array of numbers corresponding to the vials from the protocol and in patient bottles
*/
const findPercentMaintenance = async (req, res) => {
    try{

        const id = req.params.id;
        const foundPatient = await patient.findById(id);
        if (!foundPatient) {
            return res.status(404).json({ message: `Patient not found ${id}`});
        }

        const foundProtocol = await protocols.findOne( {providerID: foundPatient.providerID} );
        if (!foundProtocol) {
            return res.status(404).json({ message: `Protocol not found.`});
        }

        //Find the last treatment of the patient 
        const treatmentLength = foundPatient.treatments.length();

        if(treatmentLength < 3){
            return res.status(404).json({ message: `Not enough patient data`});
        }

        const patientNextTreatmentID = null;
        const patientLastTreatmentID = null;
        const patientSecondToLastTreatmentID = null;


        /*
            Needs to catch out of bounds errors
        */
        try {
            patientNextTreatmentID = foundPatient.treatments[treatmentLength - 1];
            patientLastTreatmentID = foundPatient.treatments[treatmentLength - 2];
            patientSecondToLastTreatmentID = foundPatient.treatments[treatmentLength - 3];
        } catch (error) {
            if (error instanceof RangeError){
                return res.status(201).json({ message: 'Treatments not added correctly.'})
            }
        }
        

        const nextTreatment = await treatment.findById(patientNextTreatmentID);
        const lastTreatment = await treatment.findById(patientLastTreatmentID);
        const secondToLastTreatment = await treatment.findById(patientSecondToLastTreatmentID);
        let array = [];

        if(nextTreatment.attended == false && lastTreatment.attended == true && secondToLastTreatment.attended == true){
            for(let i = 0; i < lastTreatment.bottles.length(); i++){

                let lastInjVol = lastTreatment.bottles[i].injVol;
                let secLastInjVol = secondToLastTreatment.bottles[i].injVol;
                let lastDoseAdvancement = lastTreatment.bottles[i].currentDoseAdvancement;
                let secLastDoseAdvancement = secondToLastTreatment.bottles[i].currentDoseAdvancement;
                let lastTreatmentBN = lastTreatment.bottles[i].currBottleNumber;
                let secLastTreatmentBN = secondToLastTreatment.bottles[i].currBottleNumber;
                let ptMaintBottle = foundPatient.maintenanceBottleNumber[i].maintenanceNumber;
                let injVolIncreaseInterval = foundProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval;
    
    
                let percentMaintenance = 0;
                const totalInjCountForMaint = (foundProtocol.nextDoseAdjustment.maxInjectionVol / injVolIncreaseInterval) * ptMaintBottle
    
                if(lastInjVol >= (secLastInjVol + injVolIncreaseInterval)){
                    lastDoseAdvancement = secLastDoseAdvancement + 1;
                    await lastTreatment.save();
                    array.push(percentMaintenance = lastDoseAdvancement / totalInjCountForMaint);
                }
                else{
                    if(lastInjVol == secLastInjVol){
                        lastDoseAdvancement = secLastDoseAdvancement;
                        await lastTreatment.save();
                        array.push(percentMaintenance = lastDoseAdvancement / totalInjCountForMaint);
                    }
                    else{
                        if((parseInt(lastTreatmentBN) > secLastTreatmentBN) && (parseInt(lastTreatmentBN) < ptMaintBottle))
                        {
                            lastDoseAdvancement = secLastDoseAdvancement + 1;
                            await lastTreatment.save();
                            array.push(percentMaintenance = lastDoseAdvancement / totalInjCountForMaint);
                        }
                        else{
                            if(lastTreatmentBN == "M"){
                                lastDoseAdvancement = totalInjCountForMaint;
                                await lastTreatment.save();
                                array.push(percentMaintenance = lastDoseAdvancement / totalInjCountForMaint);
                            }
                            else{
                                if((lastDoseAdvancement - ((secLastInjVol - lastInjVol) / injVolIncreaseInterval)) < 1)
                                {
                                    lastDoseAdvancement = 1;
                                    await lastTreatment.save();
                                    array.push(percentMaintenance = lastDoseAdvancement / totalInjCountForMaint);
                                }
                                else{
                                    lastDoseAdvancement = (lastDoseAdvancement - ((secLastInjVol - lastInjVol) / injVolIncreaseInterval));
                                    await lastTreatment.save();
                                    array.push(percentMaintenance = lastDoseAdvancement / totalInjCountForMaint);
                                }
                            }
                        }
                    }
                }
            }
        }
        else{

            for( let i = 0; i < lastTreatment.bottles.length; i ++){
                array.push(0);
            }
            return res.status(201).json({array, message: 'Array of 0\'s sent'});
        }

        //Sending over array of percent maintenance for each vial in the same order as stored in treatment
        return res.status(200).json({array, message: `Array of maintenance sent`});
    }
    catch(error){
        console.log(error);
        return res.status(404).json({ message: `Error`});
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

// Get medication by id
const getAllergyMedication = async (req, res) => {
    try {
        const id = req.params.id;
        const foundPatient = await patient.findById(id);
        if (foundPatient) {
            return res.status(200).json(foundPatient.allergyMedication);
        } else {
            return res.status(404).json({ message: `Patient not found: ${id}` });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const updateLLR = async (req, res) => {
    try {
        const { patientID, date, bottleName, injLLR } = req.body;
        //const treatmentToUpdate = await treatment.findOneAndUpdate({patientID: patientID}, {...req.body} );
        const treatmentToUpdate = await treatment.findOne(
            { patientID: patientID, date: date}
        );
        const treatmentIndex = treatmentToUpdate.bottles.findIndex(bottleName == bottleName);
        treatmentToUpdate.bottles[treatmentIndex].injLLR = injLLR;
        await treatmentToUpdate.save();
        res.status(200).json({ message: 'Successful update'});
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateMaintenanceBottleNums = async (req, res) => {
    try{
        const email = req.params.email;
        const query = {email : email}
        const update = {maintenanceBottleNumber: req.body}

        let p = await patient.findOne(query);
        console.log(email);
        console.log(p);
        let updated = await patient.updateOne(query, update)
        
        return res.status(200).json({patient: updated})
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
    findPercentMaintenance,
    getAllergyMedication,
    updateMaintenanceBottleNums,
    updateLLR,
    findPatient
}
