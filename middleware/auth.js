const jwt = require('jsonwebtoken');
const config = require('config')

const Auth = (req, res, next) => {
    //ambil token dari header
    const token = req.header('x-auth-token')

    //cek token 
    if(!token){
        return res.status(401).json({ msg: 'not token' })
    }
    try {
        //verify token dengan jwt decoded
        const decoded = jwt.verify(token, config.get('secret'))
        req.user = decoded.user;
        next()
    } catch (err) {
        res.status(401).json({msg: ' your token invalid'})
    }
}

module.exports = Auth;