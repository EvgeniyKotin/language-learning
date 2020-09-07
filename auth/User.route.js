const express = require('express')
const router = express.Router()
const User = require('./User.model')

router.post('/singup', async (req, res) => {
    if(!(req.body.name && req.body.login && req.body.password && req.body.email)) {
        return res.status(400).send({err: 'Not full request'})
    }

    let newUser = new User

    newUser.name = req.body.name
    newUser.email = req.body.email
    req.body.login = req.body.login.toString().toLowerCase()
    await User.findOne({login: req.body.login}, (err, user) => {
        if(err) {
            console.log(err)
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
            console.log(err)
            return res.status(500).send({err: 'Database error'})
        }

        return res.status(201).send({message: 'User added successfully', id: user.id})
    })
})

router.post('/login', (req, res) => {
    User.findOne({login: req.body.login}, (err, user) => {
        if(err) {            
            console.log(err)
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