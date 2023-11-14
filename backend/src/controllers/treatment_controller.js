const treatment = require('../Models/treatment');
const patient = require('../Models/patient');
const protocol = require('../Models/protocols');

// Post method
exports.addTreatment = async (req, res) => {
    try {
        //This stuff will be manually input by the practice when a first treatment is entered
        const { nameOfPractice, NPI, patientLastName, patientFirstName, patientID, 
            date, attended, totalBottles: [{nameOfBottle, injVol, injDilution, injLLR, currBottleNumber}]
        } = req.body;

        const findProtocol = await protocol.findOne({ NPI: NPI });
        if (!findProtocol) {
            res.status(404).json({ message: "Protocol not found" });
        }

        const data = new treatment({
            nameOfPractice, NPI, patientLastName, patientFirstName, patientID,
            date, attended
        });

        //Add patient treatment data to end of array
        const patientToFind = await patient.findById({_id: req.body.patientID},
            { $push: {treatments: data.id}},
            function(error){
                if(error){
                    console.log(error);
                    res.status(404).json({ message: "Patient not found" });
                }
                else{
                    console.log(`Treatment added to ${patientLastName}, ${patientFirstName} for ${nameOfPractice}.`)
                }
        });

        let newVialValues = {dilution: 0, bottleNumber: "0", whealSize: 0};
        
        //Need to add bottles of protocol if patient has no treatments
        //Case of 1st Treatment ID added, will make values 0
        if(patientToFind.treatments.length() == 1){
            for(let i = 0; i < findProtocol.bottles.length(); i++){
                data.bottles.push({
                    nameOfBottle: findProtocol.bottles[i].bottleName,
                    injVol: 0,
                    injDilution: 0,
                    injLLR: 0,
                    currBottleNumber: "0",
                });
                data.lastVialTests.set(findProtocol.bottles[i].bottleName, {name: findProtocol.bottles[i].bottleName, values: newVialValues});
            }
            const dataToSave = await data.save();
            res.status(200).json(dataToSave); 
        }

        const treatmentLength = patientToFind.treatments.length();
        const patientLastTreatmentID = patientToFind.treatments[treatmentLength - 1];
        const lastTreatment = await treatment.findById(patientLastTreatmentID);

        //Move the lastTreatments vial Test to new one
        data.lastVialTests = lastTreatment.lastVialTests;

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
        const date = req.body.date;
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

/*
    TODO
    update treatments to work based of practiceID
*/


//update treatment according to calculations
exports.nextTreatment = async(req, res) => {
    try{
        //Pass in patientID and NPI
        const id = req.params.id;
        const npi = req.body.practiceID.toString();

        const patientToFind = await patient.findById(id);
        if (!patientToFind) {
            res.status(404).json({ message: "Patient not found" });
        }

        const findProtocol = await protocol.findOne({ practiceID: practiceID });
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

        const data = new treatment({
            nameOfPractice: lastTreatment.nameOfPractice, 
            NPI: lastTreatment.NPI, 
            patientLastName: lastTreatment.patientLastName, 
            patientFirstName: lastTreatment.patientFirstName, 
            patientID: lastTreatment.patientID, 
            date: today, 
            attended: false
        });

        //Determine how many antigens they are using
        const patientBottleCount = lastTreatment.bottles.length();

        for(let i = 0; i < patientBottleCount; i++){
            let antigenName = lastTreatment.bottles[i].nameOfBottle;
            let antigenInjVol = lastTreatment.bottles[i].injVol;
            let antigenDil = lastTreatment.bottles[i].injDilution;
            let antigenLLR = lastTreatment.bottles[i].injLLR;
            let antigenCurrBottleNumber = lastTreatment.bottles[i].currBottleNumber;
            let antigenMaintenanceBN = patientToFind.maintenanceBottleNumber[i].maintenanceNumber;

            let newInjVol = InjVolumeCalc(antigenCurrBottleNumber, antigenLLR, antigenInjVol, antigenDil, antigenMaintenanceBN);
            let newDilAdjustment = DilAdjustmentCalc(antigenLLR, antigenInjVol, antigenDil, antigenName);

            //New Bottle Numbers for next treatment is 999, then maintenance
            let newBottleNumber = BottleNumberCalc(antigenCurrBottleNumber, antigenLLR, antigenInjVol, antigenDil, antigenMaintenanceBN, antigenName);

            let lastVialTest = lastTreatment.lastVialTests.get(antigenName).values;

            if(lastTreatment.lastVialTests.size < patientBottleCount){
                data.lastVialTests.set(antigenName, {values: lastVialTest});
            }

            let newVialValues = {dilution: 0, bottleNumber: "0", whealSize: 0};
            NextVialTestDilution(newVialValues, antigenLLR, antigenInjVol, antigenDil);
            NextVialTestBottleNumber(newVialValues, antigenLLR, antigenInjVol, antigenDil, antigenCurrBottleNumber, antigenMaintenanceBN);

            data.bottles.push({
                nameOfBottle: antigenName,
                injVol: newInjVol,
                injDilution: newDilAdjustment,
                currBottleNumber: (newBottleNumber).toString(),
            });

            data.nextVialTests.set(antigenName, newVialValues);
        }

        const dataToSave = await data.save();
        res.status(200).json(dataToSave);


        /*
            Calculation for next Vial Test dilution
        */
        function NextVialTestDilution(values, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil){

            if(lastTreatmentInj >= findProtocol.nextDoseAdjustment.maxInjectionVol){
                if((lastTreatmentDil <= 0) && (lastTreatmentLLR < findProtocol.vialTestReactionAdjustment.whealLimitToProceedWithInjection)){
                    values.dilution = 0;
                    return;
                }
                else{
                    if(lastTreatmentDil > 0){
                        if((lastTreatmentDil - 1) <= 0){
                            return;
                        }
                        else{
                            values.dilution = (lastTreatmentDil - 1);
                            return;
                        }
                    }
                    else{
                        if(lastTreatmentLLR >= findProtocol.vialTestReactionAdjustment.whealLimitToProceedWithInjection){
                            values.dilution = (lastTreatmentDil + 1);
                            return;
                        }
                        else{
                            return;
                        }
                    }
                }
            }
            else{
                return;
            }
        }

        /*
            Calculation for next Vial Test Bottle Number
        */
        function NextVialTestBottleNumber(values, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, lastTreatmentBN, ptMaintBottle){

            if(lastTreatmentInj >= findProtocol.nextDoseAdjustment.maxInjectionVol){
                if(lastTreatmentLLR >= findProtocol.vialTestReactionAdjustment.whealLimitToProceedWithInjection){
                    values.bottleNumber = lastTreatmentBN;
                    return;
                }
                else{
                    if(lastTreatmentBN == "M"){
                        values.bottleNumber = "M";
                        return;
                    }
                    else{
                        if((parseInt(lastTreatmentBN) + 1) >= ptMaintBottle){
                            values.bottleNumber = "M";
                            return;
                        }
                        else{
                            if(lastTreatmentDil > 0){
                                values.bottleNumber = lastTreatmentBN;
                                return;
                            }
                            else{
                                values.bottleNumber = (parseInt(lastTreatmentBN) + 1).toString();
                                return;
                            }
                        }
                    }
                }
            }
            else{
                values.bottleNumber = "0";
                return;
            }
        }


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
            else if(lastTreatmentInj >= findProtocol.nextDoseAdjustment.maxInjectionVol && dateDifference < findProtocol.missedDoseAdjustment1.doseAdjustMissedDays
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

