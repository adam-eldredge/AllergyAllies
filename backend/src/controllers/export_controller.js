const { Report } = require('../Models/report');
const PDFDocument = require('pdfkit-table');
const { 
    maintenanceCSVHelper, 
    refillsCSVHelper, 
    attritionCSVHelper, 
    needsRetestCSVHelper
} = require('../helpers/exportCSV_helper');
const {
    maintenancePDFHelper,
    refillsPDFHelper,
    attritionPDFHelper,
    needsRetestPDFHelper,
} = require('../helpers/exportPDF_helper');

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
