const protocol = require('../Models/protocols');

function formatDate(date) {
    if (!date) {
        return `N/A`;
    }

    const month = date.getMonth()+1;
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${month}-${day}-${year}`;
}

function maintenancePDFHelper(foundReport) {
    // Initialize headers and rows
    const headers = ["Patient", "Vial Info", "Treatment Start Date", "DoB","Phone number", "Email"];
    const rows = [];

    foundReport.data.forEach((patient) => {
        const rowData = [
            patient.patientName,
            patient.maintenanceBottles.join('\n'),
            formatDate(patient.startDate),
            patient.DOB,
            patient.phoneNumber,
            patient.email,
        ];

        rows.push(rowData);
    });

    const table = {
        title: foundReport.reportName,
        headers: headers,
        rows: rows,
    };

    const tableOptions = {};

    return { table, tableOptions };
}

function refillsPDFHelper(foundReport) {
    // Initialize headers and rows
    const headers = ["Patient", "Needs Refill", "Expires Soon", "DoB","Phone number", "Email"];
    const rows = [];

    foundReport.data.forEach((patient) => {
        const refillBottles = patient.refillData.map(item => `${item.bottleName}: ${item.volumeLeft}ml remains`);
        const expirationBottles = patient.expirationData.map(item => `${item.bottleName}: ${formatDate(item.expirationDate)}`);

        const rowData = [
            patient.patientName,
            refillBottles,
            expirationBottles,
            patient.DOB,
            patient.phone,
            patient.email,
        ];

        rows.push(rowData);
    });

    const table = {
        title: foundReport.reportName,
        headers: headers,
        rows: rows,
    };

    const tableOptions = {};

    return { table, tableOptions };
}

function attritionPDFHelper(foundReport) {
    const headers = ["Patient Name", "Vial Info.", "Days Since Last Injection", "Date of Last Injection", "DoB","Phone number", "Email"];
    const rows = [];

    // populate rows for each patient
    foundReport.data.forEach((patient) => {
        const rowData = [
            patient.patientName,
            patient.bottlesInfo.join('\n'),
            patient.daysSinceLastInjection,
            formatDate(patient.statusDate),
            patient.DOB,
            patient.phone,
            patient.email,
        ];

        rows.push(rowData);
    });

    const table = {
        title: foundReport.reportName,
        headers: headers,
        rows: rows,
    };

    const tableOptions = {
        padding: 5,
    };

    return {table, tableOptions};
}

function needsRetestPDFHelper(foundReport) {
    // Initialize headers and rows
    const headers = ["Patient Name","Treatment Start Date","Maintenance Date","Date Last Tested","DOB","Phone number","Email"];
    const rows = [];

    foundReport.data.forEach((patient) => {
        const rowData = [
            patient.patientName,
            patient.treatmentStartDate,
            patient.maintenanceDate,
            formatDate(patient.dateLastTested),
            patient.DOB,
            patient.phoneNumber,
            patient.email,
        ];

        rows.push(rowData);
    });

    const table = {
        title: foundReport.reportName,
        headers: headers,
        rows: rows,
    };

    const tableOptions = {};

    return { table, tableOptions };
}

module.exports = {
    maintenancePDFHelper,
    refillsPDFHelper,
    attritionPDFHelper,
    needsRetestPDFHelper,
}