const Listing = require("../models/listing");
const {listingSchema} = require("../schema");
const fetch = require('node-fetch');

async function geoCodeLocation(location) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'SmartCropWatch/1.0 (shivam.tyagi01@gmail.com)'
        }
    });

    const data = await response.json();
    if (data && data.length > 0) {
        return {
            type: "Point",
            coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
        };
    } else {
        throw new Error("Location not found");
    }
}


module.exports.index = async (req, res)=>{
    let allData = await Listing.find({});
    res.render("listings/index.ejs" , {allData});
};

module.exports.renderNewForm = (req , res) => {
    res.render("listings/new.ejs");
}; 

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const data = await Listing.findById(id).populate({path : "reviews" , populate: {
        path : "author",
    },}).populate("owner");
    // console.log(data.reviews[0].author.username);
    console.log(data);
    if(!data){
        req.flash("error" , "Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    // console.log(data);
    // console.log(data);
    res.render("listings/show.ejs" , {data});
}

module.exports.createListing = async (req, res , next) =>{
        const geoData = await geoCodeLocation(req.body.listing.location);
        let url = req.file.path;
        let filename = req.file.filename;
        let listing = req.body.listing;
        const newListing = new Listing(listing);
        newListing.geometry = geoData;
        newListing.owner = req.user._id;
        newListing.image = {url , filename};
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success" , "New Listing Created !");
        res.redirect("/listings");
    
};

module.exports.editListing = async (req ,res) =>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error" , "Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    let originalImageUrl = data.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs" , {data , originalImageUrl});
};

module.exports.updateListing =async (req , res) => {
    
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success" , "Your Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
};