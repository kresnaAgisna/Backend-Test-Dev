const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Halo'

function signToken(obj) {
    return jwt.sign(obj, JWT_SECRET)
}

function verifyToken(accessToken) {
    return jwt.verify(accessToken, JWT_SECRET)
}

module.exports = { signToken, verifyToken }