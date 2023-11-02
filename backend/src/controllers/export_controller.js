const { Report } = require('../Models/report');
const protocol = require('../Models/protocols');
const PDFDocument = require('pdfkit-table');
//const fs = require("fs");

function formatDate(date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${month}-${day}-${year}`;
}

function maintenanceCSVHelper(foundReport) {
    const csvHeaders = "Patient Name,Approaching Maintenance For,Treatment Start Date,Phone number,Email";

    const csvData = foundReport.data.map(patient => {
        const patientName = patient.patientName;
        const approachingMaintenanceFor = patient.maintenanceBottles.join(', ');
        const treatmentStartDate = formatDate(patient.startDate);
        const phoneNumber = patient.phoneNumber;
        const email = patient.email;

        return `${patientName},"${approachingMaintenanceFor}",${treatmentStartDate},${phoneNumber},${email}`;
    }).join('\n');

    const csv = csvHeaders + '\n' + csvData;

    return csv;
}

function attritionCSVHelper (foundReport) {
    const csv = `Patient Name,Attrition Date,Email,Phone Number\n${foundReport.data.map(record => 
        `${record.patientName},${formatDate(record.statusDate)},${record.email},${record.phone}`).join('\n')}`;
    return csv;
}

// needs test and verification with williams
async function refillsCSVHelper(foundReport) {
    const protocolBottles = await protocol.find({ providerID: foundReport.providerID }).select('bottles');
  
    // get bottle names from the first element in the protocolBottles array
    const bottleNames = protocolBottles[0]?.bottles.map(bottle => bottle.bottleName) || [];
  
    const columnTitles = ['Patient Name', ...bottleNames, 'Email', 'Phone Number'];
  
    const csv = `${columnTitles.join(',')}\n${foundReport.data.map(record => 
      `${record.patientName},${record.bottleData.join(',')},${record.email},${record.phone}`).join('\n')}`;
  
    return csv;
}

function needsRetestCSVHelper(foundReport) {
    const columnTitles = ['Patient Name', 'Needs Retest For', 'Maintenance Date', 'Phone Number', 'Email'];

    const csvData = foundReport.data.map(patient => {
        const bottleNames = patient.bottles.map(bottle => bottle.bottleName).join(', ');
        const maintenanceDates = patient.bottles.map(bottle => formatDate(bottle.maintenanceDate)).join(', ');
        return `${patient.patientName},"${bottleNames}","${maintenanceDates}",${patient.phoneNumber},${patient.email}`;
    });

    const csv = `${columnTitles.join(',')}\n${csvData.join('\n')}`;

    return csv;
}

exports.getReportCSV = async (req, res) => {
    const reportID = req.params.id;

    try {
        const foundReport = await Report.findById(reportID);

        if (!foundReport) {
            return res.status(400).json({ message: "Report not found" });
        }

        let csv;

        switch (foundReport.reportType) {
            case "ApproachingMaintenance":
                csv = maintenanceCSVHelper(foundReport);
                break;
            case "Refills":
                csv = refillsCSVHelper(foundReport);
                break;
            case "Attrition":
                csv = attritionCSVHelper(foundReport);
                break;
            case "NeedsRetest":
                csv = needsRetestCSVHelper(foundReport);
                break;
            default:
                return res.status(400).json({ message: "Unsupported report type" });
        }

        // Set the content type and disposition for download with a dynamic filename
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${foundReport.reportName}.csv`);

        // Send the CSV data as the response
        res.send(csv);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

function maintenancePDFHelper(foundReport) {
    // Initialize headers and rows
    const headers = ["Patient", "Approaching Maintenance For", "Treatment Start Date", "Phone number", "Email"];
    const rows = [];

    foundReport.data.forEach((patient) => {
        const rowData = [
            patient.patientName,
            patient.maintenanceBottles.join(', '),
            formatDate(patient.startDate),
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

// needs update
async function refillsPDFHelper(foundReport) {
    const protocolBottles = await protocol.find({ providerID: foundReport.providerID }).select('bottles');
    const extraHeaders = ["Phone", "Email"];
    const headers = ["Patient Name", ...protocolBottles.map((i) => i), ...extraHeaders];

    const table = {
        title: `${foundReport.reportName}`,
        headers: headers, // Define your table headers
        rows: [], // Initialize an empty array for rows
    };

    // Populate the rows array with data from foundReport.data
    foundReport.data.forEach((record) => {
        const rowData = [record.patientName, ...record.refillData.map(item => item.needsRefill), record.phone, record.email];
        table.rows.push(rowData);
    });

    const tableOptions = {};

    return { table, tableOptions };
}

// needs update
function attritionPDFHelper(foundReport) {
    const headers = ["Patient Name", "Attrition Date", "Email", "Phone Number"];

    const table = {
        title: `${foundReport.reportName}`,
        headers: headers, // Define your table headers
        rows: [], // Initialize an empty array for rows
    };
    
    // Populate the rows array with data from foundReport.data
    foundReport.data.forEach((record) => {
        const rowData = [record.patientName, formatDate(record.statusDate), record.email, record.phone];
        table.rows.push(rowData);
    });

    const tableOptions = {
        // Specify table options here, if any
    };

    return {table, tableOptions};
}

function needsRetestPDFHelper(foundReport) {
    // Initialize headers and rows
    const headers = ["Patient", "Needs Retest For", "Maintenance Dates", "Phone number", "Email"];
    const rows = [];

    foundReport.data.forEach((patient) => {
        // Extract the bottle names and maintenance dates separately
        const bottleNames = patient.bottles.map(bottle => bottle.bottleName).join(', ');
        const maintenanceDates = patient.bottles.map(bottle => formatDate(bottle.maintenanceDate)).join(', ');

        const rowData = [
            patient.patientName,
            bottleNames,
            maintenanceDates,
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


exports.getReportPDF = async (req, res) => {
    const reportID = req.params.id;

    const foundReport = await Report.findById(reportID);

    if (!foundReport) {
        return res.status(400).json({ message: "Report not found" });
    }
    let doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Set the content type and disposition for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${foundReport.reportName}.pdf`);

    // Pipe the PDF to the response if you're serving it directly to the client
    doc.pipe(res);
    
    let tableObject;

    switch (foundReport.reportType) {
        case "ApproachingMaintenance":
            tableObject = maintenancePDFHelper(foundReport);
            break;
        case "Refills":
            tableObject = refillsPDFHelper(foundReport);
            break;
        case "Attrition":
            tableObject = attritionPDFHelper(foundReport);
            break;
        case "NeedsRetest":
            tableObject = needsRetestPDFHelper(foundReport);
            break;
        default:
            return res.status(400).json({ message: "Unsupported report type" });
    }

    // create table
    await doc.table(tableObject.table, tableObject.tableOptions);

    doc.end();
}
