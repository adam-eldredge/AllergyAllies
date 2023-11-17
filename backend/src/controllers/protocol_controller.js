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

const updateProtocol = async (req, res) => {
    try {
        const practiceID = req.params.practiceID

        const query = { practiceID : practiceID }
        let foundProtocol = await protocol.updateOne(query, req.body)

        if (!foundProtocol) {
            return res.status(400).json({ message: "Protocol not found"});
        }

        return res.status(200).json({ protocol: foundProtocol });
    } catch (err) {
        return res.status(400).json({ message: err.message });
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