const Listing=require("../models/listing.js");

module.exports.index=async (req, res) => {
    let data = await Listing.find();
    res.render("./listings/index.ejs", { data });
}

module.exports.renderNewForm=(req, res) => {
    
    res.render("./listings/new.ejs");
}

module.exports.postNewform=async (req, res) => {
    // console.log(req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;

    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","listing added successfully");
    res.redirect("/listings");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("owner").populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    });
    console.log(data.owner);
    if(!data){
        req.flash("error","Listing does not exits");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { data });
}


module.exports.getEditForm=async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    // res.send("working goof");
    if(!data){

        req.flash("error","Listing does not exits");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { data });
};

module.exports.postEditForm=async (req, res) => {
    
    let { id } = req.params;
    let data = req.body;
    let listing=await Listing.findByIdAndUpdate(id, data.listing);
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted successfully");
    res.redirect("/listings");
};