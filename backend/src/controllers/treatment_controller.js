const treatment = require('../Models/treatment');
const patient = require('../Models/patient');
const protocol = require('../Models/protocols');

// Post method
exports.addTreatment = async (req, res) => {
    try {
        const { nameOfPractice, NPI, patientLastName, patientFirstName, patientID, 
            medication, injVols, bottleNumbers, LLR, dilutions, dosage, date, attended 
        } = req.body;
        const data = new treatment({
            nameOfPractice, NPI, patientLastName, patientFirstName, patientID, 
            medication, injVols, bottleNumbers, LLR, dilutions, dosage, date, attended
        });
        //Should add patient treatment data to end of array
        patient.findByIdAndUpdate({_id: req.body.patientID},
            { $push: {treatments: data}},
            function(error){
                if(error){
                    console.log(error);
                }
                else{
                    console.log(`Treatment added to ${patientLastName}, ${patientFirstName} for ${nameOfPractice}.`)
                }
            });
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get treatment by practice, provider, treatment date and patient first/last/ID
exports.getTreatment = async (req, res) => {
    try {
        const nameOfPractice = req.body.nameOfPractice.toString();
        const NPI = req.body.NPI.toString();
        const patientFirstName = req.body.patientFirstName.toString();
        const patientLastName = req.body.patientLastName.toString();
        const patientID = req.body.patientID.toString();
        const date = req.body.date.toString();
        const data = await treatment.findOne({ nameOfPractice: nameOfPractice, NPI: NPI, 
            patientLastName: patientLastName, patientFirstName: patientFirstName, 
            patientID: patientID, date: date 
        });
        if (data === null) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(201);
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}


