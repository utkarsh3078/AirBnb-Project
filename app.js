const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//by below line we can parse the data that is comming in req
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hi I am root");
});

//Index Route
app.get(
  "/Listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route
app.get("/Listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post(
  "/Listings",
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new expressError("Invalid Listing Data", 400);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/Listings");
  })
);

//Show Route
app.get(
  "/Listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//edit route
app.get(
  "/Listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
app.put(
  "/Listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/Listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/Listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/Listings");
  })
);

// app.all("*", (req, res, next) => {
//   next(new expressError("Page not found", 404));
// });

//error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
