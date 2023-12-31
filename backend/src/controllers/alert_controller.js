const alert = require('../Models/alert');
const Provider = require('../Models/provider');
/*
Any time the last Injection Volume reaches the Max IV set by the Practice, 
there should be an alert to perform a Vial Test before the next injection 
record can be entered UNLESS the Bottle number is “M” (e.g., the patient is 
at his/her maintenance dose).  

If the patient is at maintenance, each injection
will be at the Max IV and the admin should be able to create at Vial Test at will.  
In fact, the admin should be able to perform a vial test any time he/she wants to, 
but should be ALERTED to perform one under the conditions mentioned above.
*/

exports.getAlerts = async (req, res) => {
    try {
        const providerID = req.params.providerID;
        
        const provider = await Provider.findById(providerID);
        if (!provider) {
            return res.status(401).json({ message: "Provider not found"});
        }

        const alerts = await alert.find({
            practiceID: provider.practiceID,
            markedForDelete: false
        }).sort({date: -1});

        return res.status(200).json(alerts);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

exports.deleteAlert = async (req, res) => {
    try {
        const id = req.params.alertID;
        const foundAlert = await alert.findById(id);

        if (!foundAlert) {
            return res.status(400).json({ message: "Alert not found"});
        }
        
        foundAlert.markedForDelete = true;
        foundAlert.deleteDate = new Date();

        await foundAlert.save();

        return res.status(200);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }

}

exports.undoDeleteAlert = async (req, res) => {
    try {
        const recentlyMarkedAlert = await alert.findOne({
            deleteDate: {$ne: null}
        }).sort({ deleteDate: -1 });

        if (!recentlyMarkedAlert) {
            return res.status(201).json({ message: "No deletions to undo." });
        }

        recentlyMarkedAlert.markedForDelete = false;
        recentlyMarkedAlert.deleteDate = null;

        await recentlyMarkedAlert.save();

        return res.status(200);
    } catch (error) {
        return res.status(402).json({ message: error.message });
    }
}

// reaction alert creation
// update providerIDs to practiceIDs
