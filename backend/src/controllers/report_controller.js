const patient = require('../Models/patient');
const protocol = require('../Models/protocols')
const treatment = require('../Models/treatment');
const { Report } = require('../Models/report');
const provider = require('../Models/provider');
const practice = require('../Models/practice');

const { getAllPatientsHelper } = require('../controllers/patient_controller');
const { generateReport, findMatchingBottle } = require('../helpers/reportHelper');


exports.deleteReport = async (req, res) => {
    const reportID = req.params.id;
    const foundReport = await Report.findById(reportID);
    if(!foundReport) {
        return res.status(400).json({message: "Report not found"});
    }

    try{
        await patient.findByIdAndDelete(id);
    } catch (error) { 
        return res.status(404).json({ message: error.message })
    };

    return res.status(200).json({message: "Report deleted"})
}

exports.getAllReportNames = async (req, res) => {
    const providerID = req.params.providerID; 
    try {
        const reports = await Report.find({ providerID: providerID}).select('-providerID -data -createdAt -updatedAt -__v');
        return res.status(200).json({ reports });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.getReportData = async (req, res) => {
    const reportID = req.params.id;

    try {
        const foundReport = await Report.findById(reportID);
        if (foundReport) {
            return res.status(200).json({ data: foundReport.data });
        } else {
            return res.status(400).json({ message: "Report not found" });
        }
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

/*============== Generate Report Functions ====================*/

exports.generateApproachingMaintenanceReport = async (req, res) => {
    const providerID = req.params.providerID;
    const reportType = "ApproachingMaintenance";

    const patientsList = await getAllPatientsHelper(providerID);

    const approachingMaintenanceData = [];

    // Iterate over each patient, checking their bottles
    for (const p of patientsList) {
        if(p.status === "MAINTENANCE") {
            continue;
        }

        // find treatment data
        const patientTreatment = await treatment.findOne({
            patientID: p._id.toString(),
        });

        if (!patientTreatment) {
            continue;
        }

        const vialInfo = [];
        let treatmentStartDate = new Date();
        let allBottlesAtMaintenance = true;
        let atleastOneMaintenanceBottle = false;
        
        // iterate over patient treatment vials
        for (const bottle of patientTreatment.bottles) {
            // match bottle in patient model to bottle in treatment (b)
            const matchingBottle = await findMatchingBottle(p, bottle);

            let patientCurrentBottleNumber = bottle.currBottleNumber;

            // check if bottle meets approaching maint. def.
            if (patientCurrentBottleNumber === 'M') {
                atleastOneMaintenanceBottle = true;
                patientCurrentBottleNumber = matchingBottle.maintenanceNumber;

            } else {
                allBottlesAtMaintenance = false;
            } 

            // eg: Pollen 3/7, Mold 7/7 (M)
            vialInfo.push(`${bottle.nameOfBottle} ${patientCurrentBottleNumber}/${matchingBottle.maintenanceNumber}`);

            // get earliest treatment date
            if(treatmentStartDate > bottle.date) {
                treatmentStartDate = bottle.date;
            }
        }

        if (vialInfo.length > 0 && !allBottlesAtMaintenance && atleastOneMaintenanceBottle) {
            approachingMaintenanceData.push({
                patientName: p.firstName + " " + p.lastName,
                maintenanceBottles: vialInfo,
                startDate: treatmentStartDate,
                DOB: p.DoB,
                phoneNumber: p.phone,
                email: p.email,
            });
        }
    }

    // Generate the report
    try {
        const manual = true;
        const savedReport = await generateReport(providerID, reportType, manual, approachingMaintenanceData);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.generateAttritionReport = async (req, res) => {
    try {
        const providerID = req.params.providerID;  
        const reportType = "Attrition";
        const patientAttrition = [];
        const today = new Date();

        const patientsList = await getAllPatientsHelper(providerID); 
        //const foundProvider = await provider.findById(providerID);

        for (const p of patientsList) {
            
            if (p.status !== "ATTRITION") {
                continue;
            }

            const patientBottles = [];
            const foundTreatment = await treatment.findOne({
                providerID: p.providerID.toString(),
                patientID: p._id.toString()
            });

            if (!foundTreatment) {
                continue;
            }

            for(const b of foundTreatment.bottles) {
                // find protocol to find out max bottle number
                const matchingBottle = findMatchingBottle(p.maintenanceBottleNumber, bottle.nameOfBottle);
    
                let treatmentCurrentBottleNumber = b.currBottleNumber;
                
                if(treatmentCurrentBottleNumber === 'M') {
                    treatmentCurrentBottleNumber = matchingBottle.maintenanceNumber;
                } 
                
                // eg: Pollen 3/7, Mold 7/7 (M)
                patientBottles.push(`${b.nameOfBottle} ${treatmentCurrentBottleNumber}/${matchingBottle.maintenanceNumber}`);
            }

            const timeDiff= today - p.statusDate;
            const daysSinceLastInjection = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            patientAttrition.push({
                patientName: p.firstName + " " + p.lastName,
                bottlesInfo: patientBottles,
                daysSinceLastInjection: daysSinceLastInjection,
                statusDate: p.statusDate,
                DOB: p.DoB,
                phone: p.phone,
                email: p.email,
            });
        }

        const manual = true;
        const savedReport = await generateReport(providerID, reportType, manual, patientAttrition);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message:`Error in attrition ${error.message}` }); 
    }
}

// composite collection of all refill data for each patient
exports.generateRefillsReport = async (req, res) => {
    const providerID = req.params.providerID;
    const reportType = "Refills";
    const patientRefillsData = [];

    const patientsList = await getAllPatientsHelper(providerID);
    const foundProvider = await provider.findById(providerID);

    for (const p of patientsList) {
        const patientTreatment = await treatment.findOne({
            providerID: p.providerID.toString(),
            patientID: p._id.toString(),
        });

        const foundProtocol = await protocol.findOne({ practiceID: foundProvider.practiceID });

        if (!foundProtocol || !patientTreatment) {
            continue;
        }

        // also need to check for expiration. Can have provider insert expiration date each time,
        // or just include as survey question (After how many days do your vials expire?)

        const bottleRefillsData = [];
        const bottleExpirationData = [];
        for (const b of patientTreatment.bottles) {
            const currentDate = new Date();
            // check if bottle will expire within two weeks
            const expireSoonDate = b.expirationDate;
            expireSoonDate.setDate(expireSoonDate.getDate() - 7);

            const expiresSoon = currentDate >= expireSoonDate;

            if(expiresSoon) {
                bottleExpirationData.push({
                    bottleName: b.nameOfBottle,
                    expirationDate: b.expirationDate,
                });
            }
            else if (b.needsRefill) {
                const matchingBottle = foundProtocol.bottles.find(
                    (protocolBottle) => protocolBottle.bottleName === b.nameOfBottle
                );

                bottleRefillsData.push({
                    bottleName: b.nameOfBottle,
                    volumeLeft: matchingBottle.bottleSize - b.injSumForBottleNumber,
                });
            }
        }

        patientRefillsData.push({
            patientName: p.firstName + " " + p.lastName,
            refillData: bottleRefillsData,
            expirationData: bottleExpirationData,
            DOB: p.DoB,
            phone: p.phone,
            email: p.email,
        });
    }

    try {
        const savedReport = await generateReport(providerID, reportType, true, patientRefillsData);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

// needs testing
exports.generateNeedsRetestReport = async (req, res) => {
    const providerID = req.params.providerID; 
    const reportType = "NeedsRetest";
    // get list of all patients (can probably skip this step due to below comment)
    const patientsList = await getAllPatientsHelper(providerID); 
    const needsRetestOutput = [];

    // simplify - make function to check if patient status is maintenance
    for (p of patientsList) {
        if(p.status !== "MAINTENANCE") {
            continue;
        }

        // get newest treatment data
        const patientTreatment = await treatment.findOne({
            patientID: p._id.toString(),
        }).sort({ date: -1});

        if (!patientTreatment) {
            continue;
        }

        let dateLastTested;

        if (!patientTreatment.lastVialTests) {
            dateLastTested = "N/A";
        } else {
            dateLastTested = patientTreatment.lastVialTests.date;
        }

        if (patientBottles.length > 0) {
            needsRetestOutput.push({
                patientName: p.firstName + " " + p.lastName,
                treatmentStartDate: p.treatmentStartDate,
                maintenanceDate: p.statusDate,
                dateLastTested,
                DOB: p.DoB,
                phoneNumber: p.phone,
                email: p.email,
            })
        }
    }

    try {
        const manual = true;
        const savedReport = await generateReport(providerID, reportType, manual, needsRetestOutput);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

// snoozes a patient showing up on needs retest report
// needs test
exports.needsRetestSnooze = async (req, res) => {
    const providerID = req.params.providerID;
    const patientFirstName = req.body.firstName;
    const patientLastName = req.body.lastName;
    const patientEmail = req.body.email;
    const snoozeDuration = req.body.snoozeDuration;

    try {
        const foundPatient = await patient.findOne({ firstName: patientFirstName, lastName: patientLastName, email: patientEmail});

        if (!foundPatient) {
            return res.status(400).json({ message: "patient not found"});
        }

        const foundTreatment = await treatment.findOne({ providerID: providerID, patientID: foundPatient._id});

        for (const b of foundTreatment.bottles) {
            if (b.needsRetest) {
                b.needsRetestSnooze.active = true;
                b.needsRetestSnooze.dateOfSnooze = new Date();
                b.snoozeDuration = snoozeDuration;
                await b.save();
            }
        }
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// needs test
exports.patientRetested = async (req, res) => {
    const providerID = req.params.providerID;
    const patientFirstName = req.body.firstName;
    const patientLastName = req.body.lastName;
    const patientEmail = req.body.email;

    try {
        const foundPatient = await patient.findOne({ firstName: patientFirstName, lastName: patientLastName, email: patientEmail});

        if (!foundPatient) {
            return res.status(400).json({ message: "patient not found"});
        }

        const foundTreatment = await treatment.findOne({ providerID: providerID, patientID: foundPatient._id});

        for (const b of foundTreatment.bottles) {
            if (b.needsRetest) {
                b.needsRetest = false;
                await b.save();
            }
        }

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}





/* Get records and compile functions */

// need function for case where provider wants to see all logs of a specific
// patient for a specific report type. 
// ie: Want all records of AllergyDropsRefillsReport associated with patient John
// williams mentioned this in a prior meeting ^
// note: These might be able to be worked in to the above ^