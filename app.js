const express = require("express");
const app = express()
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");       //For working of veiws folder
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(()=>{
    console.log("Connected to db");
   })
   .catch((err)=> {
    console.log(err);
   });

async function main(){
   await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));   //For parsing the data
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));  //For css file

app.get("/", (req,res)=>{
   res.send("Hello World");
})

 //Index Route
app.get("/Listings", async(req,res)=>{
   const allListing = await Listing.find({})
   res.render("./Listing/index.ejs", {allListing});
})

//New route
app.get("/Listings/new", (req,res)=>{
   res.render("./Listing/new.ejs");
})

//Show route 
app.get("/Listings/:id", async(req,res)=>{
   const {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("./Listing/show.ejs", {listing});
})

//Create route
app.post("/Listings", async(req,res)=>{
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/Listings");
});

//Edit Route
app.get("/Listings/:id/edit", async(req,res)=>{
   const {id} = req.params; 
   const listing = await Listing.findById(id);
   res.render("./Listing/edit.ejs", {listing});
})

//Update Route
app.put("/Listings/:id", async(req,res)=>{            //Put is used for updating the data and we used method override here also so post ke jage put aayega
   const {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/Listings/${id}`);
});

//Delete Route
app.delete("/Listings/:id", async(req,res)=>{
   const{id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/Listings");
})

// app.get("/testListing", async (req,res)=>{
//  let sampleTesting = new Listing({
//   title:"My new vila",
//   description:"This is a beautiful vila",
//   price: 12000,
//   location: "London",
//   country: "UK",
//   });

// await sampleTesting.save();
//    console.log("Sample collected");
//    res.send("Testing Successful");
// })

app.listen(8080, ()=>{
    console.log("Connected to server 8080");
 })


