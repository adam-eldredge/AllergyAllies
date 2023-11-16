const { Report } = require('../Models/report');

async function generateReport(providerID, practiceID, reportType, manual, data) {
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
            practiceID,
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

async function findMatchingBottle(patient, bottle) {

    const matchingBottle = patient.maintenanceBottleNumber.find(
        (patientBottle) => patientBottle.nameOfBottle === bottle.nameOfBottle
    );

    return matchingBottle;
}

module.exports = {
    findMatchingBottle,
    generateReport,
}