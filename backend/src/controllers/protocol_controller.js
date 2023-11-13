const protocol = require('../Models/protocols');

exports.addProtocol = async (req, res) => {
    try { 
        // see protocol.js for bottles/vialtest format
        const { 
            providerID, appointmentSchedule, nextDoseAdjustment, missedDoseAdjustment1, missedDoseAdjustment2, 
            missedDoseAdjustment3, missedDoseAdjustment4, bottles, vialTestReactionAdjustment, 
        } = req.body;

        const data = new protocol({
            providerID, appointmentSchedule, nextDoseAdjustment, missedDoseAdjustment1, missedDoseAdjustment2, 
            missedDoseAdjustment3, missedDoseAdjustment4, bottles, vialTestReactionAdjustment, 
        });
    
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        return res.status(400).json({ message: `Issue adding protocol: ${error.message}` });
    }
}

exports.getProtocol = async (req, res) => {
    try {
        const practiceID = req.params.practiceID;
        const foundProtocol = await protocol.findOne({ practiceID: practiceID }).exec();

        if (!foundProtocol) {
            return res.status(404).json({ message: "Protocol not found"});
        }

        return res.status(200).json({ protocol: foundProtocol });
    } catch (err) {
        return res.status(400).json({ message: error.message });
    }
}