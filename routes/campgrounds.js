var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleWare = require("../middleware"); // requires ../middleware/index.js by default

// campgrounds routes
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

// create route
router.post("/", middleWare.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name,
        price = req.body.price,
        image = req.body.image,
        desc = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username
        };

    var newCampground = { name: name, price: price, image: image, description: desc, author: author };
    // create new campg, and add to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// new route
router.get("/new", middleWare.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    // find the campground with given id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});


// EDIT campground route
router.get("/:id/edit", middleWare.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", "Unknown error");
        }
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// UPDATE campground route
router.put("/:id", middleWare.checkCampgroundOwnership, function(req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        })
        // redirect to show page
});

// Destroy campground route
router.delete("/:id", middleWare.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});




module.exports = router;