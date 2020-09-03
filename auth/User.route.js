const express = require('express')
const router = express.Router()
const User = require('./User.model')

router.post('/singup', (req, res) => {
    let newUser = new User

    newUser.name = req.body.name
    newUser.email = req.body.email
    User.findOne({login: req.body.login}, (err, user) => {
        if(err) {
            return res.status(500).send({err: 'Database error'})
        }

        if(user) {
            return res.status(400).send({err: 'Login is alredy used'})
        }

        newUser.login = req.body.login
    })
    newUser.setPassword(req.body.password)

    newUser.save((err, user) => {
        if(err) {
            return res.status(500).send({err: 'Database error'})
        }

        return res.status(201).send({message: 'User added successfully'})
    })
})

router.post('/login', (req, res) => {
    User.findOne({login: req.body.login}, (err, user) => {
        if(err) {
            return res.status(500).send({err: 'Database error'})
        }

        if(!user) {
            return res.status(400).send({err: 'Wrong login or password'})
        }

        if(user.checkPassword(req.body.password)) {
            return res.status(200).send({message: 'User logged in', id: user.id})
        } else {
            return res.status(400).send({err: 'Wrong login or password'})
        }
    })
})

module.exports = router