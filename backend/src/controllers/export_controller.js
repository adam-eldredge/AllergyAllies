const { Report } = require('../Models/report');
const protocol = require('../Models/protocols');
const PDFDocument = require('pdfkit-table');
const fs = require("fs");

function maintenanceCSVHelper (foundReport) {
    // Convert the data to a CSV string
    const csv = `Patient Name,Approaching Maintenance\n${foundReport.data.map(record => 
        `${record.patientName},${record.approachingMaintenance}`).join('\n')}`;
    return csv;
}

function attritionCSVHelper (foundReport) {
    const csv = `Patient Name,Status,Email,Phone Number\n${foundReport.data.map(record => 
        `${record.patientName},${record.status},${record.email},${record.phone}`).join('\n')}`;
    return csv;
}

async function refillsCSVHelper(foundReport) {
    const protocolBottles = await protocol.find({ NPI: foundReport.NPI }).select('bottles');
  
    // get bottle names from the first element in the protocolBottles array
    const bottleNames = protocolBottles[0]?.bottles.map(bottle => bottle.bottleName) || [];
  
    const columnTitles = ['Patient Name', ...bottleNames, 'Email', 'Phone Number'];
  
    const csv = `${columnTitles.join(',')}\n${foundReport.data.map(record => 
      `${record.patientName},${record.bottleData.join(',')},${record.email},${record.phone}`).join('\n')}`;
  
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
            case "approachingMaintenance":
                csv = maintenanceCSVHelper(foundReport);
                break;
            case "Refills":
                csv = refillsCSVHelper(foundReport);
                break;
            case "Attrition":
                csv = attritionCSVHelper(foundReport);
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
    const headers = ["Patient Name", "Attrition"];

    const table = {
        title: `${foundReport.reportName}`,
        headers: headers, // Define your table headers
        rows: [], // Initialize an empty array for rows
    };
    
    // Populate the rows array with data from foundReport.data
    foundReport.data.forEach((record) => {
        const rowData = [record.patientName, record.approachingMaintenance];
        table.rows.push(rowData);
    });

    const tableOptions = {
        // Specify table options here, if any
    };

    return {table, tableOptions};
}

// needs update
function refillsPDFHelper(foundReport) {
    const headers = ["Patient Name", "Attrition"];

    const table = {
        title: `${foundReport.reportName}`,
        headers: headers, // Define your table headers
        rows: [], // Initialize an empty array for rows
    };
    
    // Populate the rows array with data from foundReport.data
    foundReport.data.forEach((record) => {
        const rowData = [record.patientName, record.approachingMaintenance];
        table.rows.push(rowData);
    });

    const tableOptions = {
        // Specify table options here, if any
    };

    return {table, tableOptions};
}

// needs update
function attritionPDFHelper(foundReport) {
    const headers = ["Patient Name", "Attrition"];

    const table = {
        title: `${foundReport.reportName}`,
        headers: headers, // Define your table headers
        rows: [], // Initialize an empty array for rows
    };
    
    // Populate the rows array with data from foundReport.data
    foundReport.data.forEach((record) => {
        const rowData = [record.patientName, record.approachingMaintenance];
        table.rows.push(rowData);
    });

    const tableOptions = {
        // Specify table options here, if any
    };

    return {table, tableOptions};
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
        case "approachingMaintenance":
            tableObject = maintenancePDFHelper(foundReport);
            break;
        case "Refills":
            tableObject = refillsPDFHelper(foundReport);
            break;
        case "Attrition":
            tableObject = attritionPDFHelper(foundReport);
            break;
        default:
            return res.status(400).json({ message: "Unsupported report type" });
    }

    // create table
    await doc.table(tableObject.table, tableObject.tableOptions);

    doc.end();
}
