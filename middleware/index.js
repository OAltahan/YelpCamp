var Campground = require("../models/campground"),
    Comment = require("../models/comment");

// all the middleware goes here

var middlewareObj = {
    checkCampgroundOwnership: function() {}
};

// middlware to check if user is logged in and he/she is the campground owner to edit or delete
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // check if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

// middlware to check if user is logged in and he/she is the campground owner to edit or delete
middlewareObj.checkCommentOwnership = function(req, res, next) {
    // check if user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

// middleware to check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that"); // write it before rendering the next page, it works on the following page of the call
    res.redirect("/login");
}


module.exports = middlewareObj;