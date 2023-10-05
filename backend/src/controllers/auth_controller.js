const patient = require('../Models/patient')
const Provider = require('../Models/provider')
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
    const foundUser = await patient.findOne({ email }).exec();

    if (!foundUser) { 
        console.log("User not found")
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = password == foundUser.password ? true : false;

    if (!match) {
        console.log("Password doesn't match")
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "role": 1
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s'}
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '5m'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        maxAge: 5 * 60 * 1000
    })

    res.json({ accessToken })
}

exports.refresh = async(req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized_3' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await patient.findOne({ email: decoded.email})

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized_4' });

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "roles": 1
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
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
