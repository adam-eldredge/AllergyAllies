const treatment = require('../Models/treatment');
const patient = require('../Models/patient');
const protocol = require('../Models/protocols');
const practice = require('../Models/practice');


exports.firstTreatment = async (req, res) => {
    try {
        
        const patientID = req.params.id
        const earliest = await treatment.find({patientID: patientID}).sort({date: 1}).limit(1)

        return res.status(200).json(earliest)
    }
    catch (err) {
        return res.status(400).json({message: err})
    }
}

// Post method
exports.addTreatment = async (req, res) => {
    try {

        //This method is called when a patient creates an account creating an empty treatment that needs to be updated
        const { patientLastName, patientFirstName, patientID, date, practiceID,
        } = req.body;

        const findProtocol = await protocol.findOne({ practiceID: practiceID });
        if (!findProtocol) {
            return res.status(404).json({ message: "Protocol not found" });
        }
        else{

            const findPractice = await practice.findById(practiceID);

            const data = new treatment({
                nameOfPractice: findPractice.practiceName,  
                patientLastName: patientLastName, 
                patientFirstName: patientFirstName, 
                patientID: patientID,
                date: date, 
                attended: false
            });
            await data.save();

            //Add patient treatment data to end of array
            const patientToFind = await patient.findById(patientID);
            patientToFind.treatments.push(data.id);
            await patientToFind.save();

            let treatmentLength = patientToFind.treatments.length;
            let newVialValues = {dilution: 0, bottleNumber: "0", whealSize: 0};
            
            /*
                Working, but there is a delay for when there is finding a protocol, 
                may need to load page when it's done getting info

            */
            let startingInjVol = JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol);
            let newMap = new Map();

            //Adds bottles to treatment with starting inj value and 0 for all other fields
            if(treatmentLength == 1){
                for(let i = 0; i < findProtocol.bottles.length; i++){
                    data.bottles.push({
                        nameOfBottle: findProtocol.bottles[i].bottleName,
                        injVol: parseFloat(startingInjVol),
                        injDilution: 0,
                        injLLR: 0,
                        currBottleNumber: "1",
                    });
                    newMap.set(findProtocol.bottles[i].bottleName, {name: findProtocol.bottles[i].bottleName, values: newVialValues});
                }
                data.lastVialTests = newMap;
                const dataToSave = await data.save();
                return res.status(200).json(dataToSave); 
            }
            else{

                return res.status(201).json({message: 'Patient\'s last treatment needs to be updated'});
                
            }
        }
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
            return res.sendStatus(200).json(data);
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
            res.status(404).json({ message: "Treatment not found" });
        }

        await treatment.findByIdAndDelete(id);
        res.status(200).json({ message: `Treatment has been deleted.` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


/*
    This update is for a single vial in the panel of bottles. For when there is an adverse reaction
*/
exports.updateTreatment = async (req, res) => {
    try {
        const { patientID, date, bottleName, injVol, injDilution, injLLR, currBottleNumber } = req.body;
        const treatmentToUpdate = await treatment.findOne(
            { patientID: patientID, date: date}
        );
        const treatmentIndex = treatmentToUpdate.bottles.findIndex(x => x.nameOfBottle === bottleName);
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

/*
    This update is after a successful treatment given a patientID and the date of the treatment

    TODO
*/

exports.updateSuccessfulTreatment = async (req, res) => {
    try {
        
        const { patientID, date, arrayOfBottles } = req.body;
        const treatmentToUpdate = await treatment.findOne(
            { patientID: patientID, date: date}
        );

        let treatmentIndex = 0;
        
        for( let i = 0; i < arrayOfBottles.length; i++){
            treatmentIndex = treatmentToUpdate.bottles.findIndex(x => x.nameOfBottle === arrayOfBottles[i].bottleName);
            treatmentToUpdate.bottles[treatmentIndex].injVol = arrayOfBottles[i].injVol;
            treatmentToUpdate.bottles[treatmentIndex].injLLR = arrayOfBottles[i].injLLR;
            treatmentToUpdate.bottles[treatmentIndex].injDilution = arrayOfBottles[i].injDilution;
            treatmentToUpdate.bottles[treatmentIndex].currBottleNumber = arrayOfBottles[i].currBottleNumber;
            treatmentToUpdate.bottles[treatmentIndex].date = new Date();
        }

        treatmentToUpdate.attended = true;
        // currentDoseAdvancement: Number,

        // needsRetest: Boolean,
        // injSumForBottleNumber: Number,
        // needsRefill: Boolean,
        // expirationDate: Date,
        await treatmentToUpdate.save();
        res.status(200).json({ message: 'Successful update'});
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//update treatment according to calculations, this is called right before a calculation and 
exports.nextTreatment = async(req, res) => {
    try{
        const { patientID, practiceID } = req.body;

        //Pass in patientID and practiceID
        const id = req.body.patientID.toString();
        const pracID = req.body.practiceID.toString();

        const patientToFind = await patient.findById(id);
        if (!patientToFind) {
            res.status(404).json({ message: "Patient not found" });
        }

        const findProtocol = await protocol.findOne({ practiceID: pracID });
        if (!findProtocol) {
            res.status(404).json({ message: "Protocol not found" });
        }


        //Find the last treatment of the patient 
        const treatmentLength = patientToFind.treatments.length();
        const patientLastTreatmentID = patientToFind.treatments[treatmentLength - 1];
        const lastTreatment = await treatment.findById(patientLastTreatmentID);

        if(lastTreatment.attended == false){
            return res.status(201).json({ message: "You cannot determine the next treatment without a previous successful injection. Please update last injection." });
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

            if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                if((lastTreatmentDil <= 0) && (lastTreatmentLLR < parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment)))){
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
                        if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
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

            if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
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

            if(lastTreatmentBN == "M" && lastTreatmentLLR < parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment)) 
                && lastTreatment.vialTest.whealSize < parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))
                && dateDifference <= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days)) /*findProtocol.nextDoseAdjustment.injectionInterval*/)
            {
                newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol));
                return newTreatmentInjVol;
            }
            else if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol)) 
                && dateDifference < parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))
                && lastTreatmentLLR < parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment)) 
                && lastTreatmentBN != "M" && parseInt(lastTreatmentBN) < ptMaintBottle)
            {
                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                    return newTreatmentInjVol;
            }
            else if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment))){
                if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.decreaseInjectionVol))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                    return newTreatmentInjVol;
                }else{
                    newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.decreaseInjectionVol)));
                    return newTreatmentInjVol;
                }
            }
            else{
                if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else{
                    if((lastTreatmentInj + parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval))) > parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                        if(lastTreatmentDil > 0){
                            newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                            return newTreatmentInjVol;
                        }
                        else{
                            if(lastTreatmentBN == "M"){
                                newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol));
                                return newTreatmentInjVol;
                            }
                            else{
                                if(parseInt(lastTreatmentBN) >= ptMaintBottle){ /* == to >= */
                                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol));
                                    return newTreatmentInjVol;
                                }
                                else{
                                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                                    return newTreatmentInjVol;
                                }
                            }
                        }
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj + parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval)));
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

            if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                if(lastTreatment.lastVialTests.get(vialTestKey).values.whealSize >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
                    newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustVialConcentration)));
                    return newTreatmentDilVol;
                }
                else{
                    if(lastTreatmentDil == 0){
                        newTreatmentDilVol = 0;
                        return newTreatmentDilVol;
                    }
                    else{  
                        if((lastTreatmentDil - parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustVialConcentration))) <= 0){
                            newTreatmentDilVol = 0;
                            return newTreatmentDilVol;
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil - parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                }
            }
            else{
    
                if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment))){
                    if(lastTreatmentDil == 0){
                        newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustVialConcentration));
                        return newTreatmentDilVol;
                    }
                    else{
                        newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustVialConcentration)));
                        return newTreatmentDilVol;
                    }
                }
                else{
                    if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseVialConcentration)));
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

            if(lastTreatmentInj < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){

                if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment))){
                    if(lastTreatmentBN == "M"){
                        if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber)));
                            return newTreatmentBotNum;
                        }
                    }
                    else{
                        if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber)));
                            return newTreatmentBotNum;
                        }
                    }
                }
                else{
    
                    if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber)));
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
    
                if(lastTreatment.lastVialTests.get(vialTestKey).values.whealSize >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
                    if(lastTreatmentBN == "M"){
                        if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber)));
                            return newTreatmentBotNum;
                        }
                    }
                    else{
                        if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (parseInt(lastTreatmentBN)- parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber)));
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
