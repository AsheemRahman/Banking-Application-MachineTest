const mongoose = require('mongoose')
require('dotenv').config();

//Database connection

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log("mongodb connected")
    } catch (error) {
        console.log(`error while connecting mongodb ${error}`)
    }
}

module.exports = connectDB;