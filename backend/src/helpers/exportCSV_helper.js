const protocol = require('../Models/protocols');

function formatDate(date) {
    if (date === "N/A"){
        return date;
    }
    const month = date.getMonth()+1;
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${month}-${day}-${year}`;
}

function maintenanceCSVHelper(foundReport) {
    const csvHeaders = "Patient,Vial Info,Treatment Start Date,DoB,Phone number,Email";

    const csvData = foundReport.data.map(patient => {
        const patientName = patient.patientName;
        const approachingMaintenanceFor = patient.maintenanceBottles.join('\n');
        const treatmentStartDate = formatDate(patient.startDate);
        const DOB = patient.DOB;
        const phoneNumber = patient.phoneNumber;
        const email = patient.email;

        return `${patientName},"${approachingMaintenanceFor}",${treatmentStartDate},${DOB},${phoneNumber},${email}`;
    }).join('\n');

    const csv = csvHeaders + '\n' + csvData;

    return csv;
}

function attritionCSVHelper (foundReport) {
    const csvHeaders = "Patient Name,Vial Info.,Days Since Last Injection,Date of Last Injection,DOB,Phone Number,Email"

    const csvData = foundReport.data.map(patient => {
        const patientName = patient.patientName;
        const bottlesInfo = patient.bottlesInfo.join('\n');
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
    const columnTitles = ["Patient","Treatment Start Date","Maintenance Date","Date Last Tested","DOB","Phone number","Email"];

    const csvData = foundReport.data.map(patient => {
        return [
            patient.patientName,
            patient.treatmentStartDate,
            formatDate(patient.maintenanceDate),
            formatDate(patient.dateLastTested),
            patient.DOB,
            patient.phoneNumber,
            patient.email
        ].join(',');
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