const express = require('express');
const route = express.Router();
const userSchema = require('../../models/userModels');
const { json } = require('body-parser');
const bcrypt = require('bcrypt');
const { body, validationResult, check } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config');


route.post('/register', [
    check('password', 'password minimum 6 character').isLength({ min: 6 }),
    body('firstname', 'first gabole kosong').not().isEmpty(),
    body('lastname', 'last gabole kosong').not().isEmpty(),
    body('email', 'email gabole kosong').isEmail()
], async (req, res) => {
    try {
        //ambil data dari body yg di input client
        const errors = validationResult(req)
        const { firstname, lastname, email, password } = req.body;
        const user = await userSchema.findOne({ email })

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //cek email client
        if (user) {
            res.status(400).json({ msg: 'email already exist' })
        }
        else {
            //masukkan data kedalam variable baru
            const user = await new userSchema({
                firstname,
                lastname,
                email,
                password,
                
            })
            //encrypt password dengan module bcrypt
            let salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)
            //save input ke database
            await user.save()
            console.log(`Register user : ${user}`)

            //memberi token ke setiap user yang registrasi dengan jwt module
            const payLoad = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payLoad, config.get('secret'), (err, token) => {
                if (err) throw err
                res.status(200).json({ msg: 'Register successfull', token: token })
            })
        }
    } catch (err) {
        res.status(500).json({ msg: 'server internal error' })
    }
})

module.exports = route;