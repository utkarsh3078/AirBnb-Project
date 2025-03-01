const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{
        type: String,
        default: "https://unsplash.com/photos/a-large-white-building-with-a-tree-in-front-of-it-2YZBMkZPgRE",
        set: (v) => v==="" ? "https://unsplash.com/photos/a-large-white-building-with-a-tree-in-front-of-it-2YZBMkZPgRE": v,
    },
    price: Number,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
