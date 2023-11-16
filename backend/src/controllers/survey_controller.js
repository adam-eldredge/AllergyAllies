const survey = require('../Models/survey')
const { addProtocol } = require('../controllers/protocol_controller');

exports.addSurvey = async (req, res) => {
    try {
        const {pID, surveyData} = req.body;
        console.log(`pID: ${pID}`)
        console.log(`JSON: ${surveyData}`)
        const data = new survey({
            practiceID: pID,
            surveyData: surveyData
        });
        const dataToSave = await data.save();
        addProtocol(dataToSave);
        return res.status(200).json(dataToSave);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.getAllSurveys = async (req, res) => {
    try {
        const data = await survey.find();
        res.json(data);
    } 
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}