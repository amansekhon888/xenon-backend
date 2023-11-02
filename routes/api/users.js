const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require("express-validator");
const User = require('../../models/User');

router.get('/', (req, res) => res.send('User route'));

router.post('/', 
    [ 
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password must have at least 4 characters').isLength({ min: 4 })
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const {name, email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ errors: [{msg: 'User already exists'}] });
        }

        user = new User ({
            name, email, password
        });
1
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 720000},
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
        // res.json(req.body);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    };
});

module.exports = router;