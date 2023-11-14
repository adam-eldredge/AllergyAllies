const protocol = require('../Models/protocols');

function formatDate(date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = date.getMonth()+1;
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${month}-${day}-${year}`;
}


function maintenanceCSVHelper(foundReport) {
    const csvHeaders = "Patient Name,Vial Info,Treatment Start Date,Phone number,Email";

    const csvData = foundReport.data.map(patient => {
        const patientName = patient.patientName;
        const approachingMaintenanceFor = patient.maintenanceBottles.join(', ');
        const treatmentStartDate = formatDate(patient.startDate);
        const DOB = patient.DOB;
        const phoneNumber = patient.phoneNumber;
        const email = patient.email;

        return `${patientName},"${approachingMaintenanceFor}",${DOB},${treatmentStartDate},${phoneNumber},${email}`;
    }).join('\n');

    const csv = csvHeaders + '\n' + csvData;

    return csv;
}

function attritionCSVHelper (foundReport) {
    const csvHeaders = "Patient Name,Vial Info.,Days Since Last Inj.,Date of Last Injection,DOB,Phone Number,Email"

    const csvData = foundReport.data.map(patient => {
        const patientName = patient.patientName;
        const bottlesInfo = patient.bottlesInfo.join(', ');
        const daysSinceLastInjection = patient.daysSinceLastInjection;
        const attritionDate = formatDate(patient.statusDate);
        const DOB = patient.DOB;
        const phoneNumber = patient.phone;
        const email = patient.email;

        return `${patientName},"${bottlesInfo}",${daysSinceLastInjection},${attritionDate},${DOB},${phoneNumber},${email}`;
    }).join('\n')

    const csv = csvHeaders + '\n' + csvData;
    return csv;
}

function refillsCSVHelper(foundReport) {
    const headers = ["Patient","Needs Refill","Expires Soon","DoB","Phone number","Email"];

    const csvData = foundReport.data.map(patient => {
        const refillBottles = patient.refillData.map(item => `${item.bottleName}: ${item.volumeLeft}ml remains`).join(', ');
        const expirationBottles = patient.expirationData.map(item => `${item.bottleName}: ${formatDate(item.expirationDate)}`).join(', ');
        
        // Properly escape and enclose fields in double quotes
        return `"${patient.patientName}","${refillBottles}","${expirationBottles}","${patient.DOB}","${patient.phone}","${patient.email}"`;
    });

    const csv = `"${headers.join('","')}"\n${csvData.join('\n')}`;

    return csv;
}

function needsRetestCSVHelper(foundReport) {
    const columnTitles = ["Patient","Needs Retest For","Maintenance Dates","Treatment Start Date","DOB","Phone number","Email"];

    const csvData = foundReport.data.map(patient => {
        const bottleNames = patient.bottles.map(bottle => bottle.bottleName).join(', ');
        const maintenanceDates = patient.bottles.map(bottle => formatDate(bottle.maintenanceDate)).join(', ');
        return `${patient.patientName},"${bottleNames}","${maintenanceDates}",${patient.treatmentStartDate},${patient.DOB},${patient.phoneNumber},${patient.email}`;
    });

    const csv = `${columnTitles.join(',')}\n${csvData.join('\n')}`;

    return csv;
}

module.exports = {
    maintenanceCSVHelper,
    attritionCSVHelper,
    refillsCSVHelper,
    needsRetestCSVHelper,
}