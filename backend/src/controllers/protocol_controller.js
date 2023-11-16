const protocol = require('../Models/protocols');

const addProtocol = async (req, res) => {
    try {

        const {
            practiceID,
            nextDoseAdjustments,
            bottles,
            vialTestReactionAdjustment,
            missedDoseAdjustment,
            largeReactionsDoseAdjustment,
        } = req.body

        const data = new protocol ({
            practiceID,
            nextDoseAdjustments,
            bottles,
            vialTestReactionAdjustment,
            missedDoseAdjustment,
            largeReactionsDoseAdjustment
    })
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        
    }
}

async function updateProtocol(surveyData) {
    try { 
        const { 
            providerID, appointmentSchedule, nextDoseAdjustment, missedDoseAdjustment1, missedDoseAdjustment2, 
            missedDoseAdjustment3, missedDoseAdjustment4, bottles, vialTestReactionAdjustment, 
        } = req.body;

        const data = new protocol({
            providerID, appointmentSchedule, nextDoseAdjustment, missedDoseAdjustment1, missedDoseAdjustment2, 
            missedDoseAdjustment3, missedDoseAdjustment4, bottles, vialTestReactionAdjustment, 
        });
    
        await data.save();
    }
    catch (error) {
        
    }
}


const getProtocol = async (req, res) => {
    try {
        const practiceID = req.params.practiceID;
        const foundProtocol = await protocol.findOne({ practiceID: practiceID }).exec();

        if (!foundProtocol) {
            return res.status(201).json({ message: "Protocol not found"});
        }

        return res.status(200).json({ protocol: foundProtocol });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    addProtocol,
    updateProtocol,
    getProtocol,
}