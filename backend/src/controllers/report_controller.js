const patient = require('../Models/patient');
const provider = require('../Models/provider');
const protocol = require('../Models/protocols')
// const practice = require('../Models/practice');
const treatment = require('../Models/treatment');
const { Report } = require('../Models/report');
const { getAllPatientsHelper } = require('../controllers/patient_controller');


async function generateReport(NPI, reportType, data) {
    // Report name formatting
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
    const year = currentDate.getFullYear().toString().slice(-2); // Get the last 2 digits of the year.
    const formattedDate = `${day}_${month}_${year}`;
    const reportName = `${reportType}_${formattedDate}`;
    // Generate the report
    try {
        const report = new Report({
            NPI,
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

exports.getAllReportNames = async (req, res) => {
    const NPI = 123456;
    try {
        const reports = await Report.find({ NPI: NPI}).select('-data -createdAt -updatedAt -__v');
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

// Needs bottle fix in treatment.js
exports.generateApproachingMaintenanceReport = async (req, res) => {
    // "Maintenance achieved after tolerance of the of the highest volume of this bottle #"

    const NPI = req.params.NPI;
    reportType = "ApproachingMaintenance";
    const patientsList = await getAllPatientsHelper(NPI); 
    // get maintenance bottle # (from ?)

    const approachingMaintenancePatients = [];

    // iterate over each patient, checking current bottle number
    for ( const p of patientsList ) {
        const patientTreatment = treatment.findOne({
            _id: p._id, 
            NPI: p.NPI 
        });

        if (!patientTreatment) {
            continue;
        }
        // get practice bottle types
        const foundProtocol = protocol.findOne({ NPI: p.NPI});

        for (bottleType of foundProtocol.bottleTypes) {
            // check if patient treatment contains these bottle types
            if(patientTreatment.bottleTypes.includes(bottleType)) {
                // check if one of the patient bottle types is M
                approachingMaintenancePatients.push({
                    patientName: p.firstName + " " + p.lastName,

                    email: p.email,
                })
            }
        }
        // output along with patient name if one of them is M

    }

    // Generate the report
    try {
        const savedReport = await generateReport(NPI, reportType, approachingMaintenancePatients);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}


// NEEDS TEST
exports.generateAttritionReport = async (req, res) => {
    const NPI = 123456; 
    const reportType = "Attrition";
    const patientsList = await getAllPatientsHelper(NPI); 
    const patientAttrition = [];

    for (const p of patientsList) {
        if (p.status == "ATTRITION") {
            patientAttrition.push({
                patientName: p.firstName + " " + p.lastName,
                status: p.status,
                email: p.email,
                phone: p.phone
            })
        }
    }

    try {
        const savedReport = await generateReport(NPI, reportType, patientAttrition);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
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
    
    const NPI = req.params.NPI; 
    const reportType = "DropsRefills";
    const patientsList = await getAllPatientsHelper(NPI); 
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
        const savedReport = await generateReport(NPI, reportType, patientRefills);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
    
}

// NEEDS UPDATE
exports.generateAllergyShotsRefillsReport = async (req, res) => {
    const NPI = 123456; 
    const reportType = "ShotsRefills";
    const patientsList = await getAllPatientsHelper(NPI); 
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

        // adds to report only if at least one type needs refill. 
        /*
        if (patientData.antigens.length > 0) {
        }
        */
        patientRefills.push(patientData);
    }

    try {
        const savedReport = await generateReport(NPI, reportType, patientRefills);
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
    const NPI = 123456;
    const reportType = "EpipenRefill";

    const patientsList = await getAllPatientsHelper(NPI);
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
        const savedReport = await generateReport(NPI, reportType, epipenRefillsArray);
        return res.status(200).json(savedReport);
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

// remake - use this to check patient status and time at that status.
exports.generateNeedsRetestReport = async (req, res) => {
    const NPI = 123456;
    const reportType = "NeedsRetest";
    // get list of all patients (can probably skip this step due to below comment)
    const patientsList = await getAllPatientsHelper(NPI); 
    const needsRetestOutput = [];

    // simplify - make function to check if patient status is maintenance

    for (p of patientsList) {
        const patientData = {
            patientName: p.firstName,
            needsRetestData: [],
        };

        for (a of practiceArray) {
            // check patient is on maintenace bottle number
            const patientCurrentBottle = 3

            const atMaintenanceBottle = patientCurrentBottle === a.maintenanceBottleNumber;

            // date stuff
            const patientTreatmentStartDate = new Date('2023-10-20');
            const oneYearLater = new Date(patientTreatmentStartDate);
            oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
            const currentDate = new Date();

            //check if its been a year since on maintenance bottle number
            const needsRetest = currentDate >= oneYearLater;
            
            patientData.needsRetestData.push({
                antigen: a.antigen,
                needsRetest: needsRetest && atMaintenanceBottle,
            });
            
        }
        needsRetestOutput.push(patientData);
    }

    try {
        const savedReport = await generateReport(NPI, reportType, needsRetestOutput);
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