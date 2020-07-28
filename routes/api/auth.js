const express = require('express');
const route = express.Router();
const Auth = require('../../middleware/auth')
const userSchema = require('../../models/userModels');
const { body, validationResult, check } = require('express-validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config')

route.get('/auth', Auth, (req, res) => {
    res.json({ msg: 'page route auth' })
})

route.post('/', [
    check('email', 'masukkan email yang valid').isEmail(),
    check('password', 'masukkan password').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        //ambil data dari body yg di input client
        const user = await userSchema.findOne({ email })
        if (!user) {
            return res.status(400).json([{ msg: 'email invalid' }])
        }
        //compare password//decrypt password user
        let isMatch = await bcrypt.compare(password, user.password)
        //cek email dan password client
        if (!isMatch) {
            return res.status(400).json([{ msg: 'password invalid' }])
        }
        const payLoad = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payLoad, config.get('secret'), (err, token) => {
            if (err) throw err
            res.status(200).json({ token: token })
        })

    } catch (err) {
        res.status(500).json({ msg: 'server internal error' })
    }
})

module.exports = route;