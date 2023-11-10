const protocol = require('../Models/protocols');

async function addProtocol(surveyData) {
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

/*
exports.getProtocol = async (req, res) => {
    try {
        const providerID = req.params.providerID;
        const foundProtocol = await protocol.findOne({ providerID: providerID }).exec();

        if (!foundProtocol) {
            return res.status(404).json({ message: "Protocol not found"});
        }

        return res.status(200).json({ protocol: foundProtocol });
    } catch (err) {
        return res.status(400).json({ message: error.message });
    }
}
*/

module.exports = {
    addProtocol,
    updateProtocol,
}