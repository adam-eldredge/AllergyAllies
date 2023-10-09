const practice = require('../Models/practice');
const multer = require('multer');

exports.addPractice = async (req, res) => {
    try {
        const { practiceName, practiceAddress, antigensTested, logo, scrollingAds } = req.body;
        const data = new practice({
            practiceName, practiceAddress, antigensTested, logo, scrollingAds
        });
        // PREVENT DUPLICATES
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.deletePractice = async (req, res) => {
    try {
        const id = req.params.id;
        const practiceToDelete = await practice.findById(id);
        if (!practiceToDelete) {
            res.status(404).json({ message: "Practice not found" });
        }
        const practiceName = practiceToDelete.practiceName;

        await practice.findByIdAndDelete(id);
        res.status(200).json({ message: `Document with ${practiceName} has been deleted..` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getLocation = async (req, res) => {
    try {
        const practiceID = req.params.id;
        const practiceExtract = await practice.findById(practiceID);

        if (!practiceExtract) {
            return res.status(404).json({message: "Practice not found."});
        } 

        res.json(practiceExtract.practiceAddress);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.setImages = async (req, res) => {
    // get practice id
    const id = req.params.id;
    const practiceToUpload = await practice.findById(id);
    if (!practiceToUpload) {
        res.status(404).json({ message: "Practice not found" });
    }
    
    // store image locally
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, '/backend/src/images');
        },
        filename: (req, file, cb) => {
            cb(null, file.name);
        },
    });

    const upload = multer({ storage }).single('logo');

    console.log(req.file);
}

exports.getLogo = async (req, res) => {

}

exports.getScrollingAds = async (req, res) => {

}

exports.getAntigensTested = async (req, res) => {
    try {
        const practiceID = req.params.id;
        const practiceExtract = await practice.findById(practiceID);

        if (!practiceExtract) {
            return res.status(404).json({message: "Practice not found."});
        } 

        res.json(practiceExtract.practiceAddress);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}