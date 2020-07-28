const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true})
        console.log('Mongoose Database connect to MongoDb Atlas')
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

module.exports = connectDb;