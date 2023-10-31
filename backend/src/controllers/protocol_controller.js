const protocol = require('../Models/protocol');

exports.addProtocol = async (req, res) => {
    try {
        // see protocol.js for bottles/vialtest format
        const { NPI, bottles, vialTestReactionAdjustment, appointmentSchedule } = req.body;

        const data = new protocol({
            NPI, bottles, vialTestReactionAdjustment, appointmentSchedule
        });

        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.getProtocol = async (req, res) => {
    try {
        const npi = req.params.NPI;
        const foundProtocol = await protocol.findOne({ NPI: npi }).exec();

        if (!foundProtocol) {
            return res.status(404).json({ message: "Protocol not found"});
        }

        return res.status(200).json({ protocol: foundProtocol });
    } catch (err) {
        return res.status(400).json({ message: error.message });
    }
}