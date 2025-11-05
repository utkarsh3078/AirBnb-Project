const mongoose = require("mongoose");
const data = require("./data");
const Listing = require("../models/listing");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err); 
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("Database Initialized");
}

initDb();