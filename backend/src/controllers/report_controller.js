const patient = require('../Models/patient');
//const provider = require('../Models/provider');
const protocol = require('../Models/protocols')
// const practice = require('../Models/practice');
const treatment = require('../Models/treatment');
const { Report } = require('../Models/report');
const { getAllPatientsHelper } = require('../controllers/patient_controller');
const provider = require('../Models/provider');

async function generateReport(providerID, reportType, data) {
    // Report name formatting
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    const day = currentDate.getDate().toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString().slice(-2); 
    const formattedDate = `${month}_${day}_${year}`;
    const reportName = `${reportType}_${formattedDate}`;
    // Generate the report
    try {
        const report = new Report({
            providerID,
            reportType,
            reportName,
            data: data,
        });

        const savedReport = await report.save();
        return savedReport;
    } catch (error) {
       throw new Error(error.message); 
    }
}

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
        const reports = await Report.find({ providerID: providerID}).select('-data -createdAt -updatedAt -__v');
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

exports.generateApproachingMaintenanceReport = async (req, res) => {
    const providerID = req.params.providerID;
    reportType = "ApproachingMaintenance";

    const patientsList = await getAllPatientsHelper(providerID);

    const approachingMaintenanceData = [];

    // Iterate over each patient, checking their bottles
    for (const p of patientsList) {
        const patientTreatment = await treatment.findOne({
            patientID: p._id.toString(),
        });

        if (!patientTreatment) {
            continue;
        }

        const foundProtocol = await protocol.findOne({ providerID: p.providerID });

        if (!foundProtocol) {
            continue;
        }

        const maxInjectVol = foundProtocol.nextDoseAdjustment.maxInjectionVol;
        const maintenanceBottles = [];
        let treatmentStartDate;

        for (const b of patientTreatment.bottles) {
            if (b.currBottleNumber === 'M') {
                maintenanceBottles.push(b.nameOfBottle);
                treatmentStartDate = b.date;
            }
        }

        if (maintenanceBottles.length > 0) {
            approachingMaintenanceData.push({
                patientName: p.firstName + " " + p.lastName,
                maintenanceBottles: maintenanceBottles,
                startDate: treatmentStartDate,
                phoneNumber: p.phone,
                email: p.email,
            });
        }
    }

    // Generate the report
    try {
        const savedReport = await generateReport(providerID, reportType, approachingMaintenanceData);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.generateAttritionReport = async (req, res) => {
    try {
        const providerID = req.params.providerID;  
        const reportType = "Attrition";
        const patientsList = await getAllPatientsHelper(providerID); 
        const patientAttrition = [];

        for (const p of patientsList) {
            if (p.status == "ATTRITION") {
                patientAttrition.push({
                    patientName: p.firstName + " " + p.lastName,
                    //status: p.status,
                    statusDate: p.statusDate,
                    email: p.email,
                    phone: p.phone
                })
            }
        }

        const savedReport = await generateReport(providerID, reportType, patientAttrition);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message:`Error in attrition error.message` }); 
    }
}

// composite collection of all refill data for each patient
exports.generateGeneralRefillsReport = async (req, res) => {
    // can be done by using other refill functions to return arrays
    // w/ specific data, then attaching to name
}

exports.generateAllergyDropsRefillsReport = async (req, res) => {
    // find out bottle volume
    // find out volume of each injection currently
    // needs refill if patient will run out soon 
    
    const providerID = req.params.providerID; 
    const reportType = "DropsRefills";
    const patientsList = await getAllPatientsHelper(providerID); 
    const patientRefills = [];

    // get rate of expiration/injection based on treatment dosage
    for (const p of patientsList) {
        // using time would probably be better here
        // calculate by what day the bottle should be close to empty, based on vol and dosageRate
        const dropsBottleVolume = 40, dose = 1, frequency = 7, doseInMl = 0.05; 
        const dateStartedTreatment = new Date('2023-10-20');

        const daysUntilRefill = dropsBottleVolume / (dose * doseInMl * frequency);

        const refillNeededDate = new Date(dateStartedTreatment.getDate() + daysUntilRefill);
        const currentDate = new Date();

        if (currentDate >= refillNeededDate) {
            const patientData = {
                patientName: p.firstName,
                needsRefill: true,
            };

            patientRefills.push(patientData);
        }
    }

    try {
        const savedReport = await generateReport(providerID, reportType, patientRefills);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
    
}

exports.generateAllergyShotsRefillsReport = async (req, res) => {
    const providerID = req.params.providerID;  
    const reportType = "ShotsRefills";
    const patientsList = await getAllPatientsHelper(providerID); 
    const patientRefills = [];

    const practiceAntigens = "Pollen, Insects, Mold"; // <- input received
    const Antigens = practiceAntigens.split(',').map(antigen => antigen.trim());
    const numbAntigens = Antigens.length

    const practiceArray = [];
    for (let i = 0; i < numbAntigens; i++) {
        practiceArray.push( { antigen: Antigens[i], bottleVol: 50});
    }

    // get rate of expiration/injection based on treatment dosage
    for (const p of patientsList) {
        const patientData = {
            patientName: p.firstName,
            refillData: [],
        };

        // calculates refill needed based on summing past dosage amounts and subtracting from volume
        for (const a of practiceArray) {
            const shotsTaken = 4;
            const dosageAmounts = [0.1, 0.2, 0.3, 0.4]; // scan from treatment
            const totalVolumeSpent = dosageAmounts.reduce((acc, amount) => acc + amount, 0);

            const needsRefill = a.bottleVol - totalVolumeSpent < 3;

            patientData.refillData.push({
                antigen: a.antigen,
                needsRefill: needsRefill,
            });
        }

        patientRefills.push(patientData);
    }

    try {
        const savedReport = await generateReport(providerID, reportType, patientRefills);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

// need method of having patient notify if they used it (checking expiration pointless then)
exports.generateEpipenRefillsReport = async (req, res) => {
    /*
    Epi-pen Refill reminder
    Date of expiration needs to be input
    Reminder pops up 10 days prior to expiration date
    Snooze vs Dismiss reminder function 
    */
    const providerID = req.params.providerID; 
    const reportType = "EpipenRefill";

    const patientsList = await getAllPatientsHelper(providerID);
    const expirationDate = new Date();
    const currentDate = new Date();

    const epipenRefillsArray = []

    for (p of patientsList) {
        if (currentDate >= expirationDate) {
            epipenRefillsArray.push({
                patientName: p.firstName + " " + p.lastName,
                needsEpipenRefill: true
            });
        }
    }

    try {
        const savedReport = await generateReport(providerID, reportType, epipenRefillsArray);
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
        const patientTreatment = await treatment.findOne({
            patientID: p._id.toString(),
        });

        if (!patientTreatment) {
            continue;
        }

        const patientBottles = [];

        for (const b of patientTreatment.bottles) {
            
            if (b.needsRetest) {
                patientBottles.push({
                    bottleName: b.nameOfBottle,
                    maintenanceDate: b.date
                })
            }
        }

        if (patientBottles.length > 0) {
            needsRetestOutput.push({
                patientName: p.firstName + " " + p.lastName,
                bottles: patientBottles,
                phoneNumber: p.phone,
                email: p.email,
            })
        }
    }

    try {
        const savedReport = await generateReport(providerID, reportType, needsRetestOutput);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

/* Get records and compile functions */

// need function for case where provider wants to see all logs of a specific
// patient for a specific report type. 
// ie: Want all records of AllergyDropsRefillsReport associated with patient John
// williams mentioned this in a prior meeting ^
// note: These might be able to be worked in to the above ^

/*
exports.generatePatientApproachingMaintenanceReport = async (req, res) => {
    // just search database for reports including "John Smith"
    // compile into report
}

exports.generatePatientAttritionReport = async (req, res) => {

}

exports.generatePatientGeneralRefillsReport = async (req, res) => {

}

exports.generatePatientAllergyDropsRefillsReport = async (req, res) => {
    
}

exports.generatePatientAllergyShotsRefillsReport = async (req, res) => {
    
}

exports.generatePatientEpipenRefillsReport = async (req, res) => {
    
}

exports.generatePatientNeedsRetestReport = async (req, res) => {
    
}

exports.generatePatientTokensReport = async (req, res) => {

}
*/