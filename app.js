const express = require('express')
const app = express()
const config = require('config')
const mongoose = require('mongoose')

const PORT = config.get('port') || 3001
const mongoUri = config.get('mongoUri')

app.use(express.json({ extended: true }));
app.use('/auth', require('./auth/User.route'))

async function startServer() {
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }, (err) => {
        if (err) {
            throw err
            return
        }
        console.log('Server have connected to database')
    })
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
}

startServer()