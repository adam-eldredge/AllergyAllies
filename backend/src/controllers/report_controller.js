const patient = require('../Models/patient');
//const provider = require('../Models/provider');
const protocol = require('../Models/protocols')
// const practice = require('../Models/practice');
const treatment = require('../Models/treatment');
const { Report } = require('../Models/report');
const { getAllPatientsHelper } = require('../controllers/patient_controller');
const provider = require('../Models/provider');

async function generateReport(providerID, reportType, manual, data) {
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
            formattedDate,
            manual,
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

        //const maxInjectVol = foundProtocol.nextDoseAdjustment.maxInjectionVol;
        const maintenanceBottles = [];
        let treatmentStartDate = new Date();
        let allBottlesAtMaintenance = true;

        //  include the number of days since last injection,  last bottle # 
        // and Maintenance Bottle # for each vial.  That can be shown as Pollens 3/6, Insects 3/5, Molds 2/6.
        // you can report the same way. In hindsight, maybe we should consider them 
        // approaching Maintenance when ANY of the vials start Maintenance Bottle # minus one.

        for (const b of patientTreatment.bottles) {
            const matchingBottle = foundProtocol.bottles.find(
                (protocolBottle) => protocolBottle.bottleName === b.nameOfBottle
            );

            let patientCurrentBottleNumber = b.currBottleNumber;

            // check if bottle meets approaching maint. def.
            if (patientCurrentBottleNumber !== matchingBottle.numbBottles - 1 || patientCurrentBottleNumber !== 'M') {
                allBottlesAtMaintenance = false;
                // rename to avoid "M/7" in report
                if(patientCurrentBottleNumber === 'M') {
                    patientCurrentBottleNumber = matchingBottle.numbBottles;
                } 
            }

            // eg: Pollen 3/7, Mold 7/7 (M)
            maintenanceBottles.push(`${b.nameOfBottle} ${patientCurrentBottleNumber}/${matchingBottle.numbBottles}`);

            // get earliest treatment date
            if(treatmentStartDate > b.date) {
                treatmentStartDate = b.date;
            }
        }

        if (maintenanceBottles.length > 0 && !allBottlesAtMaintenance) {
            approachingMaintenanceData.push({
                patientName: p.firstName + " " + p.lastName,
                maintenanceBottles: maintenanceBottles,
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
        const patientsList = await getAllPatientsHelper(providerID); 
        const patientAttrition = [];
        const today = new Date();

        for (const p of patientsList) {
            
            if (p.status !== "ATTRITION") {
                continue;
            }

            const patientBottles = [];
            const foundTreatment = await treatment.findOne({
                providerID: p.providerID.toString(),
                patientID: p._id.toString()
            });

            const foundProtocol = await protocol.findOne({ providerID: p.providerID });

            if (!foundTreatment || !foundProtocol) {
                continue;
            }

            for(const b of foundTreatment.bottles) {
                // find protocol to find out max bottle number
                const matchingBottle = foundProtocol.bottles.find(
                    (protocolBottle) => protocolBottle.bottleName === b.nameOfBottle
                );
    
                let patientCurrentBottleNumber = b.currBottleNumber;
                
                if(patientCurrentBottleNumber === 'M') {
                    patientCurrentBottleNumber = matchingBottle.numbBottles;
                } 
                
                // eg: Pollen 3/7, Mold 7/7 (M)
                patientBottles.push(`${b.nameOfBottle} ${patientCurrentBottleNumber}/${matchingBottle.numbBottles}`);
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
    const patientsList = await getAllPatientsHelper(providerID);
    const patientRefillsData = [];

    for (p of patientsList) {
        const patientTreatment = await treatment.findOne({
            providerID: p.providerID.toString(),
            patientID: p._id.toString(),
        });

        const providerProtocol = await protocol.findOne({providerID: p.providerID});

        if (!providerProtocol || !patientTreatment) {
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
                const matchingBottle = providerProtocol.bottles.find(
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
                treatmentStartDate: p.treatmentStartDate,
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

exports.generatePatientNeedsRetestReport = async (req, res) => {
    
}

exports.generatePatientTokensReport = async (req, res) => {

}
*/