const patient = require('../Models/patient')
const provider = require('../Models/provider')
const jwt = require('jsonwebtoken')
// const asyncHandler = require('express-async-handler')

exports.login = async(req, res) => {
    const email = req.body.email.toString();
    const password = req.body.password.toString();

    // input verification
    if (!email || !password) {
        console.log("Email or password not correct")
        return res.status(400).json({ message: 'All fields required' });
    }

    // find user in database - update for providers
    const foundPatient = await patient.findOne({ email }).exec();
    const foundProvider = await provider.findOne({ email }).exec();
    let foundUser = foundPatient;
    let role = 0;

    if (!foundUser && !foundProvider) { 
        console.log("Patient/Provider not found.")
        return res.status(401).json({ message: 'Invalid email or password' });
    } else if (foundProvider) {
        console.log("Provider account found")
        role = 1;
        foundUser = foundProvider;
    } else {
        console.log("Patient found.")
        role = 2;
    }

    const match = password == foundUser.password ? true : false;

    if (!match) {
        console.log("Password doesn't match")
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // role 1: provider, role 2: patient
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser.id,
                "role": role,
                "firstName": foundUser.firstName,
                "lastName": foundUser.lastName
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m'}
    )

    const refreshToken = jwt.sign(
        { "id": foundUser.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30m'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        maxAge: 7*24*60*60*1000
    })

    res.json({ accessToken })
}

exports.refresh = async(req, res) => {
    console.log("Refresh auth func triggered");
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized_3' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            let foundUser = await patient.findOne({ id: decoded.id})

            if (!foundUser) {
                foundUser = await provider.findOne({ id: decoded.id });
                if (!foundUser) {
                    return res.status(401).json({ message: 'User not found (Refresh Token)' });
                }
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser.id,
                        "role": role,
                        "firstName": foundUser.firstName,
                        "lastName": foundUser.lastName
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            )

            res.json({ accessToken })
        }
    )
}

exports.logout = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {httpOnly: false, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie Cleared' });
}
