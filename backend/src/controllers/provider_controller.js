const provider = require('../Models/provider');

// Post method
exports.addProvider = async (req, res) => {
    try {
        const { firstName, lastName, email, password, NPI, practiceID } = req.body;
        const data = new provider({
            firstName, lastName, email, password, NPI, practiceID
        });

        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all method
exports.getAllProviders = async (req, res) => {
    try {
        const data = await provider.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get provider by email
exports.getProviderEmail = async (req, res) => {
    try {
        const email = req.body.email.toString();
        const NPI = req.body.NPI.toString();
        const data = await provider.findOne({ email: email });
        const data2 = await provider.findOne({ NPI: NPI});
        if (data === null) {
            if(data2 === null){
                res.sendStatus(200);
            }
            else{
                res.sendStatus(208);
            }
        }
        else {
            res.sendStatus(201);
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete by ID method
exports.deleteProvider = async (req, res) => {
    try {
        const id = req.params.id;
        const providerToDelete = await provider.findById(id);
        if (!providerToDelete) {
            res.status(404).json({ message: "Provider not found" });
        }
        const firstname = providerToDelete.firstName;

        await provider.findByIdAndDelete(id);
        res.status(200).json({ message: `Document with ${firstname} has been deleted..` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get provider by id
exports.getProvider = async (req, res) => {
    try {
        const id = req.params.id;
        const foundProvider = await provider.findById(id);
        if (foundProvider) {
            return res.status(200).json(foundProvider);
        } else {
            return res.status(404).json({ message: `Provider not found: ${id}` });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

