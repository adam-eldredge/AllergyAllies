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

// Get all method
exports.getAllTreatments = async (req, res) => {
    try {
        const data = await treatment.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
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

// Delete by ID method
exports.deleteTreatment = async (req, res) => {
    try {
        const id = req.params.id;
        const treatmentToDelete = await treatment.findById(id);
        if (!treatmentToDelete) {
            res.status(404).json({ message: "Treatment not found" });
        }

        await treatment.findByIdAndDelete(id);
        res.status(200).json({ message: `Treatment has been deleted..` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//update treatment according to calculations
exports.nextTreatment = async(req, res) => {
    try{
        //Pass in patientID and NPI
        const id = req.params.id;
        const npi = req.body.NPI.toString();

        const patientToFind = await patient.findById(id);
        if (!patientToFind) {
            res.status(404).json({ message: "Patient not found" });
        }

        const findProtocol = await protocol.findOne({ NPI: npi });
        if (!findProtocol) {
            res.status(404).json({ message: "Protocol not found" });
        }


        //Find the last treatment of the patient 
        const treatmentLength = patientToFind.treatments.length();
        const patientLastTreatmentID = patientToFind.treatments[treatmentLength - 1];
        const lastTreatment = await treatment.findById(patientLastTreatmentID);

        //Returns current date in milliseconds
        const today = new Date();
        const lastTreatmentDate = new Date(lastTreatment.date);
        const dateDifference = (today.getTime() - lastTreatmentDate.getTime()) / (1000 * 3600 * 24);

        
        //Pollen variables
        const pollenBottleNumber = lastTreatment.bottleNumbers.pollenBottleNumber;
        const pollenLLR = lastTreatment.LLR.pollenLLR;
        const pollenInj = lastTreatment.injVols.pollenInj;
        const pollenDil = lastTreatment.dilutions.pollenDil;
        const pollenMaintenanceBottle = patientToFind.maintenanceBottleNumber.pollenMaintenanceBottle;
        const pollenKey = 'pollen';

        //Insect and Pets variables
        const insectsAndPetsBottleNumber = lastTreatment.bottleNumbers.insectsAndPetsBottleNumber;
        const insectsAndPetsLLR = lastTreatment.LLR.insectsAndPetsLLR;
        const insectsAndPetsInj = lastTreatment.injVols.insectsAndPetsInj;
        const insectsAndPetsDil = lastTreatment.dilutions.insectsAndPetsDil;
        const insectsAndPetsMaintenanceBottle = patientToFind.maintenanceBottleNumber.insectsAndPetsMaintenanceBottle;
        const insectsAndPetsKey = 'insectsAndPet';

        //Mold variables
        const moldBottleNumber = lastTreatment.bottleNumbers.moldsBottleNumber;
        const moldLLR = lastTreatment.LLR.moldsLLR;
        const moldInj = lastTreatment.injVols.moldsInj;
        const moldDil = lastTreatment.dilutions.moldsDil;
        const moldMaintenanceBottle = patientToFind.maintenanceBottleNumber.moldsMaintenanceBottle;
        const moldKey = 'mold';


        // function InjVolumeCalc(lastTreatmentBN, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, ptMaintBottle)
        // function DilAdjustmentCalc(lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, vialTestKey)
        // function BottleNumberCalc(lastTreatmentBN, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, ptMaintBottle, vialTestKey)

        //New Injection values for next treatment
        let newPollenInj = InjVolumeCalc(pollenBottleNumber, pollenLLR, pollenInj, pollenDil, pollenMaintenanceBottle);
        let newInsectsAndPetsInj = InjVolumeCalc(insectsAndPetsBottleNumber, insectsAndPetsLLR, insectsAndPetsInj, insectsAndPetsDil, insectsAndPetsMaintenanceBottle);
        let newMoldInj = InjVolumeCalc(moldBottleNumber, moldLLR, moldInj, moldDil, moldMaintenanceBottle);


        //New Dilutions values for next treatment
        let newPollenDilAdjustment = DilAdjustmentCalc(pollenLLR, pollenInj, pollenDil, pollenKey);
        let newInsectsAndPetsDilAdjustment = DilAdjustmentCalc(insectsAndPetsLLR, insectsAndPetsInj, insectsAndPetsDil, insectsAndPetsKey);
        let newMoldDilAdjustment = DilAdjustmentCalc(moldLLR, moldInj, moldDil, moldKey);


        //New Bottle Numbers for next treatment if 999, then maintenance
        let newPollenBottleNumber = BottleNumberCalc(pollenBottleNumber, pollenLLR, pollenInj, pollenDil, pollenMaintenanceBottle, pollenKey);
        let newInsectsAndPetsBottleNumber = BottleNumberCalc(insectsAndPetsBottleNumber, insectsAndPetsLLR, insectsAndPetsInj, insectsAndPetsDil, insectsAndPetsMaintenanceBottle, insectsAndPetsKey);
        let newMoldBottleNumber = BottleNumberCalc(moldBottleNumber, moldLLR, moldInj, moldDil, moldMaintenanceBottle, moldKey);

        const data = new treatment({
            nameOfPractice: lastTreatment.nameOfPractice, 
            NPI: req.body.NPI, 
            patientLastName: lastTreatment.patientLastName, 
            patientFirstName: lastTreatment.patientFirstName, 
            patientID: lastTreatment.patientID, 
            injVols: {pollenInj: newPollenInj, insectsAndPetsInj: newInsectsAndPetsInj, moldsInj: newMoldInj},
            dilutions: {pollenDil: newPollenDilAdjustment, insectsAndPetsDil: newInsectsAndPetsDilAdjustment, moldsDil: newMoldDilAdjustment},
            bottleNumbers: {pollenBottleNumber: newPollenBottleNumber.toString(), insectsAndPetsBottleNumber: newInsectsAndPetsBottleNumber.toString(), moldsBottleNumber: newMoldBottleNumber.toString()}, 
            LLR: {pollenLLR: parseInt(pollenLLR), insectsAndPetsLLR: parseInt(insectsAndPetsLLR), moldsLLR: parseInt(moldLLR)},
            //TODO
            lastVialTests,
            nextVialTests,  
            date: today, 
            attended: false
        });

        //TODO
        //new bottles are tested using a vial test
        //check for maximum inj volume and tell practice to do vial test, sometimes they need max inj vol twice
        //practice can override vial test??
        //exception is being at maintenance, means no vial test
        //3 separate injections each appointment
        //allergy drops are added into 1 bottle




        /*
            Calculation for injection volume of next treatment.
        */
        function InjVolumeCalc(lastTreatmentBN, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, ptMaintBottle){

            let newTreatmentInjVol = 0;

            if(lastTreatmentBN == "M" && lastTreatmentLLR < findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment 
                && lastTreatment.vialTest.whealSize < findProtocol.vialTestReactionAdjustment.whealLimitToProceedWithInjection
                && dateDifference <= findProtocol.nextDoseAdjustment.injectionInterval)
            {
                newTreatmentInjVol = findProtocol.nextDoseAdjustment.maxInjectionVol;
                return newTreatmentInjVol;
            }
            /*
                Ask about this   //H16 does not refer to any value, need to ask him.

            */
            else if(lastTreatmentInj >= findProtocol.nextDoseAdjustment.maxInjectionVol && $H16 < findProtocol.missedDoseAdjustment1.doseAdjustMissedDays
                && lastTreatmentLLR < findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment)
            {
                    newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                    return newTreatmentInjVol;
            }
            else if(lastTreatmentLLR >= findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment){
                if((lastTreatmentInj - findProtocol.largeReactionsDoseAdjustment.adjustInjectionVol) < findProtocol.nextDoseAdjustment.startingInjectionVol){
                    newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                    return newTreatmentInjVol;
                }else{
                    newTreatmentInjVol = (lastTreatmentInj - findProtocol.largeReactionsDoseAdjustment.adjustInjectionVol);
                    return newTreatmentInjVol;
                }
            }
            else{
                if(dateDifference >= findProtocol.missedDoseAdjustment4.doseAdjustMissedDays){
                    if((lastTreatmentInj - findProtocol.missedDoseAdjustment4.adjustInjectionVolume) < findProtocol.nextDoseAdjustment.startingInjectionVol){
                        newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - findProtocol.missedDoseAdjustment4.adjustInjectionVolume);
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= findProtocol.missedDoseAdjustment3.doseAdjustMissedDays){
                    if((lastTreatmentInj - findProtocol.missedDoseAdjustment3.adjustInjectionVolume) < findProtocol.nextDoseAdjustment.startingInjectionVol){
                        newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - findProtocol.missedDoseAdjustment3.adjustInjectionVolume);
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= findProtocol.missedDoseAdjustment2.doseAdjustMissedDays){
                    if((lastTreatmentInj - findProtocol.missedDoseAdjustment2.adjustInjectionVolume) < findProtocol.nextDoseAdjustment.startingInjectionVol){
                        newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - findProtocol.missedDoseAdjustment2.adjustInjectionVolume);
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= findProtocol.missedDoseAdjustment1.doseAdjustMissedDays){
                    if((lastTreatmentInj - findProtocol.missedDoseAdjustment1.adjustInjectionVolume) < findProtocol.nextDoseAdjustment.startingInjectionVol){
                        newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - findProtocol.missedDoseAdjustment1.adjustInjectionVolume);
                        return newTreatmentInjVol;
                    }
                }
                else{
                    if((lastTreatmentInj + findProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval) > findProtocol.nextDoseAdjustment.maxInjectionVol){
                        if(lastTreatmentDil > 0){
                            newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                            return newTreatmentInjVol;
                        }
                        else{
                            if(lastTreatmentBN == "M"){
                                newTreatmentInjVol = findProtocol.nextDoseAdjustment.maxInjectionVol;
                                return newTreatmentInjVol;
                            }
                            else{
                                if(parseInt(lastTreatmentBN) == ptMaintBottle){
                                    newTreatmentInjVol = findProtocol.nextDoseAdjustment.maxInjectionVol;
                                    return newTreatmentInjVol;
                                }
                                else{
                                    newTreatmentInjVol = findProtocol.nextDoseAdjustment.startingInjectionVol;
                                    return newTreatmentInjVol;
                                }
                            }
                        }
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj + findProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval);
                        return newTreatmentInjVol;
                    }
                }
            }
        }


        /*
            Calculation of next dilution
        */
        function DilAdjustmentCalc(lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, vialTestKey){

            let newTreatmentDilVol = 0;

            if(lastTreatmentInj >= findProtocol.nextDoseAdjustment.maxInjectionVol){
                if(lastTreatment.lastVialTests.get(vialTestKey).values.whealSize >= findProtocol.vialTestReactionAdjustment.whealLimitToProceedWithInjection){
                    newTreatmentDilVol = (lastTreatmentDil + findProtocol.vialTestReactionAdjustment.adjustVialConcentration);
                    return newTreatmentDilVol;
                }
                else{
                    if(lastTreatmentDil == 0){
                        newTreatmentDilVol = 0;
                        return newTreatmentDilVol;
                    }
                    else{  
                        if((lastTreatmentDil - findProtocol.vialTestReactionAdjustment.adjustVialConcentration) <= 0){
                            newTreatmentDilVol = 0;
                            return newTreatmentDilVol;
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil - findProtocol.vialTestReactionAdjustment.adjustVialConcentration);
                            return newTreatmentDilVol;
                        }
                    }
                }
            }
            else{
    
                if(lastTreatmentLLR >= findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment){
                    if(lastTreatmentDil == 0){
                        newTreatmentDilVol = findProtocol.largeReactionsDoseAdjustment.adjustVialConcentration;
                        return newTreatmentDilVol;
                    }
                    else{
                        newTreatmentDilVol = (lastTreatmentDil + findProtocol.largeReactionsDoseAdjustment.adjustVialConcentration);
                        return newTreatmentDilVol;
                    }
                }
                else{
                    if(dateDifference >= findProtocol.missedDoseAdjustment4.doseAdjustMissedDays){
                        if(lastTreatmentDil == 0){
                            if(findProtocol.missedDoseAdjustment4.adjustVialConcentration <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = findProtocol.missedDoseAdjustment4.adjustVialConcentration;
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + findProtocol.missedDoseAdjustment4.adjustVialConcentration);
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= findProtocol.missedDoseAdjustment3.doseAdjustMissedDays){
                        if(lastTreatmentDil == 0){
                            if(findProtocol.missedDoseAdjustment3.adjustVialConcentration <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = findProtocol.missedDoseAdjustment3.adjustVialConcentration;
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + findProtocol.missedDoseAdjustment3.adjustVialConcentration);
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= findProtocol.missedDoseAdjustment2.doseAdjustMissedDays){
                        if(lastTreatmentDil == 0){
                            if(findProtocol.missedDoseAdjustment2.adjustVialConcentration <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = findProtocol.missedDoseAdjustment1.adjustVialConcentration;
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + findProtocol.missedDoseAdjustment2.adjustVialConcentration);
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= findProtocol.missedDoseAdjustment1.doseAdjustMissedDays){
                        if(lastTreatmentDil == 0){
                            if(findProtocol.missedDoseAdjustment1.adjustVialConcentration <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = findProtocol.missedDoseAdjustment1.adjustVialConcentration;
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + findProtocol.missedDoseAdjustment1.adjustVialConcentration);
                            return newTreatmentDilVol;
                        }
                    }
                    else{
                        newTreatmentDilVol = lastTreatmentDil;
                        return newTreatmentDilVol;
                    }
                }
            }
        }
            
            
        /*
            Calculation of next bottleNumber
        */
        function BottleNumberCalc(lastTreatmentBN, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, ptMaintBottle, vialTestKey){

            let newTreatmentBotNum = 0;

            if(lastTreatmentInj < findProtocol.nextDoseAdjustment.maxInjectionVol){

                if(lastTreatmentLLR >= findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment){
                    if(lastTreatmentBN == "M"){
                        if((ptMaintBottle - findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (ptMaintBottle - findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber);
                            return newTreatmentBotNum;
                        }
                    }
                    else{
                        if((parseInt(lastTreatmentBN) - findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (parseInt(lastTreatmentBN) - findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber);
                            return newTreatmentBotNum;
                        }
                    }
                }
                else{
    
                    if(dateDifference >= findProtocol.missedDoseAdjustment4.doseAdjustMissedDays){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - findProtocol.missedDoseAdjustment4.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - findProtocol.missedDoseAdjustment4.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment4.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment4.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= findProtocol.missedDoseAdjustment3.doseAdjustMissedDays){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - findProtocol.missedDoseAdjustment3.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - findProtocol.missedDoseAdjustment3.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment3.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment3.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= findProtocol.missedDoseAdjustment2.doseAdjustMissedDays){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - findProtocol.missedDoseAdjustment2.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - findProtocol.missedDoseAdjustment2.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment2.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment2.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= findProtocol.missedDoseAdjustment1.doseAdjustMissedDays){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - findProtocol.missedDoseAdjustment1.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - findProtocol.missedDoseAdjustment1.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment1.adjustBottleNumber) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - findProtocol.missedDoseAdjustment1.adjustBottleNumber);
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else{
                        newTreatmentBotNum = parseInt(lastTreatmentBN);
                        return newTreatmentBotNum;
                    }
                }
            }
            else{
    
                if(lastTreatment.lastVialTests.get(vialTestKey).values.whealSize >= findProtocol.vialTestReactionAdjustment.whealLimitToProceedWithInjection){
                    if(lastTreatmentBN == "M"){
                        if((ptMaintBottle - findProtocol.vialTestReactionAdjustment.adjustBottleNumber) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (ptMaintBottle - findProtocol.vialTestReactionAdjustment.adjustBottleNumber);
                            return newTreatmentBotNum;
                        }
                    }
                    else{
                        if((parseInt(lastTreatmentBN) - findProtocol.vialTestReactionAdjustment.adjustBottleNumber) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (parseInt(lastTreatmentBN)- findProtocol.vialTestReactionAdjustment.adjustBottleNumber);
                            return newTreatmentBotNum;
                        }
                    }
                }
                else{
                    if(lastTreatmentDil == 0){
                        if(lastTreatmentBN == "M"){
                            newTreatmentBotNum = 999;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = parseInt(lastTreatmentBN) + 1;
                            return newTreatmentBotNum;
                        }
                    }
                    else{
                        if(lastTreatmentBN == "M"){
                            newTreatmentBotNum = 999;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = parseInt(lastTreatmentBN)
                            return newTreatmentBotNum;
                        }
                    }
                }
            }
        }
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
}

