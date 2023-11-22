const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser.id,
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        {
            "username": foundUser.username,
            "id": foundUser.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true, // allow https
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })

}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - access token expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' })
            }

            const foundUser = await User.findOne({ username: decoded.username })

            if (!foundUser) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "id": foundUser.id,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )
            res.json({ accessToken })
        }
    )

}

// @desc Logout
// @route POST /auth/logout
// @access Public - clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
        return res.sendStatus(204) // No content
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}