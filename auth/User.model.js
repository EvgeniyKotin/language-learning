const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    dateOfRegistration: {
        type: Date,
        default: Date.now
    }
 })

 UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex')

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
 }

 UserSchema.methods.checkPassword = function(password) {
     let hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
     if(hashedPassword === this.hash) {
         return true
     } else {
         return false
     }
 }
 
 module.exports = mongoose.model('User', UserSchema)