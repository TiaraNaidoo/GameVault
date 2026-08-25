// import mongoose
const mongoose = require("mongoose");

/* connect gameVault to mongoDB

connection = asynchronous

backend needs to:
- contact MongoDB
- establish a network connection
- authenticate db user
- select deployment = cluster provider
- establish a usable db connection

connection = asynchronous...why? because server should wait for this operation before
accepting API requests
*/

const connectDB = async () => {

    // read the mongodb connection string
    const mongoURI = process.env.MONGODB_URI;

    // dont let the backedn start without the req db config
    if (!mongoURI) {
        throw new Error(
            "MONGODB_URI is not ready/configured."
        );
    }
   // mongoose.connect establishes the connection
    await mongoose.connect(mongoURI);

    console.log("GameVault connected to MongoDB successfully.");

};

module.exports = connectDB;