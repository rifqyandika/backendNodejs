const mongoose = require('mongoose')
const config = require('config')
const URI = config.get('URI')

const connectDb = async () => {
    try {
        await mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
        console.log('Mongoose Database connect to MongoDb Atlas')
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

module.exports = connectDb;