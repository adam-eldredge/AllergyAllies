const treatment = require('../Models/treatment');
const patient = require('../Models/patient');
const protocol = require('../Models/protocols');
const practice = require('../Models/practice');
const treatment = require('../Models/treatment');

// Post method
exports.addTreatment = async (req, res) => {
    try {
        //This stuff will be manually input by the practice when a first treatment is entered
        /*
            Needs to look like this 
            [{
                nameOfBottle: String,
                injVol: Number,
                injDilution: Number,
                injLLR: Number,
                currBottleNumber: String,
                date: Date,
                needsRetest: Boolean,
                currentDoseAdvancement: Number
            }],
        */
        const { patientLastName, patientFirstName, patientID, date, practiceID, //Need to find out how this information is sent to here
        } = req.body;

        const findProtocol = await protocol.findOne({ practiceID: practiceID });
        if (!findProtocol) {
            res.status(401).json({ message: "Protocol not found" });
        }

        const findPractice = await practice.findById(practiceID);

        const data = new treatment({
            nameOfPractice: findPractice.practiceName,  
            patientLastName: patientLastName, 
            patientFirstName: patientFirstName, 
            patientID: patientID,
            date: date, 
            attended: true
        });

        //Add patient treatment data to end of array
        const patientToFind = await patient.findById({_id: patientID},
            { $push: {treatments: data.id}},
            function(error){
                if(error){
                    console.log(error);
                    res.status(402).json({ message: "Patient not found" });
                }
                else{
                    console.log(`Treatment added to ${patientLastName}, ${patientFirstName} for ${nameOfPractice}.`)
                }
        });

        await patientToFind.save();
        const treatmentLength = patientToFind.treatments.length();
        let newVialValues = {dilution: 0, bottleNumber: "0", whealSize: 0};
        
        //Adds bottles to treatment with starting inj value and 0 for all other fields
        /*
            TODO need to fix for when we recieve data
        */
        if(treatmentLength == 1){
            for(let i = 0; i < findProtocol.bottles.length(); i++){
                data.bottles.push({
                    nameOfBottle: findProtocol.bottles[i].bottleName,
                    injVol: findProtocol.nextDoseAdjustment.startingInjectionVol,
                    injDilution: 0,
                    injLLR: 0,
                    currBottleNumber: "0",
                });
                data.lastVialTests.set(findProtocol.bottles[i].bottleName, {name: findProtocol.bottles[i].bottleName, values: newVialValues});
            }
            const dataToSave = await data.save();
            res.status(200).json(dataToSave); 
        }
        else{
            /*
                TODO
            */
            //Need to fill this area in
            
        }


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


// Get ALL treatments across patients
exports.getAllTreatments = async (req, res) => {
    try {
        const data = await treatment.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get treatment by patient first/last/DoB and treatment date
exports.getTreatment = async (req, res) => {
    try {
        const { patientLastName, patientFirstName, DoB, date } = req.body;

        const data = await treatment.findOne({ patientLastName: patientLastName, patientFirstName: patientFirstName, 
            DoB: DoB, date: date 
        });
        if (data === null) {
            return res.sendStatus(404).json({ message: `${error}`});
        }
        else {
            return res.sendStatus(200).json({data});
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete by patient first/last/DoB and treatment date
exports.deleteTreatment = async (req, res) => {
    try {
        const { patientLastName, patientFirstName, DoB, date } = req.body;

        const treatmentToDelete = await treatment.findOne({ patientLastName: patientLastName, patientFirstName: patientFirstName, 
            DoB: DoB, date: date 
        });
        if (!treatmentToDelete) {
            res.status(403).json({ message: "Treatment not found" });
        }

        await treatment.findByIdAndDelete(id);
        res.status(200).json({ message: `Treatment has been deleted.` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


/*
    For this update to work the we need to index of the treatment
*/
exports.updateTreatment = async (req, res) => {
    try {
        const { patientID, date, bottleName, injVol, injDilution, injLLR, currBottleNumber } = req.body;
        //const treatmentToUpdate = await treatment.findOneAndUpdate({patientID: patientID}, {...req.body} );
        const treatmentToUpdate = await treatment.findOne(
            { patientID: patientID, date: date}
        );
        const treatmentIndex = treatmentToUpdate.bottles.findIndex(bottleName == bottleName);
        treatmentToUpdate.bottles[treatmentIndex].injVol = injVol;
        treatmentToUpdate.bottles[treatmentIndex].injLLR = injLLR;
        treatmentToUpdate.bottles[treatmentIndex].injDilution = injDilution;
        treatmentToUpdate.bottles[treatmentIndex].currBottleNumber = currBottleNumber;
        await treatmentToUpdate.save();
        res.status(200).json({ message: 'Successful update'});
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//update treatment according to calculations
exports.nextTreatment = async(req, res) => {
    try{
        const { patientID, practiceID } = req.body;

        //Pass in patientID and practiceID
        const id = req.body.patientID.toString();
        const pracID = req.body.practiceID.toString();

        const patientToFind = await patient.findById(id);
        if (!patientToFind) {
            res.status(405).json({ message: "Patient not found" });
        }

        const findProtocol = await protocol.findOne({ practiceID: pracID });
        if (!findProtocol) {
            res.status(406).json({ message: "Protocol not found" });
        }

        //Find the last treatment of the patient 
        const treatmentLength = patientToFind.treatments.length();
        const patientLastTreatmentID = patientToFind.treatments[treatmentLength - 1];
        const lastTreatment = await treatment.findById(patientLastTreatmentID);

        if(lastTreatment.attended == false){
            res.status(201).json({ message: "You cannot determine the next treatment without a previous successful injection." });
        }

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
                && dateDifference <= findProtocol.missedDoseAdjustment1.doseAdjustMissedDays /*findProtocol.nextDoseAdjustment.injectionInterval*/)
            {
                newTreatmentInjVol = findProtocol.nextDoseAdjustment.maxInjectionVol;
                return newTreatmentInjVol;
            }
            else if(lastTreatmentInj >= findProtocol.nextDoseAdjustment.maxInjectionVol && dateDifference < findProtocol.missedDoseAdjustment1.doseAdjustMissedDays
                && lastTreatmentLLR < findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment && lastTreatmentBN != "M" && parseInt(lastTreatmentBN) < ptMaintBottle)
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
                                if(parseInt(lastTreatmentBN) >= ptMaintBottle){ /* == to >= */
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
                            if((parseInt(lastTreatmentBN) + 1) > ptMaintBottle){
                                newTreatmentBotNum = 999;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = parseInt(lastTreatment) + 1;
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
        }
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
}

