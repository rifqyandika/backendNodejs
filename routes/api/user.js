const express = require('express');
const route = express.Router();
const userSchema = require('../../models/userModels');
const { json } = require('body-parser');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator')


route.post('/register', [
    body('password', 'password minimum 6 character').isLength({ min: 6 }),
    body('firstname', 'first gabole kosong').not().isEmpty(),
    body('lastname', 'last gabole kosong').not().isEmpty(),
    body('email', 'email gabole kosong').isEmail()
], async (req, res) => {
    try {
        //ambil data dari body yg di input client
        const errors = validationResult(req)
        const { firstname, lastname, username, email, password } = req.body;
        const user = await userSchema.findOne({ email })
        const userName = await userSchema.findOne({ username })

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }

        //cek email dan username client
        if (user) {
            res.status(400).json({ msg: 'email already exist' })
        } else if (userName) {
            res.status(400).json({ msg: 'username already exist' })
        }
        else {
            //masukkan data kedalam variable baru
            const user = await new userSchema({
                firstname,
                lastname,
                username,
                email,
                password
            })
            //encrypt password dengan module bcrypt
            let salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)
            //save input ke database
            // await user.save()
            console.log(user)
            res.status(200).json({ msg: 'Register successfull' })
        }
    } catch (err) {
        res.status(500).json({ msg: 'server internal error' })
    }
})

module.exports = route;